import { View, Text , StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native'
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
import PhoneInputComponent from '../../../components/PhoneInput'
import TwoSelectButton from '../../../components/Buttons/TwoSelectButton'
import LocationPicker from '../service/LocationPicker'
import { BlurView } from "@react-native-community/blur";

const PersonalInfo = ({navigation}) => {
  const {currentUser} = useAuth()
  const theme = useTheme()
  const styles = getStyles(theme)
  const [data, setData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    displayName: currentUser?.displayName || '',
    phoneNumber: currentUser?.phoneNumber || '',
    photoURL: currentUser?.photoURL || '',
    country: currentUser?.country || '',
    state: currentUser?.state || '',
    city: currentUser?.city || '',
  });
  const [blur , setBlur] = useState(false)
  const [phoneModal, setPhoneModal] = useState(false);
  const hasChanges = () => {
    return (
      data.firstName !== currentUser?.firstName ||
      data.lastName !== currentUser?.lastName ||
      data.displayName !== currentUser?.displayName ||
      data.phoneNumber !== currentUser?.phoneNumber ||
      data.photoURL !== currentUser?.photoURL ||
      data.country !== currentUser?.country ||
      data.state !== currentUser?.state ||
      data.city !== currentUser?.city

    );
  };
  const [locationModal, setLocationModal] = useState(false);

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
    {blur && (
        <BlurView
        style={styles.blur}
        blurType="light"
        blurAmount={5}
        reducedTransparencyFallbackColor="white"
        />
    )}
      <View style={styles.avatarWrapper}>
        {currentUser?.photoURL ? (
          <FastImage 
            style={styles.avatar}
            source={{ uri: currentUser?.photoURL, priority: FastImage.priority.normal }}
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
        defaultValue={currentUser?.firstName  || 'Currently Empty'}
        style={styles.input}
        >
        </TextInput>
        <TextInput 
        style={styles.input}
        onChangeText={(text)=>setData({...data, lastName: text})}
        defaultValue={currentUser?.lastName || 'Currently Empty'}
        >
        </TextInput>
        <Text style={styles.inputLabel}>User Name</Text>
        <TextInput 
        style={styles.input}
        onChangeText={(text)=>setData({...data, displayName: text})}
        defaultValue={currentUser?.displayName || 'Currently Empty'}
        >
        </TextInput>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
         style={styles.input}
         editable={false}
         defaultValue={currentUser?.email}
         ></TextInput>
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
         style={styles.input}
         editable={false}
         defaultValue={currentUser?.phoneNumber || 'Currently Empty'}
         ></TextInput>
      </View> 
      <View style={styles.info}>
          <Text style={styles.infoLabel}>Location</Text>
          <View style={styles.infoTextWrapper}>
            <Text style={styles.inputText}>Country: {currentUser?.country }</Text>
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
      <View style={styles.btnContainer}>
          <TwoSelectButton
          primary="Location"
          secondary="Phone Number"
          onPressPrimary={()=>{
            setBlur(true)
            setLocationModal(true)
          }}
          onPressSecondary={
            ()=>{setPhoneModal(true),setBlur(true)}}
          />
      </View>
      
      <PhoneInputComponent 
      visible={phoneModal}
      onCancel={()=>{setPhoneModal(false),setBlur(false)}}
      onSave={(phoneNumber)=>{
        setData(prevData => ({
          ...prevData,
          phoneNumber: phoneNumber,
        }));
        setPhoneModal(false);
        setBlur(false);
      }
      }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={blur}
        onRequestClose={() => {
          setBlur(false)
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
        <LocationPicker
          onSave={(country, state, city) => {
            setData(prevData => ({
              ...prevData,
              country,
              state,
              city,
            }));
            setBlur(false);
            setLocationModal(false);
          }}
          onClose={() => {
            setBlur(false);
            setLocationModal(false);
          }}
        />
        </View>
        </View>
      </Modal>


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
    borderWidth: 1,
    borderColor: theme.primary,
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
  info: {
    width: '100%',
    borderBottomColor: theme.primary,
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  infoLabel: {
    borderBottomColor: theme.primary,
    borderBottomWidth: 1,
    color: theme.text,
    fontSize: 14,
    fontFamily: Fonts.primary,
    paddingBottom: 5,
  },
  infoTextWrapper: {
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
  },
  blur: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
    height: "110%",
    width: "110%",
    zIndex: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor:'transparent',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: theme.background,
    height: 550,
    borderTopColor: theme.primary,
    borderTopWidth: 1,
    paddingBottom: 20,
  },
})
