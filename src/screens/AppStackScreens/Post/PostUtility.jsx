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
