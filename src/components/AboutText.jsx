import { View, Text,StyleSheet, TextInput } from 'react-native'
import React,{useEffect, useState} from 'react'
import { useTheme } from '../context/ThemeContext'
import Fonts from '../constant/Fonts'
import PrimaryButton from './Buttons/PrimaryButton'
import firestore from '@react-native-firebase/firestore'
import { showMessage } from 'react-native-flash-message'

const AboutText = ({userUid}) => {
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


  return (
    <View style={style.aboutWrapper}>
        {aboutText &&
        <View style={style.aboutTitle}>
            <Text style={style.title}>About</Text>
        </View>}
        {aboutText &&
        <View style={style.aboutText}>
            <Text style={style.text}>
                {aboutText}
            </Text>
        </View>
        }
        {!aboutText &&
        <View style={style.aboutText}>
            <Text style={style.text}>No Information Available</Text>
            <View>
            <TextInput
            multiline={true}
            placeholder="About Text"
            style={style.input}
            onChangeText={text => setText(text)}
            />
            <PrimaryButton text="Add About Text" onPress={() => handleAboutText()} />
            </View> 
        </View>
        }
    </View>
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
    }

})

export default AboutText