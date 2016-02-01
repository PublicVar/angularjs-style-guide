/* jshint undef: true, unused: true */
/*global angular */
(function () {
	'use strict';

	angular.module('todoStorage', [])

	/**
	 * Services that persists and retrieves TODOs from localStorage
	*/
	.factory('todoStorage', todoStorage);

	function todoStorage(){
		var STORAGE_ID = 'todos-angularjs-perf';

		return {
			get: get,
			put: put
		};

		function get(){
			return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
		}

		function put(todos){
			localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
		}
	}
})();
