import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { showMessage } from 'react-native-flash-message'
import firestore from '@react-native-firebase/firestore'
import { useAuth } from '../../../context/AuthContext'
import { Global } from '../../../constant/Global'
import Colors from '../../../constant/Colors'
import { shadowStyle } from '../../../constant/Shadow'
import LinearGradient from 'react-native-linear-gradient'
import PrimaryButton from '../../../components/Buttons/PrimaryButton'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import SubmissionCard from '../../../components/SubmissionCard'

const DashBoard = ({ navigation }) => {
  const { currentUser } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [lastVisible, setLastVisible] = useState(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)


    // Function to fetch submissions
    const fetchSubmissions = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('submission')
          .get();
        
        const submissionsData = querySnapshot.docs.map(doc => doc.data());
        setSubmissions(submissionsData);
  
        console.log('Submissions:', submissionsData); // Logging the submissions
      } catch (error) {
        console.error("Error fetching submissions: ", error);
        showMessage({
          message: "Error fetching submissions",
          type: "danger",
        });
      }
    };
  
    // useEffect to call fetchSubmissions on component mount
    useEffect(() => {
      fetchSubmissions();
    }, []);
  


  const navigateToSubmissionDetails = (id) => {
    navigation.navigate('SubmitDetail', { id });
  }

  return (
    <View style={styles.container}>
      <View style={[styles.LinearGradientWrapper, shadowStyle]}>
        <LinearGradient
          colors={['#9E41F0', '#4C7BC0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={[Global.title, styles.white]}>Dashboard</Text>
            <Text style={[Global.titleSecondary, styles.white]}>Document submissions</Text>
          </View>
        </LinearGradient>
        {submissions.length > 0 ? (
                  <FlatList
                    data={submissions}
                    renderItem={
                      ({ item }) => (
                        <SubmissionCard
                          date={item.timeStamp}
                          id={item.userId}
                          type={item.type}
                          status={item.status}
                          onPress={() => navigation.navigate('SubmitDetail', { id: item.userId })}
                        />
                      )
                    }
                    keyExtractor={(item, index) => 'submission-' + index}
                  />
        ) : (
          <LinearGradient
          colors={['#9E41F0', '#4C7BC0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
         >
          <Text style={[Global.titleSecondary, styles.white]}>No submissions found.</Text>
          </LinearGradient>
        )}


      </View>
    </View>
  );
}

export default DashBoard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 10,
  },
  LinearGradientWrapper: {
    borderRadius: 10,
    gap: 10,
  },
  gradient: {
    borderRadius: 10,
    padding: 10,
  },
  submissionWrapper: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  content: {
    width: '100%',
    padding: 10,
  },
  white: {
    color: Colors.white,
  },
});
