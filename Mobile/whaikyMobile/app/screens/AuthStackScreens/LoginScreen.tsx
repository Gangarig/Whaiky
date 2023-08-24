import { View, Text, StyleSheet, TextInput, Button,KeyboardAvoidingView } from 'react-native'
import { ActivityIndicator } from 'react-native' 
import React from 'react'
import { useState } from 'react'
import { FIREBASE_AUTH } from '../../../FirebaseConfig'
import { signInWithEmailAndPassword , createUserWithEmailAndPassword} from 'firebase/auth'
import { set } from 'firebase/database'
import { NavigationProp } from '@react-navigation/native'

interface RouterProps {
    navigation: NavigationProp<any, any>;
  }

const LoginScreen = ({navigation}:RouterProps) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const auth = FIREBASE_AUTH;
    const signIn = async () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('logged in')
            })
            .catch((error) => {
                console.log(error)
            });
    }

  return (
   
    <View style={styles.container}>
        <KeyboardAvoidingView behavior='padding'>
            <Text>LoginScreen</Text>
            <TextInput style={styles.input} placeholder="email" value={email} onChangeText={text => setEmail(text)} />
            <TextInput style={styles.input} placeholder="password" secureTextEntry={true} value={password} onChangeText={text => setPassword(text)} />
            <Text>{error}</Text>
            { loading ? (<ActivityIndicator size='large' color="#0000ff" />
            ): (<>
                <Button title="Sign In" onPress={signIn} />
                <Button title="Register" onPress={()=>navigation.navigate("register")} />
            </>)}
        </KeyboardAvoidingView>
    </View>
  )
}

export default LoginScreen

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
})