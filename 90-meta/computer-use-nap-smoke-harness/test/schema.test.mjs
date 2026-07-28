import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('..', import.meta.url);
const instructionUrl = new URL('predictor-instruction.txt', root);
const schemaUrl = new URL('prediction.schema.json', root);

const expectedInstruction = `You are predicting the exact target of Dylan's next eligible computer action from screenshots captured strictly before that action.

Return up to three ranked action targets. Each target must contain:
- app
- specific object: page, document, conversation, folder, task, or window
- subtarget: field, control, section, or focus target, or null when the object is the complete target
- one short reason using only the supplied evidence

Predict the application, object, and subtarget of the immediate next eligible action. Do not combine multiple actions into an eventual target. Do not predict ordinary typing, scrolling, cursor movement, text selection, or window resizing.

Return JSON only in exactly this shape:
{
  "predictions": [
    {
      "rank": 1,
      "app": "string",
      "object": "string",
      "subtarget": "string or null",
      "reason": "string"
    }
  ]
}

Return between one and three predictions. Ranks must be consecutive integers beginning at 1. Do not add other top-level keys.

Do not call tools, inspect the filesystem, search, or use information outside the supplied instruction, text blocks, and attached images.
`;

const expectedInstructionHash = '093ada0ba7ac0e48c33d4b902505c24f13652c8cc4ee09f4947a6727466e5bee';

const approvedSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['predictions'],
  properties: {
    predictions: {
      type: 'array',
      minItems: 1,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['rank', 'app', 'object', 'subtarget', 'reason'],
        properties: {
          rank: { type: 'integer', minimum: 1, maximum: 3 },
          app: { type: 'string', minLength: 1 },
          object: { type: 'string', minLength: 1 },
          subtarget: { type: ['string', 'null'] },
          reason: { type: 'string', minLength: 1 },
        },
      },
    },
  },
};

function task5WouldAcceptConsecutiveRanks(predictions) {
  return predictions.every((prediction, index) => prediction.rank === index + 1);
}

test('predictor instruction is byte-stable and includes the no-tool boundary', async () => {
  const instruction = await readFile(instructionUrl);

  assert.deepEqual(instruction, Buffer.from(expectedInstruction, 'utf8'));
  assert.equal(
    createHash('sha256').update(instruction).digest('hex'),
    expectedInstructionHash,
  );
  assert.match(
    instruction.toString('utf8'),
    /Do not call tools, inspect the filesystem, search, or use information outside the supplied instruction, text blocks, and attached images\./,
  );
});

test('schema is exactly the approved canonical contract', async () => {
  const schema = JSON.parse(await readFile(schemaUrl, 'utf8'));

  assert.deepEqual(schema, approvedSchema);
});

test('schema fixes the prediction envelope and forbids extra properties', async () => {
  const schema = JSON.parse(await readFile(schemaUrl, 'utf8'));

  assert.equal(schema.type, 'object');
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ['predictions']);
  assert.deepEqual(Object.keys(schema.properties), ['predictions']);

  const prediction = schema.properties.predictions.items;
  assert.equal(prediction.additionalProperties, false);
  assert.deepEqual(prediction.required, ['rank', 'app', 'object', 'subtarget', 'reason']);
  assert.deepEqual(Object.keys(prediction.properties), ['rank', 'app', 'object', 'subtarget', 'reason']);
});

test('schema requires each prediction item to be an object', async () => {
  const schema = JSON.parse(await readFile(schemaUrl, 'utf8'));

  assert.equal(schema.properties.predictions.items.type, 'object');
});

test('schema requires one to three complete, typed predictions', async () => {
  const schema = JSON.parse(await readFile(schemaUrl, 'utf8'));
  const predictions = schema.properties.predictions;
  const properties = predictions.items.properties;

  assert.equal(predictions.type, 'array');
  assert.equal(predictions.minItems, 1);
  assert.equal(predictions.maxItems, 3);
  assert.deepEqual(properties.rank, { type: 'integer', minimum: 1, maximum: 3 });
  assert.deepEqual(properties.app, { type: 'string', minLength: 1 });
  assert.deepEqual(properties.object, { type: 'string', minLength: 1 });
  assert.deepEqual(properties.subtarget, { type: ['string', 'null'] });
  assert.deepEqual(properties.reason, { type: 'string', minLength: 1 });
});

test('JSON Schema permits [1,3], so Task 5 must reject nonconsecutive ranks at runtime', () => {
  const valid = [
    { rank: 1, app: 'Chrome', object: 'GitHub', subtarget: 'Pull requests', reason: 'Visible tab.' },
    { rank: 2, app: 'Slack', object: 'Dylan', subtarget: null, reason: 'Unread conversation.' },
  ];
  const schemaValidButNonconsecutive = [
    { rank: 1, app: 'Chrome', object: 'GitHub', subtarget: 'Pull requests', reason: 'Visible tab.' },
    { rank: 3, app: 'Slack', object: 'Dylan', subtarget: null, reason: 'Unread conversation.' },
  ];

  assert.equal(task5WouldAcceptConsecutiveRanks(valid), true);
  assert.equal(task5WouldAcceptConsecutiveRanks(schemaValidButNonconsecutive), false);
});
