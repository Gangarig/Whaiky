// PostDetail.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from 'react-native';
import { getDoc, doc, DocumentData } from 'firebase/firestore';
import { firestore } from '../../../FirebaseConfig';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../services/RootStackParamList';


interface PostDetailProps {
    route: RouteProp<RootStackParamList, 'PostDetail'>;
  }



interface Post {
  id: string;
  title: string;
  price: string;
  imageURL: string;
}

const PostDetailScreen: React.FC<PostDetailProps> = ({ route }) =>  {
  const { id } = route.params;
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, 'posts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <View>
      {post ? (
        <>
          <Text style={{ fontSize: 24 }}>{post.title}</Text>
          <Text style={{ fontSize: 18, color: '#777' }}>Price: {post.price}</Text>
          <Image source={{ uri: post.imageURL }} style={{ width: 100, height: 100 }} />
          {/* You can add more fields if you have them */}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default PostDetailScreen;
