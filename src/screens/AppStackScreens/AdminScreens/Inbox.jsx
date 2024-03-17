import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../../../context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import TwoSelectButtonGradient from '../../../components/Buttons/TwoSelectButtonGradient';
import { useAuth } from '../../context/AuthContext';
import MessageCard from '../../../components/MessageCard';

const Inbox = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const styles = getStyles(theme);


  const fetchSupportMessages = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
      setLastVisible(null);
    } else if (loading || !hasMoreToLoad()) {
      return;
    } else {
      setLoading(true);
    }

    try {
      let query = firestore().collection('support').orderBy('timestamp', 'desc');

      if (!refresh && lastVisible) {
        query = query.startAfter(lastVisible);
      }

      const querySnapshot = await query.limit(10).get();

      if (!querySnapshot.empty) {
        const newMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        if (refresh) {
          setMessages(newMessages);
        } else {
          setMessages(prev => [...prev, ...newMessages]);
        }

        if (querySnapshot.docs.length < 10) {
          setLoading(false);
        }
      } else {
        setLastVisible(null);
      }
    } catch (error) {
      console.error("Error fetching support messages: ", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const hasMoreToLoad = () => messages.length % 10 === 0 && lastVisible !== null;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('support')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(newMessages);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: 16 }}>
            <LinearGradient
              colors={[theme.primary, theme.secondary]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.title}>Support Inbox</Text>
            </LinearGradient>
            <TwoSelectButtonGradient
              primary="Inbox"
              secondary="Submissions"
              primaryActive={true}
              onPressPrimary={() => {}}
              onPressSecondary={() => navigation.navigate('Dashboard')}
            />
          </View>
        )}
        renderItem={({ item }) => <MessageCard item={item} />}
        keyExtractor={(item, index) => item.id || index.toString()}
        onEndReached={() => fetchSupportMessages()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loading ? <Text style={styles.loadingText}>Loading more...</Text> : null}
      />
    </View>
  );
};

export default Inbox;


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
  }


});
