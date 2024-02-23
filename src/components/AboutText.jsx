import { View, Text,StyleSheet, TextInput } from 'react-native'
import React,{useState} from 'react'
import { useTheme } from '../context/ThemeContext'
import Fonts from '../constant/Fonts'
import PrimaryButton from './Buttons/PrimaryButton'
import firestore from '@react-native-firebase/firestore'
import { showMessage } from 'react-native-flash-message'

const AboutText = ({text , userUid}) => {
    const theme = useTheme();
    const style = getStyles(theme);
    const [aboutText, setAboutText] = useState(null)
    const handleAboutText = () => {
        if(!aboutText){
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
            about: aboutText
        })
        .then(() => {
            console.log('About Text updated!');
        });
        setAboutText(null);
        showMessage({
            message: "About Text Updated",
            type: "success",
          });
        }
        catch(e){
            showMessage({
                message: "Error",
                description: e,
                type: "danger",
                });
            console.log(e)
        }
    }


  return (
    <View style={style.aboutWrapper}>
        {text && 
        <View style={style.aboutTitle}>
            <Text style={style.title}>About</Text>
        </View>}
        {text &&
        <View style={style.aboutText}>
            <Text style={style.text}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections </Text>
        </View>
        }
        {!text &&
        <View style={style.aboutText}>
            <Text style={style.text}>No Information Available</Text>
            <View>
            <TextInput
            multiline={true}
            placeholder="About Text"
            style={style.input}
            onChangeText={text => setAboutText(text)}
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
        paddingHorizontal:15,
        backgroundColor:theme.white,    
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
        marginTop:12,
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