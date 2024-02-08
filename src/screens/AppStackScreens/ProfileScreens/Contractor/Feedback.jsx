import { View, Text,StyleSheet,TextInput} from 'react-native'
import React , { useState , useEffect } from 'react'
import { useTheme } from '../../../../context/ThemeContext'
import { Rating, AirbnbRating } from 'react-native-ratings';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import { shadowStyle } from '../../../../constant/Shadow';
import Fonts from '../../../../constant/Fonts';
import { useAuth } from '../../../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import ContractorCard from '../../../../components/ContractorCard';
import { FlatList } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { ActivityIndicator } from 'react-native';



const Feedback = ({navigation,route}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { currentUser } = useAuth();
  const { contractor } = route.params;
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
        .doc(contractor.uid)
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

  useEffect(() => {
    fetchAndSetFeedbacks();
  }, [contractor.uid]); 

  const handleLoadMore = () => {
    console.log("Loading more feedbacks...");
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

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ContractorCard props={contractor} onPress={()=>{}}/>
      </View>
      <View style={styles.feedBackInput}>
        <TextInput
          style={[styles.input]}
          placeholder="Write your feedback"
          multiline
          numberOfLines={2}
          value={comment}
          onChangeText={setComment}
        />
        <View style={styles.rating}>
        <AirbnbRating
          count={5}
          defaultRating={3}
          size={17}
          showRating={false}
          onFinishRating={setRating}
        />
        <PrimaryButton text="SUBMIT" onPress={()=>handleSubmit(currentUser)}/>
        </View>
      </View>
      <View style={styles.feedBacks}>
        <FlatList
          data={feedbacks}
          style={styles.flatList}
          renderItem={({ item }) => (
            <View style={styles.feedBack}>
              <Text style={styles.feedBackText}>{item.comment}</Text>
              <Rating
                type='star'
                ratingCount={5}
                imageSize={12}
                startingValue={item.rating}
                readonly
              />
            </View>
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5} // How far from the end to trigger the load more
          ListFooterComponent={() => loading && hasMore ? <ActivityIndicator size="large" /> : null}
        />
      </View>
    </View>
  )
}

const getStyles = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.white,
      alignItems: 'center',
    },
    feedBackInput:{
      width:'100%',
      alignItems:'flex-end',
      justifyContent:'center',
      paddingHorizontal:20,
      borderBottomColor:theme.primary,
      borderBottomWidth:1,
      paddingBottom:10,
    } ,
    input:{
      width:'100%', 
      backgroundColor:theme.backgroundColor,
      borderWidth:1,
      borderColor:theme.primary,
      borderRadius:5,
      height:50,
      padding:10,
      marginBottom:20,
    },
    rating:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      width:'100%',
    },
    header: {
      width : '100%',
      padding: 10,
    },
    feedBacks: {
      flex: 1,
      width: '100%',
    },
    flatList: {
      flex: 1,
      paddingHorizontal: 10,
    },
    feedBack: {
      width: '100%',
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.primary,
      alignItems: 'center',
    },
    feedBackText: {
      fontFamily: Fonts.primary,
      fontSize: 15,
      fontWeight: "400",
      fontStyle: "normal",
      color: theme.text,
      marginBottom: 5,
      width: '80%',
    },
  });
}

export default Feedback