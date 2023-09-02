import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { auth } from '../../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '../../context/UserContext';
import { NavigationProp } from '@react-navigation/native';

const LoginScreen = ({ navigation }: any) => {
    const { setCurrentUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('logged in');
                const user = userCredential.user;
                setCurrentUser({
                    email: user.email || '',  // Handle the potential null here
                    uid: user.uid,
                    avatarURL: user.photoURL || '',  // Handle the potential null here
                });

                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setError(error.message);
                setLoading(false);
            });
    };
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <Text>LoginScreen</Text>
                <TextInput
                    style={styles.input}
                    placeholder="email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Text>{error}</Text>
                {loading ? (
                    <ActivityIndicator size='large' color="#0000ff" />
                ) : (
                    <>
                        <Button title="Sign In" onPress={signIn} />
                        <Button title="Register" onPress={() => navigation.navigate('register')} />
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: 200,
        height: 40,
        borderWidth: 1,
        borderColor: 'black'
    }
});

export default LoginScreen;
