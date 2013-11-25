'use strict';

angular.module('fbquizApp')
  .controller('MainCtrl', function ($scope, $timeout) {
    $scope.timers = [];
    $scope.timerCounter = 1;

    $scope.addTimer = function () {
      var newTimer = {
        name: 'Timer ' + $scope.timerCounter,
        time: {
          seconds: 0,
          minutes: 0
        },
        counting : false
      };
      $scope.timers.push(newTimer);
      $scope.timerCounter++;
    };

    $scope.deleteTimer = function (timerObject) {
      var timerPosition = $scope.timers.indexOf(timerObject);
      $scope.timers.splice(timerPosition,1);
    };

    $scope.timeCounterTimeoutInterval = function (timerObject) {
      timerObject.timeoutInterval = $timeout(
        function() {
          if(timerObject.time.seconds === 59) {
            timerObject.time.seconds = 0;
            timerObject.time.minutes++;
          } else {
            timerObject.time.seconds++;
          }
          $scope.timeCounterTimeoutInterval(timerObject);
        },
      1000);
    };

    $scope.toggleTimeCounter = function (timerObject) {
      if(!timerObject.counting) {
        timerObject.counting = true;
        $scope.timeCounterTimeoutInterval(timerObject);
      }
      else {
        $scope.stopTimeCounter(timerObject);
      }
    };

    $scope.stopTimeCounter = function (timerObject) {
      $timeout.cancel(timerObject.timeoutInterval);
      timerObject.counting = false;
    };
  });
