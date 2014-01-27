'use strict';

angular.module('TimeyWimeyApp')
  .controller('MainCtrl', function ($rootScope, $scope, $timeout) {
    $scope.db = new PouchDB('TimeyWimeyDB');
    $scope.timers = [];
    $scope.totalTimer = {
      'minutes': 0,
      'seconds': 0
    };
    $scope.editObject = {};


    $scope.addTimer = function () {
      var newTimer = {};
      newTimer.doc = {
        name: '',
        seconds: 0,
        pastSeconds: 0,
        time: {
          minutes: 0,
          seconds: 0
        },
        counting: false
      };
      $scope.db.post(newTimer.doc, function(err,response) {
        if(response) {
          $rootScope.$apply(function() {
            newTimer.doc._id = response.id;
            newTimer.doc._rev = response.rev;
            $scope.timers.push(newTimer);
            $scope.setEditObject(newTimer.doc);
          });
        }
      });
    };

    $scope.setEditObject = function(doc) {
      $scope.editObject = doc;
      jQuery('#editor').show();
      jQuery('.input').focus();
    };

    $scope.closeEditor = function () {
      jQuery('#editor').hide();
      jQuery('.input').blur();
      console.log($scope.editObject);
      $scope.db.put($scope.editObject, function (err, response) {
        $rootScope.$apply(function() {
          $scope.editObject._id = response.id;
          $scope.editObject._rev = response.rev;
        });
      });
    };

    $scope.deleteTimer = function (timerObject) {

      $scope.db.remove(timerObject.doc, function(err, response) {
        if(response) {
          $rootScope.$apply(function() {
              var timerPosition = $scope.timers.indexOf(timerObject);
              $scope.timers.splice(timerPosition,1);
              console.log($scope.timers);
            });
        }
      });


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
      timerArray.forEach(function(timerObject) {
        totalSeconds = totalSeconds + timerObject.doc.seconds;
      });
      return totalSeconds;
    };

    $scope.timeCounterTimeoutInterval = function (timerObject) {
      timerObject.timeoutInterval = $timeout(
        function() {
          var newDate = new Date();
          var diffCurrentNew = Math.round(((newDate - timerObject.doc.currentDate)/1000));

          if(timerObject.doc.pastSeconds) {
            diffCurrentNew = diffCurrentNew + timerObject.doc.pastSeconds;
          }

          timerObject.doc.seconds = diffCurrentNew;
          timerObject.doc.time = $scope.setTime(timerObject.doc.seconds);
          $scope.totalTimer = $scope.setTime($scope.getAllSeconds($scope.timers));

          $scope.db.put(timerObject.doc, function (err, response) {
            $rootScope.$apply(function() {
              timerObject.doc._id = response.id;
              timerObject.doc._rev = response.rev;
            });
          });

          $scope.timeCounterTimeoutInterval(timerObject);
        },
      1000);
    };

    $scope.toggleTimeCounter = function (timerObject) {
      if(!timerObject.doc.counting) {
        timerObject.doc.counting = true;
        timerObject.doc.currentDate = new Date();
        $scope.timeCounterTimeoutInterval(timerObject);
      }
      else {
        $scope.stopTimeCounter(timerObject);
      }
    };

    $scope.stopTimeCounter = function (timerObject) {
      $timeout.cancel(timerObject.timeoutInterval);
      timerObject.doc.pastSeconds = timerObject.doc.seconds;
      timerObject.doc.counting = false;

      $scope.db.put(timerObject.doc, function (err, response) {
        $rootScope.$apply(function() {
          timerObject.doc._id = response.id;
          timerObject.doc._rev = response.rev;
        });
      });
    };

    $scope.clearData = function () {
      $scope.timers = [];
      $scope.totalTimer = {
        'minutes': 0,
        'seconds': 0
      };
      console.log($scope.db);
      PouchDB.destroy('TimeyWimeyDB', function() {
        console.log('slettaalt');
        $scope.db = new PouchDB('TimeyWimeyDB');
      });
    };

    $scope.getAllTimers = function () {
      $scope.db.allDocs({include_docs: true, descending: true},
      function(err, doc) {

        $rootScope.$apply(function() {
          doc.rows.forEach(function(timerObject) {
            timerObject.doc.counting = false;
            $scope.timers.push(timerObject);
          });
        });
      });
    };

    $scope.getAllTimers();
  });
