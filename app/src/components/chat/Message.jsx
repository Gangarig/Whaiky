import React, { useState } from "react";
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useAuth();
  const { data } = useChat();

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isOwner = message.senderId === currentUser.uid;

  const userImageUri = isOwner
    ? (currentUser.photoURL || '../../../assets/images/avatar/avatar.png')
    : (data.user.photoURL || '../../../assets/images/avatar/avatar.png');

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, isOwner ? styles.right : styles.left]}>
      <View style={[styles.messageBox, isOwner ? styles.myMessageBox : styles.otherMessageBox]}>
        <Text>{message.text}</Text>
        {message.images && (
          <View style={{ flexDirection: "row", marginLeft: 5 }}>
            {message.images.map((img, index) => (
              <TouchableOpacity key={index} onPress={() => openImageModal(index)}>
                <Image source={{ uri: img }} style={{ width: 50, height: 50, marginRight: index < 2 ? 5 : 0 }} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <Image
        source={{ uri: userImageUri }}
        style={[styles.avatar, isOwner ? styles.myAvatar : styles.otherAvatar]}
      />
      {/* Rest of the Modal remains the same */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 5,
    alignItems: 'flex-end'
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
    marginHorizontal: 10,
    padding: 5
  },
  myMessageBox: {
    backgroundColor: 'pink',
    borderColor: '#d60d8c',
    borderWidth: 1
  },
  otherMessageBox: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  myAvatar: {
    marginRight: 10,
  },
  otherAvatar: {
    marginLeft: 10,
  }
});

export default Message;
