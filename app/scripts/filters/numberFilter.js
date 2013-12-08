'use strict';

angular.module('TimeyWimeyApp')
  .filter('numberFilter', function () {
    return function (input) {
      return input.toString().length < 2 ? '0' + input : input;
    };
  });
