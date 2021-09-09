
const socketController = (socket) => {
    console.log( "\nSocket connected.", socket.id  );

    socket.on( "disconnect", () => {
        // console.log( "Socket disconnected.", socket.id );
    } );

    socket.on( "send-message", (payload, callback) => {
        const id = 123456789;
        callback(id);
        socket.broadcast.emit( "send-message", payload );
    } );
}



module.exports = {
    socketController
}