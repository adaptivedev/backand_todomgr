(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider
      .state('root.todo', {
        url: '/todo',
        views: {
          '@': {
            templateUrl: 'src/app/todo/todo.tpl.html',
            controller: 'TodoCtrl as start'
          }
        }
      });
  }

  /**
   * @name  TodoCtrl
   * @description Controller
   */
  function TodoCtrl($log, Backand, $cookieStore, BackandService) {

    var start = this;

    (function init() {
      start.username = "";
      start.password = "";
      start.appName = "";
      start.tables = null;
      start.isLoggedIn = false;
      start.tableData = "{}";
      start.results = "Not connected to Backand yet";
      loadTables();
    }());


    start.signin = function() {
      Backand.signin(start.username, start.password, start.appName)
        .then(
          function(token) {
            $cookieStore.put(Backand.configuration.tokenName, token);
            start.results = "you are in";
            loadTables();
          },
          function(data, status, headers, config) {
            $log.debug("authentication error", data, status, headers, config);
            start.results = data;
          }
        );
    };

    start.signout = function() {
      Backand.signout();
    }

    function loadTables() {
      BackandService.allTables().then(loadTablesSuccess, errorHandler);
    }

    function loadTablesSuccess(tables) {
      start.tables = tables.data.data;
      start.results = "Tables loaded";
      start.isLoggedIn = true;
    }

    start.loadTableData = function() {
      BackandService.tableData(start.tableSelected).then(loadTablesDataSuccess, errorHandler);
    }

    function loadTablesDataSuccess(tableData) {
      start.tableData = tableData.data.data;
    }

    function errorHandler(error, message) {
      $log.debug(message, error)
    }
  }

  angular.module('todo', [])
    .config(config)
    .controller('TodoCtrl', ['$log', 'Backand', '$cookieStore', 'BackandService', TodoCtrl]);
})();
