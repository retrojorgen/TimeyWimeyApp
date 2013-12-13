'use strict';

angular.module('TimeyWimeyApp')
  .controller('MainCtrl', function ($scope, $timeout) {
    $scope.timers = [];
    $scope.timerCounter = 1;
    $scope.editObject = {};

    $scope.addTimer = function () {
      var newTimer = {
        name: 'Timer ' + $scope.timerCounter,
        seconds: 0,
        pastSeconds: 0,
        time: {
          minutes: 0,
          seconds: 0
        },
        counting: false
      };
      $scope.timers.push(newTimer);
      $scope.timerCounter++;
      $scope.setEditObject(newTimer);
    };

    $scope.setEditObject = function(timerObject) {
      $scope.editObject = timerObject;
      jQuery('#editor').show().focus();
    };

    $scope.closeEditor = function () {
      jQuery('#editor').hide().blur();
    };

    $scope.deleteTimer = function (timerObject) {
      var timerPosition = $scope.timers.indexOf(timerObject);
      $scope.timers.splice(timerPosition,1);
    };

    $scope.setTime = function (timerObject) {
      var minutes = Math.floor(timerObject.seconds / 60);
      var seconds = timerObject.seconds - minutes * 60;
      timerObject.time.minutes = minutes;
      timerObject.time.seconds = seconds;
    };

    $scope.timeCounterTimeoutInterval = function (timerObject) {
      timerObject.timeoutInterval = $timeout(
        function() {
          var newDate = new Date();
          var diffCurrentNew = Math.round(((newDate - timerObject.currentDate)/1000));
          
          if(timerObject.pastSeconds) {
            diffCurrentNew = diffCurrentNew + timerObject.pastSeconds;
          }

          timerObject.seconds = diffCurrentNew;
          $scope.setTime(timerObject);
          $scope.timeCounterTimeoutInterval(timerObject);
        },
      1000);
    };

    $scope.toggleTimeCounter = function (timerObject) {
      if(!timerObject.counting) {
        timerObject.counting = true;
        timerObject.currentDate = new Date();
        $scope.timeCounterTimeoutInterval(timerObject);
      }
      else {
        $scope.stopTimeCounter(timerObject);
      }
    };

    $scope.stopTimeCounter = function (timerObject) {
      $timeout.cancel(timerObject.timeoutInterval);
      timerObject.pastSeconds = timerObject.seconds;
      timerObject.counting = false;
    };
  });
