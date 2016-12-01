var app = angular.module('myApp', []);

app.controller('myCtrl', ['$scope', function ($scope) {

	// connexion au serveur de sockets
	var socket = io.connect('http://localhost:8080');

	// détection des évènements 'welcome'
	socket.on('welcome', function (data) {    	
	    console.log('Welcome ' + data);    
	});

	// détection des évènements 'data'
	socket.on('calc_data', function (data) { 
	    $scope.message = new Float64Array(data.data); 
	    console.log($scope.message);

	    // force le rafraîchissement de la vue
	    $scope.$apply();  
	});

	// expose la variable myTitle
	$scope.myTitle = 'Hello World';

	// surveille la variable 'myVar'
	$scope.$watch('myVar', function () {
	    console.log($scope.myVar);
	});

	// expose la fonction sayHello
	$scope.sayHello = function () {		
	    var obj = { message: 'Hello', from: $scope.myVar };
	    socket.emit('hello', obj);   
	};

	// fonction lancement calculateur
	$scope.launchCalc = function () {
		socket.emit('launch_calc');
	};

}]);
