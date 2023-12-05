  import React, { useState } from 'react';
  import { View, TouchableOpacity, StyleSheet, Text ,TextInput,KeyboardAvoidingView } from 'react-native';
  import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
  import ImageCropPicker from 'react-native-image-crop-picker';
  import { uploadImages , openCamera , pickImages } from './Utility';
  import { showMessage } from 'react-native-flash-message';
  import FastImage from 'react-native-fast-image';
  import Colors from '../../../../constant/Colors';
  import { shadowStyle } from '../../../../constant/Shadow';
  import { Global } from '../../../../constant/Global';
  import { Platform } from 'react-native';


  const Input = ({ onSend , chatId }) => {
    const [text, setText] = useState('');
    const [imageUrls, setImageUrls] = useState([]);

    const handleTextSend = () => {  
      // Constructing the message object
      const messageData = {
        text: text.trim(),
        user: { _id: chatId },
        image: imageUrls,
      };
    
      // Check if either text or image URLs are present
      if (messageData.text || messageData.image.length > 0) {
        onSend([messageData]);
        setText('');
        setImageUrls([]); // Clear the text and imageUrls after sending
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
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "margin" : null}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 100 })}
      style={{ width: '100%' }}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconButton} onPress={handleImagePick}>
          <FontAwesomeIcon icon="fa-solid fa-image" size={24} color={Colors.primary} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.iconButton} onPress={openCamera}>
          <FontAwesomeIcon icon="fa-solid fa-camera" size={24} color="gray" />
        </TouchableOpacity> */}

          
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          onSubmitEditing={handleTextSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleTextSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
        {imageUrls.length > 0 && (
        <View style={styles.selectedImages}>
          {imageUrls.map((imageUrl, index) => (
            <View key={index} style={styles.imageWrapper}>
              <FastImage
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
              <TouchableOpacity      style={styles.xBtn} onPress={() => removeImage(index)}>
                <FontAwesomeIcon
                  icon="fa-solid fa-x"
                  size={20}
                  color={Colors.black}
             
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        )
        }
      </View>
      </KeyboardAvoidingView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent : 'center',
      paddingHorizontal: 10,
      backgroundColor: Colors.background,

    },
    iconButton: {
      marginRight: 10,

    },
    input: {
      flex: 1,
      flexWrap: 'wrap',
      borderWidth: 1,
      borderColor: Colors.primary,
      borderRadius: 10,
      color: Colors.black,
      padding : 10,

    },
    sendButton: {
      marginLeft: 10,
    },
    sendText: {
      color: Colors.primary,

    },
    selectedImages: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 5,
      position: 'absolute',
      bottom: 60,
      left: 10,
      backgroundColor: Colors.primary,
      borderRadius: 13,
      ...shadowStyle,
    },
    imageWrapper: {
      position: 'relative',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 13,
      margin: 5,
      ...shadowStyle,
    },
    xBtn: {
      position: 'absolute',
      top: 10,
      right: 10,
      opacity: 1,
      color: Colors.muted,
    },

  });

  export default Input;
