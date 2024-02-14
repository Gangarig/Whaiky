import React, { useState , useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet,ScrollView, Text ,TextInput,KeyboardAvoidingView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { uploadImages , openCamera , pickImages } from './Components/Utility';
import { showMessage } from 'react-native-flash-message';
import FastImage from 'react-native-fast-image';
import { useTheme } from '../../../../context/ThemeContext';
import { shadowStyle } from '../../../../constant/Shadow';
import { Global } from '../../../../constant/Global';
import { Platform } from 'react-native';



const Input = ({ onSend, chatId }) => {
  const [text, setText] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleTextSend = () => {
    const messageData = {
      text: text.trim(),
      user: { _id: chatId },
      image: imageUrls,
    };

    if (messageData.text || messageData.image.length > 0) {
      onSend([messageData]);
      setText('');
      setImageUrls([]);
    }
  };

  const handleImagePick = () => {
    pickImages()
      .then((images) => {
        uploadImages(images, chatId)
          .then((uploadedUrls) => {
            setImageUrls(uploadedUrls);
          })
          .catch((uploadError) => {
            console.error("Error uploading images: ", uploadError);
            showMessage({
              message: `Upload Error: ${uploadError.message}`,
              type: 'danger',
            });
          });
      })
      .catch((error) => {
        if (error.message !== "User cancelled image selection") {
          console.error("Error picking images: ", error);
          showMessage({
            message: `Error picking image: ${error.message}`,
            type: 'danger',
          });
        }
      });
  };
  
  const removeImage = (index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  }




  return (
    <View style={styles.container}>  
        <View style={styles.Input}>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            onSubmitEditing={handleTextSend}
            multiline={true}
            scrollEnabled={true}
          />
          {imageUrls.length > 0 && (
          <View style={styles.border}></View>
          )}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {imageUrls.length > 0 && (
            <View style={styles.imageContainer}>
              {imageUrls.map((imageUrl, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <FastImage
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                    onError={(e) => console.log("Image loading error:", e)}
                  />
                  <TouchableOpacity      style={styles.xBtn} onPress={() => removeImage(index)}>
                    <FontAwesomeIcon
                      icon="fa-solid fa-x"
                      size={20}
                      color='#FBFBFB'
                      style={shadowStyle}
                    />
                  </TouchableOpacity>
                </View>
              ))}

            </View>
          )
          }
          </ScrollView>
        </View>

        <View style={styles.btnContainer}>
              <TouchableOpacity onPress={handleImagePick}>
                <FontAwesomeIcon icon="fa-solid fa-paperclip" size={25} color={theme.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton} onPress={handleTextSend} disabled={!text.trim() && imageUrls.length === 0}>
                <FontAwesomeIcon icon="fa-solid fa-paper-plane" size={25} color={theme.primary} />
              </TouchableOpacity>
        </View>
    </View>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.background,
    position: 'absolute',
    width: '100%',
    ...shadowStyle,
    borderTopColor: theme.primary,
    borderTopWidth: 0.5,
    height: Platform.OS === 'ios' ? 50 : 60,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
  },
  border: {
    borderBottomColor: theme.primary,
    borderBottomWidth: 0.5,
    width: '100%',
  },
  Input: {
    flexDirection: 'column',
    width: '70%',
    borderWidth: 0.5,
    borderColor: theme.primary,
    borderRadius: 20,
    paddingHorizontal: 5,
    left: 10,
    bottom: 5,
    position: 'absolute',
    backgroundColor: theme.background,
    overflow: 'hidden',
    maxHeight: 300,
  },
  imageContainer: {
    flexDirection: 'row',
    backgroundColor: theme.background,
    gap: 10,
    scrollEnabled: true,
    width: '100%',
    padding: 10,
  },
  textInput: {
    padding: 10,
    paddingTop: 10,
    fontSize: 16,
    ...Global.text,
  },
  btnContainer: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    gap: 15,
  },
  imageScrollContainer: {
    width: '100%',
  },
  image:{
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 0,
  },
  xBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 50,
  },
  

});
}

export default Input;
