import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

const SignUp = ({navigation}:any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSignUp = () => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User account created & signed in!');
                setErrorMessage(null);
            })
            .catch(error => {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        setErrorMessage('That email address is already in use!');
                        break;
                    case 'auth/invalid-email':
                        setErrorMessage('That email address is invalid!');
                        break;
                    default:
                        setErrorMessage(error.message);
                        break;
                }
            });
    };

    return (
        <View style={{ padding: 20 }}>
            {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Already have an account? Login" onPress={() => navigation.navigate('login')} />
        </View>
    );
}

export default SignUp;
