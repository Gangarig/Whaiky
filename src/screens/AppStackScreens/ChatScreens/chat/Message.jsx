import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useAuth } from "../../../../context/AuthContext";
import { useChat } from "../../../../context/ChatContext";
import FastImage from 'react-native-fast-image';
import Colors from "../../../../constant/Colors";
import defaultAvatar from '../../../../assets/images/avatar/avatar.png';

const Message = ({ message }) => {
  const { currentUser } = useAuth();
  const { data } = useChat();

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const isOwner = message.senderId === currentUser.uid;

  const userImageUri = isOwner
    ? (currentUser.photoURL || defaultAvatar)
    : (data.user.photoURL || defaultAvatar);

  const openImageModal = (img) => {
    setCurrentImage(img);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, isOwner ? styles.right : styles.left]}>
      <FastImage
        source={{ uri: userImageUri }}
        style={[styles.avatar, isOwner ? styles.myAvatar : styles.otherAvatar]}
      />
      <View style={[styles.messageBox, isOwner ? styles.myMessageBox : styles.otherMessageBox]}>
        <Text style={styles.messageText}>{message.text}</Text>
        {message.images && (
          <View style={styles.imageContainer}>
            {message.images.map((img, index) => (
              <TouchableOpacity key={index} onPress={() => openImageModal(img)}>
                <FastImage source={{ uri: img }} style={styles.messageImage} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Image Modal */}
      {isModalVisible && (
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)}>
            <ImageBackground source={{ uri: currentImage }} style={styles.fullImage} />
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const sharedStyles = {
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    bottom: 0,
  },
  messageImage: {
    width: 100, 
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  right: {
    justifyContent: 'flex-end',
  },
  left: {
    justifyContent: 'flex-start',
  },
  messageBox: {
    maxWidth: '80%',
    borderRadius: 10,
    padding: 8,
    paddingRight: 25, 
  },
  myMessageBox: {
    backgroundColor: '#9E41F033', 
    marginLeft: 30,
    alignSelf: 'flex-end',
    borderWidth: 0.5,
    borderColor: "rgba(158, 65, 240, 0.5)"
  },
  otherMessageBox: {
    backgroundColor: '#FFFFFF', 
    marginRight: 30,
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderColor: "rgba(2, 173, 148, 0.5)"
  },
  avatar: sharedStyles.avatar,
  myAvatar: {
    right: -40,
    borderColor: Colors.primary,
  },
  otherAvatar: {
    left: -40,
    borderColor: Colors.secondary,
  },
  messageText: {
    color: Colors.text,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,

  },
  messageImage: sharedStyles.messageImage,
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '95%',
    resizeMode: 'contain',
  },
});

export default Message;
