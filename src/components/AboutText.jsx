import { View, Text,StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React,{useEffect, useState} from 'react'
import { useTheme } from '../context/ThemeContext'
import Fonts from '../constant/Fonts'
import PrimaryButton from './Buttons/PrimaryButton'
import firestore from '@react-native-firebase/firestore'
import { showMessage } from 'react-native-flash-message'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Dialog from "react-native-dialog";
import { useAuth } from '../context/AuthContext'
import { KeyboardAvoidingView } from 'react-native'
import { Platform } from 'react-native'
const AboutText = ({userUid}) => {
    const {currentUser} = useAuth()
    const theme = useTheme();
    const style = getStyles(theme);
    const [aboutText, setAboutText] = useState(null)
    const [text, setText] = useState('')
    useEffect(() => {
        fetchAboutText();
    }, [])

    const fetchAboutText = async () => {
        try {
            const userDoc = await firestore().collection('users').doc(userUid).get();
            if (userDoc.exists) {
                setAboutText(userDoc.data().about);
            }
        } catch (error) {
            console.error('Error fetching about text:', error);
            showMessage({
                message: "Error",
                description: error,
                type: "danger",
                });
        }
    }
    const handleAboutText = () => {
        if(!text){
            showMessage({
                message: "Please Enter About Text",
                type: "danger",
              });
            return;
        }
        try {
        firestore()
        .collection('users')
        .doc(userUid)
        .update({
            about: text,
        })
        .then(() => {
            console.log('About Text updated!');
        });
        setText('')
        showMessage({
            message: "About Text Updated",
            type: "success",
          });
        }catch(e){
            showMessage({
                message: "Error",
                description: e,
                type: "danger",
                });
            console.log(e)
        }finally{
            fetchAboutText();
        }
    }

    const deleteAboutText = () => {
        try {
        firestore()
        .collection('users')
        .doc(userUid)
        .update({
            about: null,
        })
        .then(() => {
            showMessage({
                message: "About Text Deleted",
                type: "success",
                });
            console.log('About Text deleted!');
        });
        setText('')
        }
        catch(e){
            showMessage({
                message: "Error",
                description: e,
                type: "danger",
                });
            console.log(e)
        }
        finally{
            fetchAboutText();
        }
    }




  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={style.keyboard}
    >
        <View style={style.aboutWrapper}>
        {aboutText &&
        <View style={style.aboutContent}>
            <View style={style.aboutTitle}>
                <Text style={style.title}>About</Text>
            </View>
            <View style={style.aboutText}>
                <Text style={style.text}>
                    {aboutText}
                </Text>
            </View>
        {currentUser?.uid === userUid &&
        <TouchableOpacity onPress={() => deleteAboutText()} style={style.delete}>
            <FontAwesomeIcon icon="fa-solid fa-delete-left" color={theme.primary} size={20} />
        </TouchableOpacity>
        }
        </View>
        }
        {!aboutText &&
        <View style={style.aboutText}>
            <Text style={style.text}>No Information Available</Text>
            <View>
            {currentUser?.uid === userUid &&
            <View>
            <TextInput
            multiline={true}
            placeholder="About Text"
            style={style.input}
            onChangeText={text => setText(text)}
            placeholderTextColor={theme.gray}
            />
            <PrimaryButton text="Add About Text" onPress={() => handleAboutText()} />
            </View>}
            </View> 
        </View>
        }
        </View>
    </KeyboardAvoidingView>
  )
}

const getStyles = theme => StyleSheet.create({
    aboutWrapper:{
        width:'100%',
        marginTop:16,
        backgroundColor:theme.background,    
    },
    aboutTitle:{
        
    },
    title:{
        fontSize: 17,
        color: theme.text,
        fontWeight: 'bold',
        fontFamily: Fonts.primary,
    },
    aboutText:{

    },
    text:{
        fontSize: 12,
        color: theme.text,
        fontFamily: Fonts.primary,
    },
    input:{
        backgroundColor:theme.white,
        borderColor:theme.primary,
        borderWidth:1,
        borderRadius:10,
        padding:10,
        height:100,
        marginVertical:10,
        width:'100%',
        textAlignVertical: 'top',
        color:theme.text,
    },
    delete:{
        position:'absolute',
        right:0,
        top:0,
    },
    keyboard:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        paddingBottom: 100,
    }

})

export default AboutText