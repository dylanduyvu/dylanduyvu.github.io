import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';

import { classifyAttemptArtifacts } from '../lib/event-classifier.mjs';
import { completedUsage, jsonl, structuralError, validPredictionResponse } from './attempt-fixtures.mjs';

const finalBytes = (value = validPredictionResponse()) => Buffer.from(JSON.stringify(value));
const classify = (overrides = {}) => classifyAttemptArtifacts({
  eventsBytes: jsonl(completedUsage()),
  finalBytes: finalBytes(),
  finalSha256: null,
  processExitCode: 0,
  timedOut: false,
  spawnFailed: false,
  localIoBeforeFinal: false,
  stderrBytes: Buffer.alloc(0),
  ...overrides,
});

test('structural tool request overrides a schema-valid final', () => {
  const result = classify({ eventsBytes: jsonl({ type: 'tool.requested', tool_name: 'shell' }, completedUsage()) });
  assert.deepEqual([result.classification, result.code], ['terminal_invalid', 'attempted_tool_use']);
});

test('structural tool invocation overrides a schema-valid final', () => {
  for (const phase of ['item.started', 'item.completed']) {
    for (const type of [
      'tool_call',
      'command_execution',
      'file_change',
      'web_search',
      'collab_tool_call',
      'todo_list',
      'future_unrecognized_active_item',
    ]) {
      const result = classify({ eventsBytes: jsonl({ type: phase, item: { type, name: 'structural-operation' } }, completedUsage()) });
      assert.deepEqual([result.classification, result.code], ['terminal_invalid', 'attempted_tool_use']);
    }
  }
  for (const type of ['reasoning', 'agent_message']) {
    assert.equal(
      classify({ eventsBytes: jsonl({ type: 'item.completed', item: { type } }, completedUsage()) }).classification,
      'valid_final',
    );
  }
  const malformedAfterVerifiedTool = classify({
    eventsBytes: Buffer.concat([
      jsonl({ type: 'item.completed', item: { type: 'command_execution' } }),
      Buffer.from('{"type":'),
    ]),
  });
  assert.deepEqual(
    [malformedAfterVerifiedTool.classification, malformedAfterVerifiedTool.code],
    ['terminal_invalid', 'attempted_tool_use'],
  );

  const recovered = classify({
    eventsBytes: jsonl(
      {
        type: 'item.completed',
        item: { type: 'error', message: 'temporary stream error' },
      },
      completedUsage(),
    ),
  });
  assert.deepEqual(
    [recovered.classification, recovered.code],
    ['valid_final', 'valid_final'],
  );

  const fatalWithoutFinal = classify({
    finalBytes: null,
    eventsBytes: jsonl({
      type: 'item.completed',
      item: {
        type: 'error',
        message: 'Authentication required: please log in',
      },
    }),
  });
  assert.deepEqual(
    [fatalWithoutFinal.classification, fatalWithoutFinal.code],
    ['fatal_environment', 'authentication'],
  );
});

test('free-text mentions of tools never count as structural tool use', () => {
  const result = classify({ eventsBytes: jsonl({ type: 'message', text: 'I will not call a tool or shell' }, completedUsage()) });
  assert.equal(result.classification, 'valid_final');
});

test('a schema-valid final is authoritative', () => {
  const result = classify();
  assert.equal(result.classification, 'valid_final');
  assert.deepEqual(result.response, validPredictionResponse());
});

test('a valid final overrides an earlier recovered transport disconnect', () => {
  const result = classify({ eventsBytes: jsonl(structuralError('transport_disconnect'), completedUsage()) });
  assert.equal(result.classification, 'valid_final');
});

test('a valid final overrides a structural fallback event', () => {
  const result = classify({ eventsBytes: jsonl({ type: 'model.fallback', recovered: true }, completedUsage()) });
  assert.equal(result.classification, 'valid_final');
});

test('a valid final overrides timeout markers and nonzero process exit', () => {
  const result = classify({ timedOut: true, processExitCode: 17 });
  assert.equal(result.classification, 'valid_final');
});

test('a transported schema-invalid final is terminal invalid before retryable infrastructure', () => {
  const invalidResponse = validPredictionResponse();
  invalidResponse.predictions[0].rank = 2;
  const result = classify({ finalBytes: finalBytes(invalidResponse), eventsBytes: jsonl(structuralError('rate_limit')) });
  assert.deepEqual([result.classification, result.code], ['terminal_invalid', 'invalid_schema']);
});

test('a transported empty final is terminal invalid', () => {
  const result = classify({ finalBytes: Buffer.alloc(0), eventsBytes: jsonl(structuralError('service_unavailable')) });
  assert.deepEqual([result.classification, result.code], ['terminal_invalid', 'empty_final']);
});

test('a structural transported refusal is terminal invalid', () => {
  const result = classify({ finalBytes: Buffer.from('refused'), eventsBytes: jsonl({ type: 'response.refusal', refusal: 'cannot comply' }) });
  assert.deepEqual([result.classification, result.code], ['terminal_invalid', 'refusal']);
});

