import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text, Alert, Linking, ActivityIndicator } from 'react-native';
import { authenticateWithGmail, fetchEmails } from './GmailApi';

//mocking getEmails function, to be replaced
const getEmails = async () => {
    //simulate fetching emails from a server
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(
                [{
                    sender: 'google-takeout@example.com',
                    body: 'Here is your Google Takeout download link: https://takeout.google.com/download',
                }]

            );
        }, 1000);
    });
};


const GoogleTakeoutDownload = () => {

    const [downloadLink, setDownloadLink] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Function to fetch download link from email
        const fetchDownloadLink = async () => {
            try {
                setLoading(true);

                const accessToken = await authenticateWithGmail();
                const emails = await fetchEmails(accessToken);

                //Fetching mocked emails
                // const emails = await getEmails();

                // Search for the email containing the Google Takeout download link
                const googleTakeoutEmail = emails.find(email => email.sender === 'google-takeout@example.com');

                if (googleTakeoutEmail) {
                    // Extract the download link from the email body (assuming it's in plain text)
                    const regex = /(https?:\/\/[^\s]+)/g;
                    const downloadLink = googleTakeoutEmail.body.match(regex)[0];
                    setDownloadLink(downloadLink);
                } else {
                    Alert.alert('Google Takeout Email not found', 'No email containing Google Takeout link found.');
                }
            } catch (error) {
                console.error('Error fetching emails:', error);
                Alert.alert('Error', 'Failed to fetch emails. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDownloadLink(); // Call the fetchDownloadLink function directly inside the useEffect hook
    }, []);

    const handleDownload = () => {
        if (downloadLink) {
            // Open the download link in the default browser or a webview
            Linking.openURL(downloadLink);
        } else {
            // Handle case where download link is not available
            Alert.alert('Download Link Not Found', 'Please make sure to fetch the download link first.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Budgeted Expense</Text>
            {loading ? (
                <ActivityIndicator size="large" color='#0000ff' />
            ) : (
                    <>
                        {downloadLink ? (
                            <>
                                <Text style={styles.downloadLink}>Download Link {downloadLink}</Text>
                                <Button title='Download data' onPress={() => handleDownload()} />
                            </>
                        ) : (
                                <Button title='Fetching download link ...' disabled={true} />
                            )}
                    </>
                )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',

    },
    title: {
        marginBottom: 20,
    },
    dwnLink: {
        marginTop: 20,
    }
});


export default GoogleTakeoutDownload;