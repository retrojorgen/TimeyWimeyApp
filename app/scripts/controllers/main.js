'use strict';

angular.module('TimeyWimeyApp')
  .controller('MainCtrl', function ($scope, $timeout) {
    $scope.timers = [];
    $scope.totalTimer = {
      'minutes': 0,
      'seconds': 0
    };
    $scope.editObject = {};


    $scope.addTimer = function () {
      var newTimer = {
        name: '',
        seconds: 0,
        pastSeconds: 0,
        time: {
          minutes: 0,
          seconds: 0
        },
        counting: false
      };
      $scope.timers.push(newTimer);
      $scope.setEditObject(newTimer);
    };

    $scope.setEditObject = function(timerObject) {
      $scope.editObject = timerObject;
      jQuery('#editor').show();
      jQuery('.input').focus();
    };

    $scope.closeEditor = function () {
      jQuery('#editor').hide();
      jQuery('.input').blur();
    };

    $scope.deleteTimer = function (timerObject) {
      var timerPosition = $scope.timers.indexOf(timerObject);
      $scope.timers.splice(timerPosition,1);
    };

    $scope.setTime = function (timerSeconds) {
      var minutes = Math.floor(timerSeconds / 60);
      var seconds = timerSeconds - minutes * 60;
      return {
        'minutes': minutes,
        'seconds': seconds
      };
    };

    $scope.getAllSeconds = function (timerArray) {
      var totalSeconds = 0;
      timerArray.forEach(function(entry) {
        totalSeconds = totalSeconds + entry.seconds;
      });
      return totalSeconds;
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
          timerObject.time = $scope.setTime(timerObject.seconds);
          $scope.totalTimer = $scope.setTime($scope.getAllSeconds($scope.timers));
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

    $scope.clearData = function () {
      $scope.timers = [];
      $scope.totalTimer = {
        'minutes': 0,
        'seconds': 0
      };
    };
  });
