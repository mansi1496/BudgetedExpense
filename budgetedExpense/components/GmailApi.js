import { AuthSession } from 'expo-auth-session';
import axios from 'axios';

const GMAIL_API_URL = 'https://www.googleapis.com/gmail/v1';

const CLIENT_ID = '314897122232-nveejbp1eqnvpoma7qsjaclnk6bgja82.apps.googleusercontent.com';

const scopes = 'https://www.googleapis.com/auth/gmail.readonly';

// const REDIRECT_URI = AuthSession.getRedirectUrl();

//function to authenticate with gmail api
export const authenticateWithGmail = async () => {

    const { authentication } = await AuthSession.startAsync({
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth', // Replace 'YOUR_AUTH_URL' with your actual authentication URL
    });

    if (authentication?.accessToken) {
        return authentication.accessToken;
    } else {
        throw new Error('Failed to authenticate with Gmail');
    }
};

//function to fetch emails from gmail API
export const fetchEmails = async (accessToken) => {
    try {
        //fetch email list
        const response = await axios.get(`${GMAIL_API_URL}/users/me/messages`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        //extract relevant email data
        const emails = response.data.messages.map(message => ({
            id: message.id,
            snippet: message.snippet,
        }));

        return emails;

    } catch (error) {
        throw new Error('Failed to fetch emails from Gmail API');
    }
};