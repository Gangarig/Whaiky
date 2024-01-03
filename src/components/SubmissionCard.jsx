import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../constant/Colors';
import {Global} from '../constant/Global';
import Default from '../assets/images/default.png';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const SubmissionCard = ({ id,type, status,date, onPress }) => {

    const convertedDate = date ? date.toDate() : new Date();

    // Format the date as needed (e.g., MM/DD/YYYY)
    const formattedDate = convertedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });


  return (
      <LinearGradient
        colors={['#9E41F0', '#4C7BC0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.submissionCard}>
            <Text style={[Global.titleSecondary, styles.white]}>Date: {formattedDate}</Text>
            <View style={styles.submitInfo}>
                <Text style={[Global.titleSecondary, styles.white]}>ID: {id}</Text>
                <Text style={[Global.titleSecondary, styles.white]}>Type: {type}</Text>
                <Text style={[Global.titleSecondary, styles.white]}>Status: {status}</Text>
            </View>
        </View>
        <TouchableOpacity style={styles.btn} onPress={onPress}>
            <FontAwesomeIcon icon="fa-solid fa-caret-right" size={50} color={Colors.white}/>
        </TouchableOpacity>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
    white: {
        color: Colors.white,
      },
    gradient: {
        width:'100%',
        borderRadius: 10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10,
      },
    submissionCard:{
        flex:1,
        justifyContent:'space-between',
        alignItems:'flex-start',
        padding:10,
    },

 
});

export default SubmissionCard;
