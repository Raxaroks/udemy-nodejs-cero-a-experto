require("colors");
const { Socket } = require("socket.io");
const { verifyJWT } = require("../helpers");
const { ChatMessages } = require("../models");

const chatMsgs = new ChatMessages();

const socketController = async ( socket = new Socket(), io ) => {
    const token = socket.handshake.headers["authorization"];
    const user = await verifyJWT(token);
    const socketDisconnectedStr = `[!] Cliente ${ "desconectado".red } : SocketID [${ socket.id.blue }]`;

    if (!user) {
        console.log(socketDisconnectedStr);
        return socket.disconnect();
    }

    const socketConnectedStr = `[!] Cliente ${ "conectado".green } : SocketID [${ socket.id.blue }]`
    const userConnectedStr = `[*] Usuario: ${ (user.username).blue }\n`;

    // cuando se conecta un usuario al chat
    chatMsgs.connectUser( user );
    console.log( socketConnectedStr );
    console.log( userConnectedStr );
    io.emit( "active-users", chatMsgs.usersArray );
    socket.emit( "receive-messages", chatMsgs.last10 );

    // conectarlo a una sala especial
    socket.join( user.id );

    // cuando se desconecta un usuario del chat
    socket.on( "disconnect", () => {
        chatMsgs.disconnectUser( user.id );
        console.log(socketDisconnectedStr);
        console.log( userConnectedStr );        
        io.emit( "active-users", chatMsgs.usersArray );
    } );

    // enviar un mensaje
    socket.on( "send-message", ({ uid, msg }) => {
        if ( uid ) {
            // mensaje privado
            socket.to( uid ).emit( "private-message", { from: user.username, msg } );
        }

        else {
            // mensaje global
            chatMsgs.sendMessage( user.id, user.username, msg );
            io.emit( "receive-messages", chatMsgs.last10 );
        }
    } );
}



module.exports = {
    socketController
}