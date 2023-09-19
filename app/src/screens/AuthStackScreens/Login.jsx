import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSignIn = () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User signed in!');
                setErrorMessage(null);
            })
            .catch(error => {
                switch (error.code) {
                    case 'auth/user-not-found':
                        setErrorMessage('There is no user corresponding to the given email.');
                        break;
                    case 'auth/wrong-password':
                        setErrorMessage('Wrong password.');
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
        <SafeAreaView>
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
                <Button title="Sign In" onPress={handleSignIn} />
                <Button title="Don't have an account? Sign Up" onPress={() => navigation.navigate('signup')} />
                <Button title="Forgot Password?" onPress={() => navigation.navigate('forgot')} />
            </View>
        </SafeAreaView>
    );
}

export default Login;
