import React from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';

export const LogoutButton = () => {
    const handleLogout = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'))
            .catch(error => {
                // Handle the error here if necessary.
                console.error("Error signing out: ", error);
            });
    };

    return <Button title="Log Out" onPress={handleLogout} />;
}

export default LogoutButton;
