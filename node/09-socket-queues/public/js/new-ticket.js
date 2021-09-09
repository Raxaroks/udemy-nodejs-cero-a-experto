
const lblNewTicket = document.querySelector("#lblNewTicket");
const createBtn = document.querySelector("#createBtn");

const socket = io();

socket.on("connect", () => {
	// console.log('Conectado');
    createBtn.disabled = false;
});

socket.on("disconnect", () => {
    createBtn.disabled = true;
});

socket.on("last-ticket", last => {
    lblNewTicket.innerText = `Ticket ${ last }`
});

createBtn.addEventListener("click", () => {
	socket.emit("next-ticket", null, ticket => {
        lblNewTicket.innerText = ticket;
    });
});