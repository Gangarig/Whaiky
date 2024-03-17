import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { showMessage } from 'react-native-flash-message';



export const DeletePost = (post) => {
    console.log("Delete Post")
    console.log(post.postId)

};

export const EditPost = (post) => {
    console.log("Edit Post")
    console.log(post.postId)
    
    }


export const AddSale = (post,saleValue) => {
    try {
        firestore()
        .collection('posts')
        .doc(post.postId)
        .update({
            sale:saleValue
        })
        .then(() => {
            showMessage({
                message: "Sale Added",
                type: "success",
            });
        });
    } catch (error) {
        console.error('Error adding sale:', error);
        showMessage({
            message: "Failed to add sale",
            type: "danger",
        });
    }
    
}

export const markPost = (postId,userUid) => {
    try {
    firestore().collection('users').doc(userUid).collection('markedPosts').doc(postId).set({
      postId: postId,
    })
    showMessage({
      message: "Post Marked",
      type: "success",
    });
    } catch (error) {
      console.error('Error marking post:', error);
      showMessage({
        message: "Error",
        description: error,
        type: "danger",
      });
    }
  }

  export const removeMarkedPost = (postId,userUid) => {
    try {
        firestore().collection('users').doc(userUid).collection('markedPosts').doc(postId).delete()
        showMessage({
            message: "Post Unmarked",
            type: "success",
        });
        }
        catch (error) {
            console.error('Error unmarking post:', error);
            showMessage({
                message: "Error",
                description: error,
                type: "danger",
            });
        }
  }
