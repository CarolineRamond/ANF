var app = angular.module('myApp', []);

app.controller('myCtrl', ['$scope', function ($scope) {

	$scope.myTitle = 'Hello World';

	$scope.$watch('myVar', function () {
	    console.log($scope.myVar);
	});

	$scope.sayHello = function () {
	    alert('Hello World');
    };

}]);
