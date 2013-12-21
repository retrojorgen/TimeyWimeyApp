'use strict';

describe('Service: Pp', function () {

  // load the service's module
  beforeEach(module('fbquizApp'));

  // instantiate service
  var Pp;
  beforeEach(inject(function (_Pp_) {
    Pp = _Pp_;
  }));

  it('should do something', function () {
    expect(!!Pp).toBe(true);
  });

});
