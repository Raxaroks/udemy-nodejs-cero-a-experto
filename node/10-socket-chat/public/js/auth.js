
const myForm = document.querySelector("form");

const baseUrl = window.location.hostname.includes("localhost")
	? "http://localhost:8080/api"
	: "";

myForm.addEventListener( "submit", evt => {
    evt.preventDefault();

    const formData = {};
    for ( let elm of myForm.elements ) {
        if ( elm.name.length > 0 ) {
            formData[elm.name] = elm.value;
        }
    }
    // console.log( formData );

    const url = `${ baseUrl }/auth/login`;
    fetch( url, {
        method: "POST",
        body: JSON.stringify( formData ),
        headers: { "Content-Type": "application/json" }
    } )
        .then( resp => resp.json() )
        .then( ({ msg, token }) => {
            if (msg.toLowerCase().trim() !== "Login ok".toLowerCase().trim()) {
                return console.error(msg);
            }
            localStorage.setItem( "token", token );
            window.location = "chat.html";
        } )
        .catch( err => {
            console.error( err );
        } );
} );

function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	// Do not send to your backend! Use an ID token instead.
	// console.log('ID: ' + profile.getId());
	// console.log('Name: ' + profile.getName());
	// console.log('Image URL: ' + profile.getImageUrl());
	// This is null if the 'email' scope is not present.
	// console.log('Email: ' + profile.getEmail());

	var id_token = googleUser.getAuthResponse().id_token;
	const data = { id_token };

    const url = `${ baseUrl }/auth/google`;

	fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})
		.then( (resp) => resp.json() )
		.then( ({ token }) => {
            localStorage.setItem( "token", token );
            window.location = "chat.html";
        } )
		.catch(console.log);
}

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log("User signed out.");
	});
}
