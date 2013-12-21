'use strict';

describe('Service: Pouchdb', function () {

  // load the service's module
  beforeEach(module('fbquizApp'));

  // instantiate service
  var Pouchdb;
  beforeEach(inject(function (_Pouchdb_) {
    Pouchdb = _Pouchdb_;
  }));

  it('should do something', function () {
    expect(!!Pouchdb).toBe(true);
  });

});
