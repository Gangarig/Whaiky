import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../../context/ThemeContext';
import Fonts from '../../constant/Fonts';
const Support = ({navigation}) => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const theme = useTheme();
  const styles = getStyles(theme);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleSend = () => {
    if (!email || !message) {
      showMessage({
        message: 'Please fill out all fields',
        type: 'danger',
      });
      return;
    }
    if (!validateEmail(email)) {
      showMessage({
        message: 'Invalid email',
        type: 'danger',
      });
      return;
    }
    try {
      firestore()
        .collection('support')
        .add({
          email,
          message,
          userId: currentUser.uid,
          timestamp: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          showMessage({
            message: 'Message sent!',
            type: 'success',
          });
          setEmail('');
          setMessage('');
        });
        navigation.goBack();
    } catch (error) {
      console.error('Error sending message:', error);
      showMessage({
        message: 'Failed to send message',
        type: 'danger',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Support</Text>
      <Text style={styles.infoText}>
        If you have any questions or need assistance, please fill out the form below or send us an email at <Text style={styles.email}>Admin@whaiky.com</Text>.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={[styles.input, styles.messageBox]}
        placeholder="Your Message"
        value={message}
        onChangeText={setMessage}
        multiline={true}
        numberOfLines={4}
      />  
      <PrimaryButton text="Send" onPress={handleSend} />
    </View>
  );
};

const getStyles = theme => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    marginBottom: 20,
    color: theme.text,
  },
  email: {
    color: theme.primary,
    fontFamily: Fonts.primary,
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.primary,
    padding: 10,
    borderRadius: 5,
    color: theme.text,
  },
  messageBox: {
    height: 100,
    textAlignVertical: 'top', 
  },
});

export default Support;
