var url = window.location.hostname.includes("localhost")
	? "http://localhost:8080/api/auth/google"
	: "";

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

	fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	})
		.then( (resp) => resp.json() )
		.then( ({ token }) => {
            localStorage.setItem( "token", token );
        } )
		.catch(console.log);
}

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log("User signed out.");
	});
}
