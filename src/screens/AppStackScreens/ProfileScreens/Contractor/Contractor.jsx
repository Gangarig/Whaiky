import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Contractor = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const snapshot = await firestore().collection('contractor').get();
        const fetchedContractors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContractors(fetchedContractors);
  
        // Fetching user data for each contractor
        fetchedContractors.forEach(async (contractor) => {
          const userSnapshot = await firestore().collection('users').doc(contractor.userId).get();
          const userData = userSnapshot.data();
          console.log(`User Data for contractor ${contractor.id}:`, userData); // Console log user data
        });
      } catch (error) {
        console.error("Error fetching contractors:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchContractors();
  }, []);

  console.log("Contractors:", contractors); // Console log contractors
  

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={contractors}
        renderItem={({ item }) => (
          <Text>{item.name}</Text> // Replace with your custom component
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      /> */}
    </View>
  );
};

export default Contractor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
