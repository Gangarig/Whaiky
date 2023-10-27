import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../src/context/AuthContext'
import ImageCropPicker from 'react-native-image-crop-picker'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { useState } from 'react'
import { Button } from 'react-native'
import storage from '@react-native-firebase/storage'
import { Global } from '../style/Global'
import { showMessage } from 'react-native-flash-message'
const DocumentUpload = ({navigation}) => {
    const { currentUser } = useAuth()
    const [image, setImage] = useState(null)
    const [uploading, setUploading] = useState(false)

    const handleChoosePhoto = () => {
        ImageCropPicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            console.log(image)
            setImage(image)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleUploadPhoto = async () => {
        if (image) {
            const uploadUri = image.path
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)
            setUploading(true)
            const task = storage()
                .ref(filename)
                .putFile(uploadUri)
            try {
                await task
                setUploading(false)
                Alert.alert(
                    'Photo uploaded!',
                    'Your photo has been uploaded to Firebase Cloud Storage!'
                )
            } catch (e) {
                console.log(e)
            }
        }
    }
    
  return (
    <SafeAreaView>
    <ScrollView style={styles.container}>
      <Text style={Global.title}>DocumentUpload</Text>
        <Text> ID card number</Text>
        <TextInput placeholder="Enter ID card number" />
        <Text> Upload ID</Text>
        <Button title="Upload ID" onPress={handleUploadPhoto} />
        <Text> Home Address</Text>
        <TextInput placeholder="Enter Home Address" />
        <Button title="Save and Continue" onPress={handleUploadPhoto} />
        <Button title="Go Back" onPress={() => navigation.goBack()} />
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

})

export default DocumentUpload