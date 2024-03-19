import { View, Text,StyleSheet,TextInput} from 'react-native'
import React , { useState , useEffect } from 'react'
import { useTheme } from '../../../../context/ThemeContext'
import { Rating, AirbnbRating } from 'react-native-ratings';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import Fonts from '../../../../constant/Fonts';
import { useAuth } from '../../../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import ContractorCard from '../../../../components/ContractorCard';
import { FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native';



const Feedback = ({route,navigation}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { currentUser } = useAuth();
  const { Id } = route.params;
  const [contractor, setContractor] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [summary, setSummary] = useState('');
  const [lastVisible, setLastVisible] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true); 



  const fetchAndSetFeedbacks = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      let query = firestore()
        .collection('users')
      .doc(Id)
        .collection('feedbacks')
        .orderBy('timestamp', 'desc')
        .limit(10); // Fetch in batches of 10
      if (lastVisible) {
        query = query.startAfter(lastVisible);
      }
      const snapshot = await query.get();
      if (!snapshot.empty) {
        const newFeedbacks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeedbacks(prevFeedbacks => [...prevFeedbacks, ...newFeedbacks]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length >= 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      showMessage({
        message: "Failed to fetch feedbacks",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContractor = async () => {
    try {
      const contractorDoc = await firestore().collection('users').doc(Id).get();
      if (contractorDoc.exists) {
        setContractor(contractorDoc.data());
      }
    } catch (error) {
      console.error('Error fetching contractor:', error);
      showMessage({
        message: "Failed to fetch contractor",
        type: "danger",
      });
    }
  };


  useEffect(() => {
    fetchContractor();
    fetchAndSetFeedbacks();
  }, []);
    
  const handleLoadMore = () => {
  
    if (!loading) {
      fetchAndSetFeedbacks();
    }
  };

  const calculateSummary = (feedbacks) => {
    const total = feedbacks.length;
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    const avg = total > 0 ? sum / total : 0; 
    setSummary(`Rating: ${avg.toFixed(1)} (${total} reviews)`);
  };


  const reset = () => {
    setComment('');
    setRating(null);
  };

  const handleSubmit = async () => {
    if (!rating) {
      showMessage({
        message: "Please rate the contractor",
        type: "danger",
      });
      return;
    }
    if (!comment) {
      showMessage({
        message: "Please write a feedback",
        type: "danger",
      });
      return;
    }
    try {
      // Add the individual feedback
      await firestore()
        .collection('users')
        .doc(contractor.uid)
        .collection('feedbacks')
        .add({
          contractorId: contractor.uid,
          userId: currentUser.uid,
          rating: rating,
          comment: comment,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
  
      // Fetch the contractor's current aggregate rating data
      const contractorRef = firestore().collection('users').doc(contractor.uid);
      const contractorDoc = await contractorRef.get();
  
      let newRatingCount = 1;
      let newRatingSum = rating;

      if (contractorDoc.exists) {
        const data = contractorDoc.data();
        newRatingCount = (data.ratingCount || 0) + 1;
        newRatingSum = (data.ratingSum || 0) + rating;
      }

      // Update the contractor's document with new sum and count
      await contractorRef.update({
        ratingCount: newRatingCount,
        ratingSum: newRatingSum,
        averageRating: newRatingSum / newRatingCount,
      });
  
      showMessage({
        message: "Feedback submitted successfully",
        type: "success",
      });
      await fetchAndSetFeedbacks();
      reset();
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showMessage({
        message: "Failed to submit feedback",
        type: "danger",
      });
    }
};
  const handeNavigateToContractorDetail = (id) => {
    navigation.navigate('ContractorDetail',{id:id})
  }
  return (
    <View style={styles.container}>
        <FlatList
          data={feedbacks}
          style={styles.flatList}
          ListHeaderComponent={
                              <View style={styles.header}>
                              <ContractorCard 
                              selectedUser={contractor}
                              currentUser={currentUser}
                              navigation={navigation}
                              onPress={()=>handeNavigateToContractorDetail(contractor.uid)}
                              />
                            {currentUser?.uid === Id ? ( null) : (
                            <View style={styles.feedBackInput}>
                              <View style={styles.label}>
                                  <Text style={styles.feedBackText}>Review</Text> 
                              </View>
                                <TextInput
                                  style={[styles.input]}
                                  placeholder="Write your feedback"
                                  placeholderTextColor={theme.gray}
                                  multiline
                                  numberOfLines={10}
                                  value={comment}
                                  onChangeText={setComment}
                                  maxLength={200}
                                />
                              <View style={styles.rating}>
                                <View style={styles.ratingWrapper}>
                                <AirbnbRating
                                  count={5}
                                  defaultRating={3}
                                  size={20}
                                  showRating={false}
                                  onFinishRating={setRating}
                                />
                                </View>
                                <PrimaryButton text="SUBMIT" onPress={()=>handleSubmit(contractor)}/>
                              </View>
                            </View>
                            )}
                            <View style={styles.listLable}>
                              <Text style={styles.feedBackText}>Reviews</Text>
                            </View>
                          </View>
                            }
          renderItem={({ item }) => (
            <View style={styles.feedBack}>
              <Text style={styles.feedBackComment}
              >{item.comment}
              </Text>
                <View style={styles.listRatingWrapper}>
                  <Rating
                    type='star'
                    ratingCount={5}
                    imageSize={15}
                    startingValue={item.rating}
                    readonly
                    style={styles.ratingStar}
                  />
                </View> 
            </View>
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchAndSetFeedbacks}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5} 
          ListFooterComponent={() => loading && hasMore ? <ActivityIndicator size="large" /> : null}
        />
    </View>
  )
}

const getStyles = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
      paddingHorizontal: 14,
      paddingTop: 10,
    },
    flatList: {
      width: '100%',
    },
    feedBackInput: {
      width: '100%',
    },
    label: {
      marginTop: 18,
      marginBottom: 6,
    },
    feedBackText: {
      fontFamily: Fonts.primary,
      fontSize: 14,
      color: theme.text,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.primary,
      height: 124,
      borderRadius: 12,
      textAlignVertical: 'top',
      paddingVertical: 5,
      paddingHorizontal: 18,
      fontFamily: Fonts.primary,
      fontSize: 14,
      color: theme.text,
    },
    rating: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    ratingWrapper: {
      paddingLeft: 20,
    },
    feedbacks: {
      marginTop: 20,
      flex: 1,
    },
    listLable: {
      width: '100%',
      borderBottomColor: theme.primary,
      borderBottomWidth: 1,
      paddingVertical: 8,
    },
    feedBack: {
      width: '100%',
      borderBottomColor: theme.primary,
      borderBottomWidth: 1,
      paddingVertical: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    feedBackComment: {
      width: '70%',
      color: theme.text,
    },

  });
}

export default Feedback