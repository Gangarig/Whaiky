import { View, Text,StyleSheet, ScrollView } from 'react-native'
import React ,{useState}from 'react'
import { useTheme } from '../../../../context/ThemeContext';
import firestore from '@react-native-firebase/firestore'
import FastImage from 'react-native-fast-image'
import Cover from '../../../../assets/images/image1.png'
import ImageView from 'react-native-image-viewing'
import UserAvatar from 'react-native-user-avatar'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import LinearGradient from 'react-native-linear-gradient';
import { shadowStyle } from '../../../../constant/Shadow';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Fonts from '../../../../constant/Fonts';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import PostCard from '../../../../components/PostCard';
import { FlatList } from 'react-native';
import { useEffect } from 'react';
import { handleSelect } from '../../service/ChatService';
import { useAuth } from '../../../../context/AuthContext';
import { ActivityIndicator } from 'react-native';
import { RefreshControl } from 'react-native';
import PostCardSecondary from '../../../../components/PostCardSecondary';


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
          <Text style={styles.serviceText}>      {service.categoryText}</Text>
          <Text style={styles.optionText}>       {service.optionText}</Text>
        </View>
      );

    const handleContact = (currentUser,contractor) => {
        handleSelect(currentUser,contractor);
        navigation.navigate('Chat');
    }
    const handleFeedBack = (contractor) => {
        navigation.navigate('FeedBack',{contractor});
    }
    const renderHeader = () => (
        <View style={styles.header}>
        <View style={styles.cover}>
        <FastImage
            style={styles.coverImage}
            source={Cover}
            resizeMode={FastImage.resizeMode.cover}
        />
        </View>
        <LinearGradient 
        colors={[theme.primary,theme.secondary ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} 
        style={styles.gradient}
        >
        <View style={[shadowStyle]}>
        {contractor?.photoURL ? (
        <FastImage
            source={{ uri: contractor.photoURL }}
            style={styles.avatar}
            resizeMode="cover"
            onError={(e) => {
                console.log("Image loading error:", e);
            }}
        />
        ) : (
            <View style={styles.avatar}>
                <FontAwesomeIcon icon={faUser} size={55} color={theme.white} />
            </View>
        )}
        </View>
        <View style={styles.profileHeader}>
        <Text style={[styles.headerText, {fontSize: 20}]}>
        {
            (contractor?.firstName || contractor?.lastName) ? `${contractor?.firstName || ''} ${contractor?.lastName || ''}`.trim() : 'No Name Currently'
        }
        </Text>

        {contractor?.averageRating ? (
            <View style={styles.rating}>
                <AirbnbRating
                    count={5}
                    defaultRating={contractor?.averageRating || 0}
                    size={15}
                    showRating={false}
                    isDisabled={true}
                />
                <Text style={styles.headerText}>
                {contractor?.ratingCount || 0} Reviews
                </Text>
            </View>
            ) : (
            <Text style={styles.headerText}>No Rating Currently</Text>
            )}
        {contractor?.services && contractor.services.length > 0 ? (
        <Text style={styles.headerText}>
            {contractor.services[0].categoryText || 'No Category'}
        </Text>
        ) : (
        <Text style={styles.headerText}>No Category</Text>
        )}
        </View>
        </LinearGradient>
        <View style={styles.aboutMe}>
            <Text style={styles.aboutMeTitle}>
            {contractor?.aboutMe || "About Me Not Provided"}
            </Text>
            <Text style={styles.aboutMeText}>
            {contractor?.aboutMeText || "About Me Text Not Provided"}
            </Text>
        </View>
        <View style={styles.posts}>
        <Text style={styles.aboutMeTitle}>More from {contractor?.displayName || 'Contractor'}
        </Text>
        <Text style={styles.servicesTitle}>Services I am Offering</Text>
        {contractor?.services && contractor.services.length > 0 ? (
            contractor.services.map(renderService)
        ) : (
            <Text style={styles.servicesTitle}>No services found</Text>
        )}
        </View>
        <View style={styles.btnContainer}>
            <PrimaryButton text="Contact" onPress={()=>handleContact(currentUser,contractor)}/>
            <PrimaryButton text="FeedBacks" onPress={()=>handleFeedBack(contractor)}/>
        </View>
        <Text style={[styles.aboutMeTitle,{paddingLeft:10}]}>My Posts</Text>
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
  )
}

const getStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,    
        },
        ScrollView: {
            alignItems: 'center',
        },
        cover: {
            width: '100%',
            height: 300,
            ...shadowStyle,
        },
        coverImage: {
            width: '100%',
            height: '100%',
        },
        gradient: {
            width: '100%',
            height: 100,
            paddingVertical: 10,
            paddingHorizontal: 20,
            flexDirection: 'row',
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 60,
            borderWidth: 1,
            borderColor: theme.white,
            justifyContent: 'center',
            alignItems: 'center',
            resizeMode: 'cover',
        },
        profileHeader: {
            paddingLeft: 20,
            justifyContent: 'center',
            width: '90%',
            alignItems: 'flex-start',
        },
        headerText: {
            fontFamily: Fonts.primary,
            fontSize: 14,
            fontWeight: "600",
            fontStyle: "normal",
            color: theme.white,
        },
        aboutMe: {
            width: '100%',
            padding: 10,
            alignItems: 'center',

        },
        aboutMeTitle: {
            fontFamily: Fonts.primary,
            fontSize: 20,
            fontWeight: "600",
            fontStyle: "normal",
            color: theme.text,
            marginBottom: 10,
            width: '100%',
        },
        aboutMeText: {
            fontFamily: Fonts.primary,
            fontSize: 14,
            fontWeight: "400",
            fontStyle: "normal",
            color: theme.text,
            textAlign: 'justify',
            width: '90%',
        },
        posts: {
            width: '100%',
            padding: 10,
            alignItems: 'center',
        },
        btnContainer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
        },
        serviceContainer: {
            justifyContent: 'space-between',
            width: '100%',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.text,
        },
        serviceText: {
            fontFamily: Fonts.primary,
            fontSize: 16,
            fontWeight: "600",
            fontStyle: "normal",
            color: theme.text,
        },
        optionText: {
            fontFamily: Fonts.primary,
            fontSize: 14,
            fontWeight: "400",
            fontStyle: "normal",
            color: theme.text,
        },
        servicesTitle: {
            fontFamily: Fonts.primary,
            fontSize: 16,
            fontWeight: "600",
            fontStyle: "normal",
            color: theme.text,
            width: '100%',
            paddingLeft: 10,
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
            padding:5,
        },
        rating: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
        },
        FlatList: {
            width: '100%',
        },
        postWrapper: {
            width: '100%',
            paddingHorizontal: 10,
            paddingVertical: 5,
        },
    })
}

export default ContractorDetail