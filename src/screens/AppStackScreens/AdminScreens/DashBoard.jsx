import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Global } from '../../../constant/Global';
import { useTheme } from '../../../context/ThemeContext';
import { shadowStyle } from '../../../constant/Shadow';
import LinearGradient from 'react-native-linear-gradient';
import SubmissionCard from '../../../components/SubmissionCard';
import { useAuth } from '../../../context/AuthContext';

const DashBoard = ({ navigation }) => {
  const [submissions, setSubmissions] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);

  const fetchSubmissions = async () => {
    if (lastVisible === null && submissions.length > 0) {
      setLoading(false); 
      return;
    }
  
    setLoading(true);
    try {
      const query = firestore()
        .collection('submission')
        .orderBy('timeStamp', 'desc')
        .startAfter(lastVisible || 0)
        .limit(10); 
  
      const querySnapshot = await query.get();
  
      if (!querySnapshot.empty) {
        const submissionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setSubmissions(prevSubmissions => [...prevSubmissions, ...submissionsData]);
      } else {
        // If no documents are returned, we've reached the end of data
        setLastVisible(null);
      }
    } catch (error) {
      console.error("Error fetching submissions: ", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('submission')
      .onSnapshot((snapshot) => {
        const newSubmissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubmissions(newSubmissions);
      });

    return () => unsubscribe(); // Detach listener on unmount
  }, []);

  return (
    <View style={[styles.container]}>
      <View style={{...shadowStyle}}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient,]}
      >
        <Text style={[Global.title, styles.white]}>Dashboard</Text>
        <Text style={[Global.titleSecondary, styles.white]}>Document submissions</Text>
      </LinearGradient>
      </View>
      <FlatList
        data={submissions}
        renderItem={({ item }) => (
          <SubmissionCard
            date={item.timeStamp}
            id={item.userId}
            type={item.type}
            status={item.status}
            onPress={() => navigation.navigate('SubmitDetail', { id: item.userId })}
          />
        )}
        keyExtractor={(item, index) => 'submission-' + index}
        onEndReached={fetchSubmissions}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loading ? <Text>Loading more...</Text> : null}
      />
    </View>
  );
};

export default DashBoard;

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 10,
  },
  gradient: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  white: {
    color: theme.white,
  },
});
