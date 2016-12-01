// dépendances
var express = require('express');
var path = require('path');

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

// détection des connexions
io.on('connection', function (socket) {

    console.log('Connexion détectée');
    
    // détection des déconnexions
    socket.on('disconnect', function() {
        console.log('Déconnexion détectée');
    });

});
