'use strict';

describe('Filter: numberFilter', function () {

  // load the filter's module
  beforeEach(module('fbquizApp'));

  // initialize a new instance of the filter before each test
  var numberFilter;
  beforeEach(inject(function ($filter) {
    numberFilter = $filter('numberFilter');
  }));

  it('should return the input prefixed with "numberFilter filter:"', function () {
    var text = 'angularjs';
    expect(numberFilter(text)).toBe('numberFilter filter: ' + text);
  });

});
