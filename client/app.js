angular.module('myApp', [])
.controller('myCtrl', ['$scope', function ($scope) {

	// on etablit la connexion avec l'API
	var socket = io.connect("http://localhost:8080/client");
	var colors = [ 0x000000, 0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0x00FFFF, 0xFF00FF];

	// initialisation
	$scope.init = function () {
		$scope.calcOn = false;
		$scope.calcMessages = [];
		$scope.spheres = [{ x: 0, y: 0, radius: 10, color: colors[0] }];
	}

	// ajout d'une sphere
	$scope.addSphere = function () {
		var x = -200 + Math.random() * 400;
		var y = - 200 + Math.random() * 400;
		var radius = 10;

		var col = ($scope.spheres.length + 1) % colors.length;

		$scope.spheres.push({ x: x, y: y, radius: radius, color: colors[col] });
		changeParam();
	}

	// suppression d'une sphere
	$scope.removeSphere = function () {
		var last = $scope.spheres.pop();
		if (last) {
			$scope.$broadcast('removeSphere', last.actor);
			changeParam();
		}
	}

	// lancement/arret du calculateur
	$scope.switchCalc = function () {
		if ($scope.calcOn) {
			socket.emit('end_calc');
		} else {
			socket.emit('launch_calc', { 
				number : $scope.spheres.length 
			});
		}
	}

	// changement de paramètre de calcul
	function changeParam () {
		if ($scope.calcOn) {
			socket.emit('change_param', { 
				number : $scope.spheres.length
			});
		}
	}

	// détection connexion du calculateur
	socket.on('calc_on', function () {
		$scope.calcOn = true;
		$scope.$apply();
	});

	// détection déconnexion calculateur
	socket.on('calc_off', function () {
		$scope.calcOn = false;
		$scope.$apply();
	});

	// détection données calculateur
	socket.on('calc_data', function (message) {
		x = new Float64Array(message.x);
		y = new Float64Array(message.y);
		for (i=0; i<x.length; i++) {
			if ($scope.spheres[i]) {
				$scope.spheres[i].x = x[i];
				$scope.spheres[i].y = y[i];
			}
		}
		$scope.$broadcast('redraw');
	});

}]);