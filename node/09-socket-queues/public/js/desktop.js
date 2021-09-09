
const lblDesktop = document.querySelector("h1");
const btnAttend = document.querySelector("button");
const lblTicket = document.querySelector("small");
const divAlert = document.querySelector(".alert");
const lblPending = document.querySelector("#lblPending");

const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has("desktop") ) {
    window.location = "index.html";
    throw new Error( "El escritorio es obligatorio" );
}

const desktop = searchParams.get("desktop");
lblDesktop.innerText = desktop;
divAlert.style.display = "none";

const socket = io();

socket.on("connect", () => {
	// console.log('Conectado');
    btnAttend.disabled = false;
});

socket.on("disconnect", () => {
    btnAttend.disabled = true;
});

socket.on("pending-tickets", pendings => {
    if ( pendings === 0 ) {
        lblPending.style.display = "none";
    }

    else {
        lblPending.style.display = "";
        lblPending.innerText = pendings;
    }
});

btnAttend.addEventListener("click", () => {
    socket.emit( "attend-ticket", { desktop }, ({ ok, ticket }) => {
        if (!ok) {
            lblTicket.innerText = "Nadie";
            return divAlert.style.display = "";
        }

        lblTicket.innerText = `Ticket ${ticket.number}`;
    } );
	// socket.emit("next-ticket", null, ticket => {
    //     lblNewTicket.innerText = ticket;
    // });
});
