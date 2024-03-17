import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Global } from '../../../constant/Global';
import { useTheme } from '../../../context/ThemeContext';
import { shadowStyle } from '../../../constant/Shadow';
import LinearGradient from 'react-native-linear-gradient';
import SubmissionCard from '../../../components/SubmissionCard';
import { useAuth } from '../../../context/AuthContext';
import TwoSelectButtonGradient from '../../../components/Buttons/TwoSelectButtonGradient';


const DashBoard = ({ navigation }) => {
  const [submissions, setSubmissions] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState(true);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);

  const fetchSubmissions = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
      setLastVisible(null); // Reset pagination on refresh
    } else if (loading || !hasMoreToLoad()) {
      return; // Exit if already loading or no more items to load
    } else {
      setLoading(true);
    }
  
    try {
      let query = firestore().collection('submission').orderBy('timeStamp', 'desc');
  
      if (!refresh && lastVisible) {
        query = query.startAfter(lastVisible);
      }
  
      const querySnapshot = await query.limit(10).get();
  
      if (!querySnapshot.empty) {
        const submissionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  
        if (refresh) {
          setSubmissions(submissionsData);
        } else {
          setSubmissions(prev => [...prev, ...submissionsData]);
        }
        // Check if there are fewer items than requested, indicating end of data
        if (querySnapshot.docs.length < 10) {
          setLoading(false); // No more items to load
        }
      } else {
        setLastVisible(null); // No items in query, end of data
      }
    } catch (error) {
      console.error("Error fetching submissions: ", error);
    } finally {
      if (!refresh) { setLoading(false); }
      setRefreshing(false);
    }
  };

  const hasMoreToLoad = () => {
    return submissions.length % 10 === 0 && lastVisible !== null;
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

  const listHeader = () => {
    return (
      <View style={{marginBottom:16}}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        style={[styles.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.title}>Document Submission</Text>
      </LinearGradient>      
      <TwoSelectButtonGradient
          primary="Inbox"
          secondary="Submissions"
          primaryActive={!active}
          secondaryActive={active}
          onPressPrimary={() => navigation.navigate('Inbox')}
        />
      </View>
    );
  }



  return (
    <View style={[styles.container]}>
      <FlatList
        data={submissions}
        ListHeaderComponent={listHeader}
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
        ListFooterComponent={() => loading && hasMoreToLoad() ? <Text style={styles.loadingText}>Loading more...</Text> : null}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No submissions found</Text>
          </View>
        }
      />
    </View>
  );
};

export default DashBoard;

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 15,
  },
  gradient: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 16,
  },
  title:{ 
    fontSize: 26, 
    color: theme.white, 
    fontWeight: 'bold',
    padding: 10,
    paddingHorizontal: 15,
  },
  loadingText: {
    textAlign: 'center',
    padding: 10,
    color: theme.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: theme.text,
    fontSize: 20,
  },


});
