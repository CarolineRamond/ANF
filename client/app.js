var app = angular.module('myApp', []);

app.controller('myCtrl', ['$scope', function ($scope) {

	// connexion au serveur de sockets
	var socket = io.connect('http://localhost:8080');

	// expose la variable myTitle
	$scope.myTitle = 'Hello World';

	// surveille la variable 'myVar'
	$scope.$watch('myVar', function () {
	    console.log($scope.myVar);
	});

	// expose la fonction sayHello
	$scope.sayHello = function () {
	    alert('Hello World');
    };

}]);
