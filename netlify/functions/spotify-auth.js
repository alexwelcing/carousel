// /netlify/functions/spotify-auth.js
const querystring = require('querystring');

exports.handler = async (event) => {
  const { code } = event.queryStringParameters;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Code not provided' }),
    };
  }

  // Your Spotify Client Credentials from Netlify's environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = encodeURIComponent(process.env.REDIRECT_URI);

  // Formulate the request for the access token
  const tokenRequestBody = querystring.stringify({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
  });

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      body: tokenRequestBody,
    });

    const tokenData = await tokenResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify(tokenData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error }),
    };
  }
};
