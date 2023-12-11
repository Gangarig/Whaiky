  import React, { useState , useEffect } from 'react';
  import { View, TouchableOpacity, StyleSheet, Text ,TextInput,KeyboardAvoidingView } from 'react-native';
  import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
  import ImageCropPicker from 'react-native-image-crop-picker';
  import { uploadImages , openCamera , pickImages } from './Components/Utility';
  import { showMessage } from 'react-native-flash-message';
  import FastImage from 'react-native-fast-image';
  import Colors from '../../../../constant/Colors';
  import { shadowStyle } from '../../../../constant/Shadow';
  import { Global } from '../../../../constant/Global';
  import { Platform } from 'react-native';



  const Input = ({ onSend, chatId }) => {
    const [text, setText] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [inputHeight, setInputHeight] = useState(35);
    const [numberOfLines, setNumberOfLines] = useState(1);
  
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
  
    const handleContentSizeChange = (event) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      const newNumberOfLines = Math.floor(contentHeight / lineHeight);
      setNumberOfLines(newNumberOfLines);
    };
  
    useEffect(() => {
      if (numberOfLines > 1) {
        setInputHeight((numberOfLines * lineHeight) + extraPadding);
      } else {
        setInputHeight(35); // Default height for single line
      }
    }, [numberOfLines]);


    
    
    
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
      
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { height: Math.max(35, inputHeight) }]}
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            onSubmitEditing={handleTextSend}
            multiline={true}
            onContentSizeChange={handleContentSizeChange}
          />
        </View>

        <TouchableOpacity style={styles.iconButton} onPress={handleImagePick}>
          <FontAwesomeIcon icon="fa-solid fa-paperclip" size={20} color={Colors.primary} />
        </TouchableOpacity>
        {(text.trim().length > 0 || imageUrls.length > 0) && (
          <TouchableOpacity style={styles.sendButton} onPress={handleTextSend}>
            <FontAwesomeIcon icon="fa-solid fa-paper-plane" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}  



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
    );
  };

  const lineHeight = 20; // Adjust based on your font size
  const extraPadding = 50; // Extra padding for the TextInput


  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      flex:1,
      gap: 10,
    },
    inputWrapper: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: 5,
      ...shadowStyle,
      backgroundColor:'transparent',
    },
    input: {
      width: '100%', 
      backgroundColor: Colors.background,  
      borderRadius: 10,
      color: Colors.black,
      borderColor: Colors.primary,
      borderWidth: 1,
      paddingHorizontal: 10,
      fontSize: 16,

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
      backgroundColor: Colors.backgroundSecondary,
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


