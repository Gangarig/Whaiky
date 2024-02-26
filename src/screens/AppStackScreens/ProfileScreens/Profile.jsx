import { View, Text , StyleSheet,ScrollView } from 'react-native'
import React ,{useState,useEffect}from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useTheme } from '../../../context/ThemeContext'
import SecondaryDocumentCard from '../../../components/SecondaryDocumentCard'
import SecondaryProfileCard from '../../../components/SecondaryProfileCard'
import AboutText from '../../../components/AboutText'
import TwoSelectButtonGradient from '../../../components/Buttons/TwoSelectButtonGradient'
import Fonts from '../../../constant/Fonts'
import firestore from '@react-native-firebase/firestore'

const Profile = ({navigation}) => {
  const { currentUser } = useAuth()
  const [docs, setDocs] = useState([])
  const theme = useTheme()
  const style = getStyles(theme)

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('documents')
      .onSnapshot(querySnapshot => {
        const documents = [];
        querySnapshot.forEach(documentSnapshot => {
          const docData = documentSnapshot.data();
          const createdAtDate = docData.createdAt ? new Date(docData.createdAt._seconds * 1000) : null;
          documents.push({
            ...docData,
            key: documentSnapshot.id,
            createdAt: createdAtDate,
          });
        });
        setDocs(documents);
      });
    return () => subscriber();
  }, []);
  



  return (
    <ScrollView style={style.container}
      showsHorizontalScrollIndicator  = {false}
      showsVerticalScrollIndicator = {false}
      contentContainerStyle={style.ScrollView}
    > 
      <SecondaryProfileCard profile={currentUser} navigation={navigation}/>
      <AboutText userUid={currentUser.uid}/>
      <View style={style.documents}>
        <Text style={style.docTitle}>Documents</Text>
        {docs.map((doc, index) => (
          <SecondaryDocumentCard
            key={index}
            item={doc}
            navigation={navigation}
            onPress={() => navigation.navigate('DocumentDetail', { doc })}
          />
        ))}
      </View>
      <TwoSelectButtonGradient   
        primary="Upload Certificate"
        secondary="Upload Document"
        onPressPrimary={() => navigation.navigate('Certificate')}
        onPressSecondary={() => navigation.navigate('DocumentUpload')}
      />
    </ScrollView>
  )
}

const getStyles = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding : 15
    },
    ScrollView: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },

    documents: {
      marginTop: 20,
      flexDirection: 'column',
      width: '100%',
    },
    docTitle: {
      fontSize: 17,
      color: theme.text,
      fontWeight: 'bold',
      fontFamily: Fonts.primary,
      paddingLeft: 15,
    }
  })
}
export default Profile