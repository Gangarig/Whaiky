import React from 'react'
import { View, TextInput, Button, Alert } from 'react-native'
import  firebaseConfig from '../../firebaseConfig'
import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
            const user = userCredential.user;
    })
    .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
    });

      return (
        <View style={{ padding: 20 }}>
          <TextInput 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail}
            style={{ padding: 10, borderWidth: 1, marginBottom: 10 }}
          />
          <TextInput 
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ padding: 10, borderWidth: 1, marginBottom: 10 }}
          />
          <Button title="Login" onPress={signInWithEmailAndPassword} />
        </View>
      );
    };