import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faIdBadge, faFile, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

const SecondaryDocumentCard = ({ item,navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero indexed
    let year = date.getFullYear();
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };
  const timeStampDate = item.timeStamp ? new Date(item.timeStamp._seconds * 1000) : null;
  const formattedDateTime = formatDateTime(timeStampDate);

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <TouchableOpacity onPress={()=>navigation.navigate('LegalInfo')} style={styles.container}>
      {item ? (
        <View style={styles.cardWrapper}>
          {item?.typeOfDoc === 'document' ? (
            <View style={styles.cardIcon}>
              <FontAwesomeIcon size={40} color={theme.primary} icon={faIdBadge} />
            </View>
          ) : (
            <View style={styles.cardIcon}>
              <FontAwesomeIcon size={40} color={theme.primary} icon={faFile} />
            </View>
          )}
          <View style={styles.cardInfo}>
            <Text style={[styles.cardText,{fontWeight:'bold'}]}>
              {capitalizeFirstLetter(item?.typeOfDoc)}: {item?.type} 
            </Text>
            <Text style={styles.cardText}>{formattedDateTime}</Text>
          </View>
          <TouchableOpacity style={styles.cardMenuWrapper} onPress={() => console.log('Menu Pressed')}>
            <FontAwesomeIcon size={30} color={theme.primary} icon={faEllipsisVertical} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.Error}>
          <Text style={styles.errorText}>No Document Available</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
      borderRadius: 12,
      marginVertical: 6,
      overflow: 'hidden',
    },
    cardWrapper: {
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 12,
      height: 60,
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 5,
    },
    Error: {
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 12,
      height: 60,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: theme.text,
      fontWeight: 'bold',
      fontSize: 16,
    },
    cardText: {
      color: theme.text,
      fontSize: 14,
      paddingLeft: 10,
    },
    cardMenuWrapper : {
      position: 'absolute',
      right: 5,
    },
  })
}

export default SecondaryDocumentCard