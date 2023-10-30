const socketIo = require("socket.io");
const cookie = require("cookie");
const sessionService = require("../services/session")
const { decodedToken } = require("../../utils");

const connectedUsers = [];
const colors = ["red", "green", "blue", "lightblue", "brown"]

function configureSocket(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {

        // Add user to list when connects
        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie);
            const userTokenCookie = cookies.userToken;
            const userEmail = decodedToken(userTokenCookie).email;

            // Verify if user is already connected to the community
            const existingUserIndex = connectedUsers.findIndex(user => user.email === userEmail);

            if (existingUserIndex !== -1) {
                // If user is connected add the session id to an array
                connectedUsers[existingUserIndex].sessions.push(socket.id);
            } else {
                // If user is not connected create an object, an array of sessions and the user email
                const chat_color = colors[Math.floor(Math.random() * colors.length)];
                connectedUsers.push({ sessions: [socket.id], email: userEmail, chat_color });
            }

        } catch (error) {
            console.log(error)
        }

        // Send user's list to front when someone new connects
        io.emit('users connected', connectedUsers);

        socket.on('chat message', (data) => {
            const cookies = cookie.parse(socket.handshake.headers.cookie);
            const userTokenCookie = cookies.userToken;
            const userEmail = decodedToken(userTokenCookie).email;

            const userObject = connectedUsers.find(user => user.email === userEmail);

            if (userObject) {
                // Obtener el chat_color del objeto del usuario encontrado
                const chatColor = userObject.chat_color;

                // Emitir el mensaje junto con el chat_color del usuario
                io.emit('chat message', { user: userEmail, message: data.message, chat_color: chatColor });
            }
        });

        socket.on('disconnect', () => {

            // When a user disconnects, remove their socket ID from the connected users list
            const userIndex = connectedUsers.findIndex(user => user.sessions.includes(socket.id));
            if (userIndex !== -1) {
                connectedUsers[userIndex].sessions = connectedUsers[userIndex].sessions.filter(session => session !== socket.id);
                // Si el usuario ya no tiene más sesiones, eliminarlo de connectedUsers
                if (connectedUsers[userIndex].sessions.length === 0) {
                    connectedUsers.splice(userIndex, 1);
                }
            }

            // Actualizar la lista de usuarios conectados cuando alguien se desconecta
            io.emit('users connected', connectedUsers);
        });
    });

    return io;
}

module.exports = configureSocket;