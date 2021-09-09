
const lblOnline = document.querySelector("#lblOnline");
const lblOffline = document.querySelector("#lblOffline");

const txtMessage = document.querySelector("#txtMessage")
const sendBtn = document.querySelector("#sendBtn")


const socket = io();

socket.on( "connect", () => {
    // console.log("Connected.");
    lblOffline.style.display = "none";
    lblOnline.style.display = "";
} );

socket.on( "disconnect", () => {
    console.log("Disconnected from server.");
    lblOffline.style.display = "";
    lblOnline.style.display = "none";
} );

socket.on( "send-message", (payload) => {
    console.log(payload);
} )

sendBtn.addEventListener( "click", () => {
    const msg = txtMessage.value;
    const payload = {
        msg,
        id: "1234ABCD",
        date: new Date().getTime()
    }

    socket.emit( "send-message", payload, ( id ) => {
        console.log("Desde el server", id);
    } );
} );
