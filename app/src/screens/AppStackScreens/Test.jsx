import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const Test = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [width, setWidth] = useState(350);
    const [height, setHeight] = useState(500);
    
    const handleImagePicker = async () => {
        try {
            const selectedImagePath = await selectImageFromGallery(width, height);
            setSelectedImage(selectedImagePath);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCameraPicker = async () => {
        try {
            const selectedImagePath = await takePhotoWithCamera(width, height);
            setSelectedImage(selectedImagePath);
        } catch (error) {
            console.log(error);
        }
    };
    
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems:'center' }}>
            {selectedImage && (<Image source={{ uri: selectedImage }} style={{width: width, height: height, marginVertical: 20}} />
          )}
          <View style={{ marginTop: 20 }}>
          <Button title="Choose from Gallery" onPress={handleImagePicker} />
          </View>
          <View style={{ marginTop: 20 }}>
          <Button title="Take a Photo" onPress={handleCameraPicker} />
          </View>
          <View style={{ marginTop: 20,marginBottom: 50 }}>    
          {selectedImage && <Button title="Crop Image" onPress={handleCropImage} />}
          </View>
        </View>
      );
    };

export default Test;
    