import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [attemptCount, setAttemptCount] = useState(0);

    const handleSignIn = () => {
        if (!email || !password) {
          setErrorMessage('Please fill in all fields.');
          return;
        }
      
        if (attemptCount >= 3) {
          setErrorMessage('Too many failed attempts. Please wait and try again.');
          return;
        }
      
        auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            console.log('User signed in!');
            setErrorMessage(null);
            setEmail('');
            setPassword('');
            setAttemptCount(0);
          })
          .catch(error => {
            setEmail('');
            setPassword('');
            setAttemptCount(prevCount => prevCount + 1);
      
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
