import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import UserAvatar from 'react-native-user-avatar';
import defaultAvatar from '../../../../../assets/images/avatar/avatar.png';
import Colors from '../../../../../constant/Colors';
import { Global } from '../../../../../constant/Global';
import { shadowStyle } from '../../../../../constant/Shadow';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';

const Bubble = (props) => {
  const { currentMessage } = props;
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      {currentMessage.text ? (
      <View style={styles.textContainer}>
        <Text style={Global.text}>{currentMessage.text}</Text>
        <View style={styles.avatarWrapper}>
          {/* Render avatar */}
          {currentMessage.user.avatar ? (
            <UserAvatar size={30} name={currentMessage.user.name} src={currentMessage.user.avatar} />
          ) : (
            <UserAvatar size={30} name={currentMessage.user.name} src={defaultAvatar} />
          )}
        </View>
      </View>
      ) : null}

    {currentMessage.image  ? (
      <View style={styles.imageWrapper}>
      {currentMessage.image.map((imageUrl, index) => (
        <View
          key={index}
          style={[
            styles.imageContainer,
            index % 2 === 0 ? styles.evenImageContainer : null,
          ]}
        >
          <TouchableOpacity onPress={() => setIsVisible(true)}>
            <FastImage
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      ))}

      <ImageView
        images={currentMessage.image.map(url => ({ uri: url }))}
        imageIndex={0}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
    ) : null}
    </View>
  );
};

export default Bubble;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  textContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius:5,
    borderWidth: 0.5,
    padding: 5,
    paddingRight: 25,
    borderColor: "rgba(158, 65, 240, 0.5)",
    margin: 10,
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 50,
  },
  imageWrapper: {
    flexDirection: 'column', 
    ...shadowStyle,
    gap: 5,
    marginVertical: 15,
  },
  imageContainer: {
    flexDirection: 'row', 
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  evenImageContainer: {
    justifyContent: 'flex-end', 
  },
});
