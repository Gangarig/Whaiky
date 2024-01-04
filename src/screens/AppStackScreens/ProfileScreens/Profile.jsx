import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, SafeAreaView, ScrollView ,TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '../../../context/AuthContext';
import defaultAvatar from '../../../assets/images/avatar/avatar.png';
import { Global } from '../../../constant/Global';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { shadowStyle } from '../../../constant/Shadow';
import  Colors  from '../../../constant/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import GradientButton from '../../../components/GradientButton';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';


const Profile = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

    useEffect(() => {
      if (currentUser?.uid) {
        const userDocRef = firestore().collection('users').doc(currentUser.uid);
        const unsubscribe = userDocRef.onSnapshot((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          }
        });
  
        return () => unsubscribe();
      }
    }, [currentUser]);

  
    const getUserDataValue = (key, defaultValue = 'N/A') => {
      return userData && userData[key] ? userData[key] : defaultValue;
    };
  
  const handleContractor = async () => {
    try {
      if (currentUser?.uid) {
        const querySnapshot = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('documents')
          .where('status', '==', 'approved')
          .get();
  
        if (!querySnapshot.empty) {
          navigation.navigate('Contractor'); 
        } else {
          navigation.navigate('Services'); 
        }
      } else {
        // Handle the case where user document does not exist
        showMessage({
          message: 'User document not found.',
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showMessage({
        message: 'An error occurred while fetching user data.',
        type: 'danger',
      });
    }
  };
  
  return (
    <ScrollView style={[styles.container]}
        contentContainerStyle={styles.ScrollView}
      >
      <View style={styles.LinearGradientWrapper}>
      {userData && (
        <LinearGradient
          colors={['#9E41F0', '#4C7BC0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.profileContainer}
        >
          <View style={styles.avatarWrapper}>
            <FastImage
              source={userData.photoURL ? { uri: userData.photoURL } : defaultAvatar}
              style={styles.avatar}
            />
            <TouchableOpacity onPress={() => navigation.navigate('PersonalInfo')} style={styles.Edit}>
              <FontAwesomeIcon icon='fa-solid fa-pen-to-square' color='#fff' size={32} />
            </TouchableOpacity>
          </View>
          <Text style={styles.nameText}>{getUserDataValue('displayName')}</Text>
          <View style={styles.infoWrapper}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>First Name:</Text>
              <Text style={styles.infoText}>{getUserDataValue('firstName')}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Last Name:</Text>
              <Text style={styles.infoText}>{getUserDataValue('lastName')}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Email:</Text>
              <Text style={styles.infoText}>{getUserDataValue('email')}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Phone:</Text>
              <Text style={styles.infoText}>{getUserDataValue('phoneNumbers', []).join(', ')}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Country:</Text>
              <Text style={styles.infoText}>{getUserDataValue('country')}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>State:</Text>
              <Text style={styles.infoText}>{getUserDataValue('state')}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>City:</Text>
              <Text style={styles.infoText}>{getUserDataValue('city')}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Status:</Text>
              <Text style={styles.infoText}>{getUserDataValue('status')}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Created:</Text>
              <Text style={styles.infoText}>
                {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
        </LinearGradient>
        
      )}
      </View>
      {!userData && (
        <View>
          <Text>No user data found.</Text>
        </View>
      )}
      <View style={styles.LinearGradientWrapper}>
          <LinearGradient
          colors={['#9E41F0', '#4C7BC0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.profileContainer}
        > 
          {currentUser.status == 'user' && (
          <TouchableOpacity onPress={handleContractor}>
            <Text style={[styles.btnText]}>Become a Contractor</Text>
          </TouchableOpacity>
          )}
          {currentUser.status == 'contractor' && (
            <View style={styles.contractorLinks}>
            <TouchableOpacity style={styles.linkWrapper} onPress={()=>navigation.navigate('DocumentUpload')}>
              <Text style={[styles.btnText]}>Upload Document</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkWrapper} onPress={()=>navigation.navigate('Certificate')}>
              <Text style={[styles.btnText]}>Upload Certificate</Text>
            </TouchableOpacity>
            </View>
          )}
          {currentUser.status == 'admin' && (
             <View style={styles.contractorLinks}>
              <TouchableOpacity style={styles.linkWrapper} onPress={()=>navigation.navigate('DashBoard')}>
                <Text style={[styles.btnText]}>DashBoard</Text>
              </TouchableOpacity>
              </View>
            )  
          }
        </LinearGradient>
      </View>

    </ScrollView>
  );
  

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    width: '100%',
    paddingVertical: 20,
  },
  ScrollView: {
    flexGrow: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    gap: 20,
    paddingBottom: 100,
    backgroundColor: Colors.background,
  },
  LinearGradientWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle
  },
  profileContainer: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    minWidth:300,
  },
  contractorLinks:{
    gap:15,
  } ,
  linkWrapper:{
    borderBottomColor:Colors.white,
    borderBottomWidth:1,
  },
  avatar: {
    width: 114,
    height: 119,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 100,
    backgroundColor: Colors.background,
  },
  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.white,
    paddingBottom: 10,
  },
  btnText:{
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  infoWrapper: {
    width: '100%',
    gap: 5,
    paddingBottom: 80,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  avatarWrapper:{
    position:'relative',
  },
  Edit:{
    position:'absolute',
    right:0,
    bottom:0,
    ...shadowStyle,
  }
});

export default Profile;
