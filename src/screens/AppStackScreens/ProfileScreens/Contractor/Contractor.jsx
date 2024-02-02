import {
  View, Text, TouchableOpacity, Button,
  RefreshControl, SafeAreaView, FlatList, StyleSheet,ActivityIndicator
} from 'react-native';
import React, { useState, useEffect ,useRef} from 'react';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import ContractorCard from '../../../../components/ContractorCard';





const Contractor = ({navigation}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [contractorData, setContractorData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastFetchedContractor = useRef(null);

  useEffect(() => {
    fetchContractor();
  }
    , []);

    const fetchContractor = async () => {
      try {
        setRefreshing(true);
        const contractorRef = firestore().collection('contractor');
        const snapshot = await contractorRef.limit(30).get();
        const userData = await Promise.all(snapshot.docs.map(async doc => {
          const contractor = doc.data();
          const userSnapshot = await firestore().collection('users').doc(contractor.userId).get();
          return userSnapshot.exists ? userSnapshot.data() : null;
        }));
    
        setContractorData(userData.filter(user => user !== null)); 
        lastFetchedContractor.current = snapshot.docs[snapshot.docs.length - 1];
        setRefreshing(false);
      } catch (error) {
        console.error("Error fetching contractors:", error);
        setRefreshing(false);
      }
    };
    const navigateToContractorProfile = (uid) => {
      navigation.navigate('ContractorDetail', { id: uid});
    }
    const renderItem = ({ item }) => {
      return (
        <ContractorCard props={item} onPress={()=>navigateToContractorProfile(item.uid)}/>
      );
    };
    
    
  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: '100%' }}
        data={contractorData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        onEndReachedThreshold={0.5}
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
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
  });
}

export default Contractor;
