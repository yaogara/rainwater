import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getStatePolicy, calculateAnnualYield, STATE_POLICIES } from '../src/data/statePolicy';

describe('statePolicy', () => {
  it('covers 50 states plus Puerto Rico', () => {
    const statesCount = Object.keys(STATE_POLICIES).length;
    assert.ok(statesCount >= 50, `Expected at least 50 entries, found ${statesCount}`);
  });

  it('retrieves state policy by exact name', () => {
    const texas = getStatePolicy('Texas');
    assert.ok(texas);
    assert.equal(texas?.name, 'Texas');
    assert.match(texas?.primaryStatute ?? '', /151\.355/);
  });

  it('retrieves state policy by slug', () => {
    const colorado = getStatePolicy('colorado');
    assert.ok(colorado);
    assert.equal(colorado?.name, 'Colorado');
    assert.match(colorado?.volumeCap ?? '', /110/);
  });

  it('handles case-insensitive and hyphenated inputs', () => {
    const newMexico = getStatePolicy('new-mexico');
    assert.ok(newMexico);
    assert.equal(newMexico?.name, 'New Mexico');

    const nc = getStatePolicy('north carolina');
    assert.ok(nc);
    assert.equal(nc?.name, 'North Carolina');
  });

  it('calculates annual rainwater yield correctly', () => {
    // 2,000 sq ft, 28.9 inches rainfall (Texas), 90% efficiency
    // Formula: 2000 * 28.9 * 0.6233 * 0.90 = 32,424
    const yieldTexas = calculateAnnualYield(2000, 28.9, 0.90);
    assert.equal(yieldTexas, 32424);

    // Zero cases
    assert.equal(calculateAnnualYield(0, 30), 0);
    assert.equal(calculateAnnualYield(1000, 0), 0);
  });
});
