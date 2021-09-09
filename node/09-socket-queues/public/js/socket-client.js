// Referencias del HTML
const lblOnline = document.querySelector("#lblOnline");
const lblOffline = document.querySelector("#lblOffline");
const txtMessage = document.querySelector("#txtMessage");
const sendBtn = document.querySelector("#sendBtn");

const socket = io();

socket.on("connect", () => {
	// console.log('Conectado');

	lblOffline.style.display = "none";
	lblOnline.style.display = "";
});

socket.on("disconnect", () => {
	// console.log('Desconectado del servidor');

	lblOnline.style.display = "none";
	lblOffline.style.display = "";
});

socket.on("send-message", (payload) => {
	console.log(payload);
});

btnEnviar.addEventListener("click", () => {
	const mensaje = txtMensaje.value;
	const payload = {
		mensaje,
		id: "123ABC",
		fecha: new Date().getTime(),
	};

	socket.emit("send-message", payload, (id) => {
		console.log("Desde el server", id);
	});
});
