// ==========================================
// dépendances ==============================
// ==========================================
var express = require('express');
var path = require('path');
var child_process = require('child_process');


// ==========================================
// SERVEUR EXPRESS ==========================
// ==========================================
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


// ==========================================
// SERVEUR DE SOCKETS =======================
// ==========================================
// création du serveur de sockets
var io = require('socket.io').listen(8080);

// namespaces
var clientio = io.of('/client');
var calcio = io.of('/calc');

// map socketId - processus de calcul
var processes = {};

// map socketId processus - socketId interface
var clientToPs = {};


// ==========================================
// SOCKETS CLIENTS ==========================
// ==========================================
clientio.on('connection', function (socket) {

    console.log('Client connecté');
    
    // détection des déconnexions
    socket.on('disconnect', function() {
        console.log('Client déconnecté');
        endCalc(socket.id);
    });	

    // détection évènement 'launch_calc'
    socket.on('launch_calc', function (message) {
        launchCalc(socket.id, message.number);
    });

    // détection évènement 'end_calc'
    socket.on('end_calc', function () {
        endCalc(socket.id);
    });

    // détection évènement 'change_param'
    socket.on('change_param', function (message) {
        changeParam(socket.id, message.number);
    });
});

// fonction lancement calcul
function launchCalc(socketId, number) {
    if (!processes[socketId]) {
        var cmd = 'python calcul.py ' + socketId + ' ' + number;
        var ps = child_process.exec(cmd, function (error, stdout, stderr) { 
            console.log('Un processus s\'est terminé');
        });
        processes[socketId] = ps;
    }
}

// fonction terminaison calcul
function endCalc(socketId) {
    var ps = processes[socketId];
    if (ps) {
        ps.kill('SIGTERM');
        delete processes[socketId];
    }
}

// fonction changement de paramètre
function changeParam(socketId, param) {
    processSocketId = clientToPs[socketId];
    calcio.to(processSocketId).emit('change_param', param);
}

// ==========================================
// SOCKETS CALCULATEURS =====================
// ==========================================
calcio.on('connection', function (socket) {

    console.log('Calculateur connecté');
    var clientId = socket.request._query.clientId;
    clientToPs[clientId] = socket.id;
    clientio.to(clientId).emit('calc_on');

    // détection évènement 'data'
    socket.on('data', sendData);

    // détection déconnexion
    socket.on('disconnect', function () {
        clientio.to(clientId).emit('calc_off');
    });

});

// fonction envoi de données
function sendData(message) {
    clientio.to(message.clientId).emit('calc_data', message);
}



