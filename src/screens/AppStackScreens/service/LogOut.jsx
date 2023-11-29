import React from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Global } from '../../../constant/Global';
import Colors from '../../../constant/Colors';
import { TouchableOpacity,Text,StyleSheet } from 'react-native';
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

    return (
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        );
}
const styles = StyleSheet.create({
    button: {
        borderRadius: 5,
        padding: 10,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'center',
        marginVertical:10,
    },
    buttonText: {
        color: Colors.danger,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default LogoutButton;
