const chai = require('chai');
const assert = chai.assert;
const Brick = require('../lib/Brick');

describe('Brick', function() {
  it('should be a constructor', function() {
    assert.isFunction(Brick, true);
  })

})
