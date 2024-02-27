import { View, Text ,ScrollView,StyleSheet ,TouchableOpacity} from 'react-native'
import React , { useState } from 'react'
import { useTheme } from '../../../../context/ThemeContext'
import FastImage from 'react-native-fast-image'
import Fonts from '../../../../constant/Fonts'
import ImageView from "react-native-image-viewing";
const LegalInfo = ({route}) => {
  const { document } = route.params;
  const theme = useTheme()
  const styles = getStyles(theme)
  const [visible, setIsVisible] = useState(false);
  const images = [
    ...(document?.frontImage ? [{ uri: document.frontImage }] : []),
    ...(document?.backImage ? [{ uri: document.backImage }] : []),
  ];
  

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";

   
    const date = new Date(timestamp.seconds * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; 
  };

  // Use the modified function to format dates
  const dateOfIssueFormatted = formatDateTime(document?.dateOfIssue);
  const dateOfExpiryFormatted = formatDateTime(document?.dateOfExpiry);



  console.log(document)
  return (
    <ScrollView 
    styles={styles.container}
    showsHorizontalScrollIndicator  = {false}
    showsVerticalScrollIndicator = {false}
    contentContainerStyle={styles.ScrollView}
    >
      <Text style={styles.title}>
        {document?.type || 'N/A'}
      </Text>
      {document?.frontImage && (
        <TouchableOpacity
          style={styles.wrapper}
          onPress={() => setIsVisible(true)}>
            <FastImage source={{ uri: document?.frontImage }} style={styles.image} />
        </TouchableOpacity>
      )}
      {document?.backImage && (
        <TouchableOpacity
          style={styles.wrapper}
          onPress={() => setIsVisible(true)}>
            <FastImage source={{ uri: document?.backImage }} style={styles.image} />
        </TouchableOpacity>
      )}
      <View style={styles.info}>
        <Text style={styles.label}>
          Document Number
        </Text>
        <Text style={styles.value}>
          {document?.number || 'N/A'}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>
          Full Name
        </Text>
        <Text style={styles.value}>
          {document?.fullName || 'N/A'}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>
          Country of Issue
        </Text>
        <Text style={styles.value}>
          {document?.country || 'N/A'}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>
          Date of Issue
        </Text>
        <Text style={styles.value}>
          {dateOfIssueFormatted}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>
          Date of Expiry
        </Text>
        <Text style={styles.value}>
          {dateOfExpiryFormatted}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>
          Status
        </Text>
        <Text style={styles.value}>
          {document?.status || 'N/A'}
        </Text>
      </View>

      <ImageView
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </ScrollView>
  )
}

export default LegalInfo

const getStyles = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    ScrollView: {
      alignItems: 'center',
      width: '100%',
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
      fontFamily: Fonts.primary,
      textAlign: 'left',
      width: '100%',
    },
    info: {
      width: '100%',
    },
    label: {
      marginTop: 16,
      fontSize: 14,
      color: theme.text,
      fontFamily: Fonts.primary,
      marginBottom: 6,
    },
    value: {
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 20,
      color: theme.text,
      fontFamily: Fonts.primary,
      fontSize: 14,
      width: '100%',
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primary,
      overflow: 'hidden',
    },
    wrapper: {
      width: '100%',
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      marginTop: 16,
      overflow: 'hidden',
    },
  })
}
