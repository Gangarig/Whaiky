import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';



export const DeletePost = (post) => {
    console.log("Delete Post")
    console.log(post.postId)

};

export const EditPost = (post) => {
    console.log("Edit Post")
    console.log(post.postId)
    
    }

export const AddSale = (post) => {
    console.log("Add Sale")
    console.log(post.postId)
}
