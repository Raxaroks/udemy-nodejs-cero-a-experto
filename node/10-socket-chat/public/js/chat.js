
// url base
const baseUrl = window.location.hostname.includes("localhost")
	? "http://localhost:8080/api"
	: "";

// referencias al HTML
const txtUid = document.querySelector("#txtUid");
const txtMsg = document.querySelector("#txtMsg");
const ulUsers = document.querySelector("#ulUsers");
const ulChat = document.querySelector("#ulChat");
const btnLogout = document.querySelector("#btnLogout");

// validar si el JWT es correcto
let user, socket = null;

const validateJWT = async () => {
    const token = localStorage.getItem("token") || "";
    if ( token.length <= 10 ) {
        window.location = "index.html";
        throw new Error("No existe el token.");
    }
    
    const url = `${ baseUrl }/auth`;
    const resp = await fetch( url, {
        headers: { "Authorization": token }
    } );

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem("token", tokenDB);
    user = userDB;
    document.title = user.username;

    await connectSocket();
}

const connectSocket = async () => {
    socket = io({
        "extraHeaders": {
            "Authorization": localStorage.getItem("token")
        }
    });    

    socket.on( "connect", () => {
        console.log( `[!] Servicio de sockets: [${ "ONLINE" }]` );
    } );

    socket.on( "disconnect", () => {
        console.log( `[!] Servicio de sockets: [${ "OFFLINE" }]` );
    } );

    socket.on( "receive-messages", drawMessages );

    socket.on( "active-users", drawUsers );

    socket.on( "private-message", (payload) => {
        console.log("Privado:", payload);
    } );
}

const drawUsers = ( users = [] ) => {
    let usersHtml = "";
    users.forEach( user => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${ user.username }</h5>
                    <span class="fs-6 text-muted">ID: ${ user.uid }</span>
                </p>
            </li>
        `;
    } )
    ulUsers.innerHTML = usersHtml;
}

const drawMessages = ( msgs = [] ) => {
    let msgsHtml = "";
    msgs.forEach( msg => {
        msgsHtml += `
            <li>
                <p>
                    <h5 class="text-dark">${ msg.name }</h5>
                    <span class="fs-6 text-muted">ID: ${ msg.message }</span>
                </p>
            </li>
        `;
    } )
    ulChat.innerHTML = msgsHtml;
}

txtMsg.addEventListener( "keyup", evt => {
    const msg = txtMsg.value;
    const uid = txtUid.value;

    if ( evt.keyCode !== 13 ) return;
    if ( msg.trim().length === 0 ) return;

    socket.emit( "send-message", { msg, uid } );
    txtMsg.value = "";
} );

const main = async () => {
    await validateJWT();
}

main();
