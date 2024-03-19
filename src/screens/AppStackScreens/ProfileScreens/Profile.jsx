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
import Services from '../../../components/Services'
import ServiceButton from '../../../components/Buttons/ServiceButton'
import { RefreshControl } from 'react-native'

const Profile = ({navigation}) => {
  const { currentUser } = useAuth()
  const [docs, setDocs] = useState([])
  const theme = useTheme()
  const style = getStyles(theme)
  const [active, setActive] = useState(true)
  const [refreshing, setRefreshing] = useState(false);


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

  const refresh = () => {
    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('documents')
      .get()
      .then(querySnapshot => {
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
  } 


  return (
    <ScrollView style={style.container}
      showsHorizontalScrollIndicator  = {false}
      showsVerticalScrollIndicator = {false}
      contentContainerStyle={style.ScrollView}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
        />
      }
    > 
      <SecondaryProfileCard profile={currentUser} navigation={navigation}/>
      <AboutText userUid={currentUser.uid}/>
      {currentUser?.services && (
      <View style={style.documents}>
        <Text style={style.docTitle}>My Services</Text>
        <Services navigation={navigation} services={currentUser.services}/>
        <ServiceButton navigation={navigation} onPress={()=>navigation.navigate('Services')}/>
      </View>
      )}
      {docs.length > 0 && (
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
      )}
      {currentUser?.status === 'contractor' && (
      <TwoSelectButtonGradient   
        primary="Upload Certificate"
        secondary="Upload Document"
        primaryActive={active}
        secondaryActive={!active}
        onPressPrimary={() => {
          setActive(!active)
          navigation.navigate('Certificate')
        }}
        onPressSecondary={() => {
          setActive(!active)
          navigation.navigate('DocumentUpload')
        }}
      />
      )} 
    </ScrollView>
  )
}

const getStyles = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding : 15,
    },
    ScrollView: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingBottom: 30,
    },

    documents: {
      marginTop: 16,
      flexDirection: 'column',
      width: '100%',
      marginBottom: 16,
    },
    docTitle: {
      fontSize: 17,
      color: theme.text,
      fontWeight: 'bold',
      fontFamily: Fonts.primary,
      marginBottom: 16,
    }
  })
}
export default Profile