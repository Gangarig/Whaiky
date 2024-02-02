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
const Feedback = ({navigation,route}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { currentUser } = useAuth();
  const { contractor } = route.params;
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [summary, setSummary] = useState('');

  const getSummary = (feedbacks) => {
    const total = feedbacks.length;
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    const avg = sum / total;
    setSummary(`Rating: ${avg.toFixed(1)} (${total} reviews)`);
  }



  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbacksRef = firestore()
        .collection('users')
        .doc(contractor.uid)
        .collection('feedbacks')
        .orderBy('timestamp', 'desc');
        const snapshot = await feedbacksRef.get();
        const feedbacks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeedbacks(feedbacks);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        showMessage({
          message: "Failed to fetch feedbacks",
          type: "danger",
        });
      }
    };
    fetchData();
    getSummary(feedbacks);
    
  }, [contractor.uid]);


  const handleSubmit = async (currentUser) => {
    if(!rating){
      showMessage({
        message: "Please rate the contractor",
        type: "danger",
      });
      return;
    }
    if(!comment){
      showMessage({
        message: "Please write a feedback",
        type: "danger",
      });
      return;
    }
    try {
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
      showMessage({
        message: "Feedback submitted",
        type: "success",
      });
      // navigation.goBack();
    } catch (error) {
      console.error('Error adding feedback:', error);
      showMessage({
        message: "Failed to submit feedback",
        type: "danger",
      });
    }
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ContractorCard props={contractor} onPress={()=>{}}/>
        <Text style={{...Fonts.title,marginVertical:10}}>{summary}</Text>
      </View>
      <View style={styles.feedBackInput}>
        <TextInput
          style={styles.input}
          placeholder="Write your feedback"
          multiline
          numberOfLines={4}
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
          renderItem={({ item }) => (
            <View style={styles.feedBack}>
              <Text style={styles.feedBackText}>{item.comment}</Text>
              <Rating
                type='star'
                ratingCount={5}
                imageSize={10}
                startingValue={item.rating}
                readonly
              />
            </View>
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
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
      marginTop:20,
      ...shadowStyle,
      paddingHorizontal:20,
    } ,
    input:{
      width:'100%', 
      backgroundColor:theme.backgroundColor,
      borderWidth:1,
      borderColor:theme.primary,
      borderRadius:5,
      height:150,
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
    } 
  });
}

export default Feedback