test('authentication without any final is a fatal environment stop', () => {
  const result = classify({ finalBytes: null, eventsBytes: jsonl(structuralError('authentication_error')) });
  assert.deepEqual([result.classification, result.code], ['fatal_environment', 'authentication']);
  const corruptFinal = classify({
    finalBytes: Buffer.from('{"truncated":'),
    eventsBytes: jsonl(structuralError('authentication_error')),
  });
  assert.deepEqual([corruptFinal.classification, corruptFinal.code], ['fatal_environment', 'authentication']);
  const messageOnlyPrefix = classify({
    finalBytes: null,
    eventsBytes: Buffer.concat([
      jsonl({ type: 'turn.failed', error: { message: 'Authentication required: please log in' } }),
      Buffer.from('{"malformed":'),
    ]),
  });
  assert.deepEqual(
    [messageOnlyPrefix.classification, messageOnlyPrefix.code],
    ['fatal_environment', 'authentication'],
  );
});

test('authorization without any final is a fatal environment stop', () => {
  const result = classify({ finalBytes: null, eventsBytes: jsonl(structuralError('authorization_error')) });
  assert.deepEqual([result.classification, result.code], ['fatal_environment', 'authorization']);
});

test('invalid model without any final is a fatal environment stop', () => {
  const result = classify({ finalBytes: null, eventsBytes: jsonl(structuralError('invalid_model')) });
  assert.deepEqual([result.classification, result.code], ['fatal_environment', 'invalid_model']);
});

test('local configuration failure without any final is a fatal environment stop', () => {
  const result = classify({ finalBytes: null, eventsBytes: jsonl(structuralError('configuration_error')) });
  assert.deepEqual([result.classification, result.code], ['fatal_environment', 'local_configuration']);
  const stderrOnly = classify({
    finalBytes: null,
    eventsBytes: Buffer.alloc(0),
    stderrBytes: Buffer.from('strict config error: unknown configuration key features.invalid'),
  });
  assert.deepEqual(
    [stderrOnly.classification, stderrOnly.code],
    ['fatal_environment', 'local_configuration'],
  );
});

test('adapter spawn failure is retryable only without a final', () => {
  const result = classify({ finalBytes: null, eventsBytes: Buffer.alloc(0), spawnFailed: true });
  assert.deepEqual([result.classification, result.code], ['infrastructure_retry', 'adapter_spawn_failure']);
});

test('transport disconnect or nonzero exit without a final is retryable', () => {
  const structural = classify({ finalBytes: null, eventsBytes: jsonl(structuralError('transport_disconnect')) });
  const exit = classify({ finalBytes: null, eventsBytes: Buffer.alloc(0), processExitCode: 9 });
  assert.equal(structural.code, 'transport_disconnect');
  assert.equal(exit.code, 'transport_disconnect');
});

test('rate limit without a final is retryable', () => {
  const result = classify({ finalBytes: null, eventsBytes: jsonl(structuralError('rate_limit')) });
  assert.deepEqual([result.classification, result.code], ['infrastructure_retry', 'rate_limit']);
});

test('service unavailable without a final is retryable', () => {
  const result = classify({ finalBytes: null, eventsBytes: jsonl(structuralError('service_unavailable')) });
  assert.deepEqual([result.classification, result.code], ['infrastructure_retry', 'service_unavailable']);
});

test('timeout without a final is retryable', () => {
  const result = classify({ finalBytes: null, eventsBytes: Buffer.alloc(0), timedOut: true });
  assert.deepEqual([result.classification, result.code], ['infrastructure_retry', 'timeout_without_final']);
});

test('unverifiable or undecodable final artifacts are retryable transport corruption', () => {
  const bytes = finalBytes();
  const hashMismatch = classify({ finalBytes: bytes, finalSha256: '0'.repeat(64) });
  const undecodable = classify({ finalBytes: Buffer.from([0xff, 0xfe, 0xfd]) });
  assert.equal(hashMismatch.code, 'transport_artifact_corrupt');
  assert.equal(undecodable.code, 'transport_artifact_corrupt');
});

test('local I/O before any valid final is retryable and overrides non-valid artifacts', () => {
  const result = classify({ finalBytes: null, eventsBytes: Buffer.alloc(0), localIoBeforeFinal: true });
  assert.deepEqual([result.classification, result.code], ['infrastructure_retry', 'local_io_before_final']);

  const invalid = validPredictionResponse();
  invalid.predictions[0].rank = 2;
  for (const finalBytesValue of [
    Buffer.alloc(0),
    Buffer.from(JSON.stringify(invalid)),
    Buffer.from('{"truncated":'),
  ]) {
    const result = classify({
      finalBytes: finalBytesValue,
      eventsBytes: Buffer.alloc(0),
      localIoBeforeFinal: true,
    });
    assert.deepEqual(
      [result.classification, result.code],
      ['infrastructure_retry', 'local_io_before_final'],
    );
  }
  const tool = classify({
    finalBytes: Buffer.alloc(0),
    eventsBytes: jsonl({ type: 'item.completed', item: { type: 'command_execution' } }),
    localIoBeforeFinal: true,
  });
  assert.deepEqual(
    [tool.classification, tool.code],
    ['terminal_invalid', 'attempted_tool_use'],
  );
});

test('re-derives token usage only from structural turn.completed.usage', () => {
  const result = classify({
    eventsBytes: jsonl(
      { type: 'message', usage: { input_tokens: 9999, output_tokens: 9999 } },
      completedUsage({ input_tokens: 123, cached_input_tokens: 45, output_tokens: 67 }),
    ),
    finalSha256: createHash('sha256').update(finalBytes()).digest('hex'),
  });
  assert.deepEqual(result.usage, { input_tokens: 123, cached_input_tokens: 45, output_tokens: 67 });
});
