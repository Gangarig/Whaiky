import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Colors from '../constant/Colors';
import { shadowStyle } from '../constant/Shadow';
import PrimaryButton from './Buttons/PrimaryButton';
import { useTheme } from '../context/ThemeContext';

const DocumentCard = ({ item ,onApprove , onDeny}) => {
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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#9E41F0', '#4C7BC0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {item.type ? (
          // Render documents
          <>
            <Text style={styles.title}>Document Type: {item.type}</Text>
            <Text style={styles.info}>Document Number: {item.number}</Text>
            <Text style={styles.info}>Full Name: {item.fullName}</Text>
            <Text style={styles.info}>Country of Issue: {item.country}</Text>
            <Text style={styles.info}>Date of Issue: {item.dateOfIssue}</Text>
            <Text style={styles.info}>Date of Expiry: {item.dateOfExpiry}</Text>
            <Text style={styles.info}>Document Status: {item.status}</Text>
            {/* Display images as needed */}
            {item.frontImage && (
              <FastImage source={{ uri: item.frontImage }} style={styles.image} />
            )}
            {item.backImage && (
              <FastImage source={{ uri: item.backImage }} style={styles.image} />
            )}
          </>
        ) : (
          // Render certificates
          <>
            <Text style={styles.title}>Certificate Title: {item.title}</Text>
            <Text style={styles.info}>Description: {item.description}</Text>
            {/* Display certificate images as needed */}
            {item.imageUrl && (
              <FastImage source={{ uri: item.imageUrl }} style={styles.image} />
            )}
          </>
        )}
      </LinearGradient>
      {item.status === 'pending' && (
      <View style={styles.btnContainer}>
      <PrimaryButton text="Approve" onPress={() => onApprove(item.docId)} />
      <PrimaryButton text="Deny" onPress={() => onDeny(item.docId)} />
      </View>
      )}
    </View>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
  container: {
    marginVertical: 20,
    borderRadius: 8,
    overflow: 'hidden',
    ...shadowStyle,
  },
  gradient: {
    backgroundColor: theme.background,
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.white,
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: theme.white,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.white,
    ...shadowStyle,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
}
export default DocumentCard;
