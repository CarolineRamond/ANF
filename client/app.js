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
		var array = new Float64Array(data.data); 
	    $scope.message = JSON.stringify(array);
	    console.log($scope.message);

	    // force le rafraîchissement de la vue
	    $scope.$apply();  
	});

	// expose la variable myTitle
	$scope.myTitle = 'Hello World';

	// surveille la variable 'myVar'
	$scope.$watch('param', function () {
		if ($scope.param) {
	    	socket.emit('change_param', $scope.param);
		}
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


	// fonction terminer calcul
	$scope.endCalc = function () {
		socket.emit('end_calc');
	};

}]);
