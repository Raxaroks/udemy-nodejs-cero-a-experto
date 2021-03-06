const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async ( idToken = "" ) => {
	const ticket = await client.verifyIdToken({
		idToken,
		audience: process.env.GOOGLE_CLIENT_ID, 
	});

	const { name: username, picture: img, email } = ticket.getPayload();
	
    return { username, img, email };
}

module.exports = { googleVerify };