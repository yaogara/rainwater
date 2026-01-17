import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../src/utils/slugify';

describe('slugify', () => {
  it('converts to lowercase', () => {
    assert.equal(slugify('Hello'), 'hello');
  });

  it('replaces spaces with dashes', () => {
    assert.equal(slugify('Hello World'), 'hello-world');
  });

  it('handles multiple spaces', () => {
    assert.equal(slugify('Hello   World'), 'hello-world');
  });

  it('handles special characters', () => {
    assert.equal(slugify('Hello! @World#'), 'hello-world');
  });

  it('handles ampersand', () => {
    assert.equal(slugify('Ben & Jerry'), 'ben-and-jerry');
  });

  it('trims dashes', () => {
    assert.equal(slugify('-Hello-'), 'hello');
    assert.equal(slugify(' - Hello - '), 'hello');
  });

  it('handles numbers', () => {
    assert.equal(slugify('Version 2.0'), 'version-2-0');
  });

  it('handles mixed case and special chars', () => {
    assert.equal(slugify('  Rainwater Directory @ 2024  '), 'rainwater-directory-2024');
  });
});
