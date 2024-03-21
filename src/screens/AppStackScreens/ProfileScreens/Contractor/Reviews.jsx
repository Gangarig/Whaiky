import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { AirbnbRating } from 'react-native-ratings';
import { useTheme } from '../../../../context/ThemeContext';

const Reviews = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const snapshot = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('feedbacks')
          .orderBy('timestamp', 'desc')
          .get();
        const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        showMessage({
            message: "Failed to fetch reviews",
            type: "danger",
          });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchReviews();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.reviewText}>No reviews available.</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
        <Text style={styles.title}>Reviews ({currentUser.ratingCount})</Text>
        <View style={styles.ratingContainer}>
            <Text style={styles.reviewText}>Average Rating: </Text>
            <View style={styles.rating}>
                <AirbnbRating
                count={5}
                defaultRating={currentUser.averageRating}
                size={20}
                showRating={false}
                isDisabled={true}
                />
            </View>
        </View>
    </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>{item.comment}</Text>
            <AirbnbRating  
                count={5}
                defaultRating={item.rating}
                size={15}
                showRating={false}
                isDisabled={true}
            />
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.reviewsList}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewsList: {
    paddingBottom: 20,
  },
  reviewCard: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.primary, 
    paddingBottom: 10,
  },
  reviewText: {
    marginBottom: 10,
    fontSize: 16,
    color: theme.text,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.text
  },
    header: {
        marginBottom: 20,
    },
    ratingContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rating: {
        
    },


});

export default Reviews;
