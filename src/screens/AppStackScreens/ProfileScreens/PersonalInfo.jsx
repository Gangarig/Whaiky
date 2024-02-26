import { View, Text , StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React , { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useTheme } from '../../../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import FastImage from 'react-native-fast-image'
import Fonts from '../../../constant/Fonts'
import PrimaryButton from '../../../components/Buttons/PrimaryButton'
import { updateProfile } from './Utility'
import { showMessage } from 'react-native-flash-message'
import { handleAvatarChange } from '../service/Image/AvatarChange'

const PersonalInfo = ({navigation}) => {
  const {currentUser} = useAuth()
  // console.log('currentUser:', currentUser.photoURL);
  const theme = useTheme()
  const styles = getStyles(theme)
  const [data, setData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    displayName: currentUser?.displayName || '',
   
  });

  const hasChanges = () => {
    return (
      data.firstName !== currentUser?.firstName ||
      data.lastName !== currentUser?.lastName ||
      data.displayName !== currentUser?.displayName
     
    );
  };

  const updateAvatar = (newAvatarURL) => {
    setData(prevData => ({
      ...prevData,
      photoURL: newAvatarURL,
    }));
  };
  
  
  const handleUpdate = async () => {
    if (!hasChanges()) {
      showMessage({
        message: "No changes made",
        type: "info",
      });
      return;
    }
    try {
      await updateProfile(currentUser.uid, data);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage({
        message: 'Error updating profile',
        type: 'danger',
      });
    }
  };
  
  return (
    <ScrollView style={styles.ScrollView}
      contentContainerStyle={styles.ScrollViewContent}
    >
      <View style={styles.avatarWrapper}>
        {data.photoURL ? (
          <FastImage 
            style={styles.avatar}
            source={{ uri: data.photoURL, priority: FastImage.priority.normal }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <FontAwesomeIcon icon='fa-regular fa-user' size={60} color={theme.primary} />
        )}
        <TouchableOpacity style={styles.changeAvatar} onPress={() => handleAvatarChange(currentUser, updateAvatar)}>
          <FontAwesomeIcon icon='fa-solid fa-camera' size={20} color={theme.primary} />
        </TouchableOpacity>

      </View>
      <View style={styles.inputs}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
        onChangeText={(text)=>setData({...data, firstName: text})}
        defaultValue={currentUser?.firstName}
        style={styles.input}
        >
        </TextInput>
        <TextInput 
        style={styles.input}
        onChangeText={(text)=>setData({...data, lastName: text})}
        defaultValue={currentUser?.lastName}
        >
        </TextInput>
        <Text style={styles.inputLabel}>User Name</Text>
        <TextInput 
        style={styles.input}
        onChangeText={(text)=>setData({...data, displayName: text})}
        defaultValue={currentUser?.displayName}
        >
        </TextInput>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
         style={styles.input}
         editable={false}
         defaultValue={currentUser?.email}
         ></TextInput>
      </View> 
      <View style={styles.location}>
          <Text style={styles.locationLabel}>Location</Text>
          <View style={styles.locationTextWrapper}>
            <Text style={styles.inputText}>Country: {currentUser?.country}</Text>
            <Text style={styles.inputText}>State: {currentUser?.state}</Text>
            <Text style={styles.inputText}>City: {currentUser?.city}</Text>
          </View>
      </View>
      <View style={styles.btnContainer}>
        {hasChanges() && (
          <PrimaryButton
            text="Save"
            onPress={hasChanges() ? () => handleUpdate() : null}
            style={{ opacity: hasChanges() ? 1 : 0.5 }}
          />
        )}
      </View>
    </ScrollView>
  )
}

export default PersonalInfo

const getStyles = (theme) => StyleSheet.create({
  ScrollView: {
    flex: 1,
    backgroundColor: theme.background,
  },
  ScrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.primary,

  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatar: {
    position: 'absolute',
    bottom: 0,
    right: -0,
    backgroundColor: theme.white,
    borderRadius: 50,
    padding: 5,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  inputs: {
    width: '100%',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    height: 42,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    fontSize: 14,
    fontFamily: Fonts.primary,
    color: theme.text,
  },
  inputLabel: {
    color: theme.text,
    fontSize: 14,
    fontFamily: Fonts.primary,
    marginTop: 10,
  },
  location: {
    width: '100%',
    borderBottomColor: theme.primary,
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  locationLabel: {
    borderBottomColor: theme.primary,
    borderBottomWidth: 1,
    color: theme.text,
    fontSize: 14,
    fontFamily: Fonts.primary,
    paddingBottom: 5,
  },
  locationTextWrapper: {
    paddingLeft: 20,
  },
  inputText: {
    color: theme.text,
    fontSize: 14,
    fontFamily: Fonts.primary,
    marginTop: 6,
  },
  btnContainer: {
    width: '100%',
    marginTop: 20,
  }

})
