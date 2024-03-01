import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useTheme } from '../context/ThemeContext';
import Fonts from '../constant/Fonts';

const SubmissionCard = ({ id,type, status,date, onPress }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

    const convertedDate = date ? date.toDate() : new Date();

    // Format the date as needed (e.g., MM/DD/YYYY)
    const formattedDate = convertedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });


  return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
              <View style={styles.info}>
                <Text style={styles.label}>Date: </Text>
                <Text style={styles.label}>ID:</Text>
                <Text style={styles.label}>Type:</Text>
                <Text style={styles.label}>Status:</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.value}>{formattedDate}</Text>
                <Text style={styles.value}>{id}</Text>
                <Text style={styles.value}>{type}</Text>
                <Text style={styles.value}>{status}</Text>
              </View>
          <TouchableOpacity style={styles.btn} onPress={onPress}>
            <FontAwesomeIcon icon="fa-solid fa-ellipsis-vertical" size={24} color={theme.primary}/>
          </TouchableOpacity>
        </TouchableOpacity>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
    card :{
      backgroundColor: theme.backgroundColor,
      borderWidth: 1,
      borderRadius: 12,
      marginBottom: 16,
      borderColor: theme.primary,
      padding: 10,
      paddingHorizontal: 20,
      height: 120,
      overflow: 'hidden',
      flexDirection: 'row',
    },
    label : {
      color: theme.text,
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: Fonts.primary,
      marginBottom: 7,
    },
    value : {
      color: theme.text,
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: Fonts.primary,
      paddingLeft: 20,
      marginBottom: 7,
    },
    btn : {
      position: 'absolute',
      right: 10,
      top: 10,
    },
});
}

export default SubmissionCard;
