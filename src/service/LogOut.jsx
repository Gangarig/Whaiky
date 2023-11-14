import React from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';

export const LogoutButton = () => {
    const handleLogout = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'))
            .catch(error => {
                showMessage({
                    message: error.message,
                    type: 'danger',
                });
            });
    };

    return <Button title="Log Out" onPress={handleLogout} />;
}

export default LogoutButton;
