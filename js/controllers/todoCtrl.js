/* jshint undef: true, unused: true */
/*global angular */

/*
 * Line below lets us save `this` as `TC`
 * to make properties look exactly the same as in the template
 */
//jscs:disable safeContextKeyword
(function () {
	'use strict';

	angular.module('todoCtrl', [])

	/**
	 * The main controller for the app. The controller:
	 * - retrieves and persists the model via the todoStorage service
	 * - exposes the model to the template and provides event handlers
	 */
	.controller('TodoCtrl', TodoCtrl);

	TodoCtrl.$inject = ['$scope', '$location', 'todoStorage'];

	function TodoCtrl($scope, $location, todoStorage) {
		var TC = this;
		var todos = TC.todos = todoStorage.get();

		TC.ESCAPE_KEY = 27;
		TC.editedTodo = {};
		
		if ($location.path() === '') {
			$location.path('/');
		}
		TC.location = $location;

		//methods
		TC.addTodo = addTodo ;
		TC.editTodo = editTodo;
		TC.doneEditing = doneEditing;
		TC.revertEditing = revertEditing;
		TC.removeTodo= removeTodo;
		TC.clearCompletedTodos= clearCompletedTodos;
		TC.markAll= markAll;

		$scope.$watch('TC.location.path()', function (path) {
			TC.statusFilter = { '/active': {completed: false}, '/completed': {completed: true} }[path];
		});

		// 3rd argument `true` for deep object watching
		$scope.$watch('TC.todos', function () {
			TC.remainingCount = todos.filter(function (todo) { return !todo.completed; }).length;
			TC.allChecked = (TC.remainingCount === 0);

			// Save any changes to localStorage
			todoStorage.put(todos);
		}, true);

		resetTodo();

		function resetTodo() {
			TC.newTodo = {title: '', completed: false};
		}

		function addTodo() {
			var newTitle = TC.newTodo.title = TC.newTodo.title.trim();
			if (newTitle.length === 0) {
				return;
			}

			todos.push(TC.newTodo);
			resetTodo();
		};

		function editTodo (todo) {
			TC.editedTodo = todo;

			// Clone the original todo to restore it on demand.
			TC.originalTodo = angular.copy(todo);
		};

		function doneEditing (todo, index) {
			TC.editedTodo = {};
			todo.title = todo.title.trim();

			if (!todo.title) {
				TC.removeTodo(index);
			}
		};

		function revertEditing (index) {
			TC.editedTodo = {};
			todos[index] = TC.originalTodo;
		};

		function removeTodo(index) {
			todos.splice(index, 1);
		};

		function clearCompletedTodos() {
			TC.todos = todos = todos.filter(function (val) {
				return !val.completed;
			});
		};

		function markAll(completed) {
			todos.forEach(function (todo) {
				todo.completed = completed;
			});
		};
	}
})();
//jscs:enable
