import { View, Text,StyleSheet, ScrollView } from 'react-native'
import React ,{useState}from 'react'
import { useTheme } from '../../../../context/ThemeContext';
import firestore from '@react-native-firebase/firestore'
import Fonts from '../../../../constant/Fonts';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import PostCard from '../../../../components/PostCard';
import { FlatList } from 'react-native';
import { useEffect } from 'react';
import { handleSelect } from '../../service/ChatService';
import { useAuth } from '../../../../context/AuthContext';
import { ActivityIndicator } from 'react-native';
import { RefreshControl } from 'react-native';
import AboutText from '../../../../components/AboutText';
import SecondaryProfileCard from '../../../../components/SecondaryProfileCard';
import TwoSelectButton from '../../../../components/Buttons/TwoSelectButton';
import Services from '../../../../components/Services';
import { showMessage } from 'react-native-flash-message';
const ContractorDetail = ({ navigation, route }) => {
    const { id } = route.params;
    const theme = useTheme();
    const styles = getStyles(theme);
    const { currentUser } = useAuth();
    const [contractor, setContractor] = useState(null);
    const [myPosts, setMyPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setIsLoading(true);
        setRefreshing(true);
        try {
            const userDoc = await firestore().collection('users').doc(id).get();
            if (userDoc.exists) {
                setContractor(userDoc.data());
            }

            const postsSnapshot = await firestore().collection('users').doc(id).collection('myPosts').get();
            const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMyPosts(posts);
        } catch (error) {
            console.error('Error fetching contractor details:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const userDoc = await firestore().collection('users').doc(id).get();
            if (userDoc.exists) {
              setContractor(userDoc.data());
            }
            const postsSnapshot = await firestore().collection('users').doc(id).collection('myPosts').get();
            const postIds = postsSnapshot.docs.map(doc => doc.id);
      
            const postsPromises = postIds.map(postId => firestore().collection('posts').doc(postId).get());
            const postsDocs = await Promise.all(postsPromises);
            const posts = postsDocs.map(doc => {
              return doc.exists ? { id: doc.id, ...doc.data() } : null;
            }).filter(post => post !== null); // Filter out any null entries if a doc didn't exist
      
            setMyPosts(posts);
          } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data. Please try again later.');
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchData();
      }, [id]);
      
    
    const renderService = (service) => (
        <View style={styles.serviceContainer} key={`${service.categoryId}-${service.optionId}`}>
          <Text style={styles.categoryTitle}>{service.categoryText}</Text>
          <Text style={styles.optionText}>{service.optionText}</Text>
        </View>
      );

    const handleContact = (currentUser,contractor) => {
        handleSelect(currentUser,contractor);
        navigation.navigate('Chat');
    }
    const handleFeedBack = (uid) => {
        if(currentUser?.uid === uid ){
           if(currentUser?.status === 'contractor'){
                navigation.navigate('Review');
            }else{
                showMessage({
                    message: "User is not a contractor",
                    type: "danger",
                });
            }
        }else{
            if(contractor?.status === 'contractor'){
                navigation.navigate('FeedBack', {Id: uid});
            }else{
                showMessage({
                    message: "User is not a contractor",
                    type: "danger",
                });
            }
        }
    }
    const renderHeader = () => (
        <View style={styles.header}>
            <SecondaryProfileCard profile={contractor} navigation={navigation}/>
            {currentUser?.about && (
            <AboutText text={contractor?.about} userUid={id} />
            )}
            <View style={styles.posts}>
                <Text style={[styles.title,styles.border]}>Offering Services</Text>
                {contractor?.services && contractor.services.length > 0 ? (
                    contractor.services.map(renderService)
                ) : (
                    <Text style={styles.title}>No services found</Text>
                )}
            </View>
            <View style={styles.btnContainer}>
            <TwoSelectButton   
                primary="Contact"
                secondary="Feedback"
                onPressPrimary={()=>handleContact(currentUser,contractor)}
                onPressSecondary={()=>handleFeedBack(contractor.uid)}
            />
            </View>
            {myPosts.length > 0 && <Text style={styles.title}>Posts of {currentUser?.displayName}</Text>}
        </View>
    );
    const renderItem = ({ item }) => {
        return (
            <View style={styles.postWrapper}>
                <PostCard post={item} onPress={() => navigation.navigate('PostDetail', { id: item.id })} />
            </View>
        );
    };
    

  return (
    <View style={styles.container}>
        <FlatList

        data={myPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={() => isLoading && <ActivityIndicator size="large" />}
        style={styles.FlatList}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        />
    </View>
  )
}

const getStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,  
            paddingVertical: 10,  
            paddingHorizontal: 14,
            justifyContent: 'center',
            alignItems: 'center',
        },
        posts: {
            width: '100%',
            marginTop: 16,
            alignItems: 'center',
        },
        serviceContainer: {
            justifyContent: 'space-between',
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: theme.primary,
            paddingVertical: 16,
            paddingLeft: 24,
        },
        myPosts:{
            paddingVertical:10,
            width:'100%',
            flexWrap:'wrap',
            flexDirection:'row',
            paddingBottom: 100,
        },
        postWrapper:{
            width:'50%',
            paddingBottom: 5,


        },
        title: {
            fontFamily: Fonts.primary,
            fontSize: 14,
            fontWeight: 'bold',
            color: theme.text,
            paddingBottom: 16,
        },
        categoryTitle: {
            fontFamily: Fonts.primary,
            fontSize: 14,
            color: theme.text,

        },
        optionText: {
            fontFamily: Fonts.primary,
            fontSize: 14,
            color: theme.text,
        },
        border: {
            borderBottomWidth: 1,
            borderBottomColor: theme.primary,
            width:'100%',
        },
        btnContainer:{
            width:'100%',
            justifyContent:'center',
            alignItems:'center',
            marginVertical: 16,
        },
        FlatList:{
            width:'100%',
            
        },
    })
}

export default ContractorDetail