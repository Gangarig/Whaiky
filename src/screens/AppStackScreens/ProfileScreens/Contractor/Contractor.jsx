import {
  View, Text, TouchableOpacity, Button,
  RefreshControl, SafeAreaView, FlatList, StyleSheet,ActivityIndicator
} from 'react-native';
import React, { useState, useEffect ,useRef} from 'react';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../../../../context/ThemeContext';
import ContractorCard from '../../../../components/ContractorCard';
import { useAuth } from '../../../../context/AuthContext';





const Contractor = ({navigation}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [contractorData, setContractorData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastFetchedContractor = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchContractor();
  }
    , []);

    const fetchContractor = async (loadMore = false) => {
      if (loadMore && !hasMore) return; 
    
      try {
        setLoadingMore(loadMore); 
        setRefreshing(!loadMore); 
    
        let query = firestore().collection('contractor').orderBy('userId').limit(20);
        if (loadMore && lastFetchedContractor.current) {
          query = query.startAfter(lastFetchedContractor.current);
        }
    
        const snapshot = await query.get();
        const userData = await Promise.all(
          snapshot.docs.map(async doc => {
            const contractor = doc.data();
            const userSnapshot = await firestore().collection('users').doc(contractor.userId).get();
            return userSnapshot.exists ? { ...userSnapshot.data(), id: userSnapshot.id } : null;
          })
        );
    
        if (loadMore) {
          setContractorData(prev => [...prev, ...userData.filter(user => user !== null)]);
        } else {
          setContractorData(userData.filter(user => user !== null));
        }
    
        lastFetchedContractor.current = snapshot.docs[snapshot.docs.length - 1];
        setHasMore(snapshot.docs.length > 0);
        setLoadingMore(false);
        setRefreshing(false);
      } catch (error) {
        console.error("Error fetching contractors:", error);
        setLoadingMore(false);
        setRefreshing(false);
      }
    };
    
    
    const navigateToContractorProfile = (uid) => {
      navigation.navigate('ContractorDetail', { id: uid});
    }

    const renderItem = ({ item }) => {
      return (
        <ContractorCard navigation={navigation} selectedUser={item} currentUser={currentUser} onPress={()=>navigateToContractorProfile(item.uid)}/>
      );
    };
    
    
  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: '100%' }}
        data={contractorData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        onEndReached={() => fetchContractor(true)}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchContractor()}
          />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
  });
}

export default Contractor;
