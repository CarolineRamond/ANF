// dépendances
var express = require('express');
var path = require('path');
var child_process = require('child_process');

// création du serveur
var server = express();

// dossier statique (tous les fichiers du 
// dossier pourront être chargés dans le navigateur)
server.use(express.static('client'));


// GET / : affichage de la page html
server.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'client/index.html'));
  // sendFile nécessite un chemin absolu
});


// écoute des requêtes sur le port 8000
server.listen(8000, function () {
	console.log('Server now listening on port 8000');
});


// création du serveur de sockets
var io = require('socket.io').listen(8080);

// map socketId - processus de calcul
var processes = {};

// détection des connexions
io.on('connection', function (socket) {

    console.log('Connexion détectée');
    
    // détection des déconnexions
    socket.on('disconnect', function() {
        console.log('Déconnexion détectée');
    });

    // détection évènement 'hello'
    socket.on('hello', function (data) {
    	console.log('Message reçu : ' + data.message + 		' from ' + data.from);
    
    	// réponse à l'émetteur
    	// socket.emit('welcome', data.from);

    	// réponse à tous les clients
    	// io.emit('welcome', data.from);

    	// broadcast : réponse à tous les clients
    	// sauf l'émetteur
    	socket.broadcast.emit('welcome', data.from);

    });		

    // détection évènement 'launch_calc'
    socket.on('launch_calc', function () {
        launchCalc(socket.id);
    });

    // détection évènement 'end_calc'
    socket.on('end_calc', function () {
        endCalc(socket.id);
    });

    // détection évènement 'data'
    socket.on('data', sendData);
});




// fonction lancement calcul
function launchCalc(socketId) {
    if (!processes[socketId]) {
        var cmd = 'python calcul.py ' + socketId;
        var ps = child_process.exec(cmd, function (error, stdout, stderr) { 
            console.log('Un processus s\'est terminé');
        });
        processes[socketId] = ps;
    }
}

// fonction envoi de données
function sendData(message) {
    io.to(message.clientId).emit('calc_data', message);
}