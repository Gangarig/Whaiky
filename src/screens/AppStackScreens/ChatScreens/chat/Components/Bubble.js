import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import UserAvatar from 'react-native-user-avatar';
import avatar from '../../../../../assets/images/avatar/avatar.png';
import { Global } from '../../../../../constant/Global';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
import { useAuth } from '../../../../../context/AuthContext';
import { useTheme } from '../../../../../context/ThemeContext';

const Bubble = (props) => {
  const { currentMessage } = props;
  const { currentUser } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);
  const theme = useTheme();
  const styles = getStyles(theme);

  const isCurrentUser = currentMessage.user._id === currentUser.uid;

  return (
    <View style={[
      styles.container,
      isCurrentUser ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' },
    ]}>
      {currentMessage.text ? (
      <View style={[
        isCurrentUser ? styles.textContainer : styles.otherTextContainer,
      ]}>
        <Text style={Global.text}>{currentMessage.text}
        </Text>
        <View style={[
          isCurrentUser ? styles.avatarWrapper : styles.otherUser,
        ]}>
          {currentMessage.user.avatar ? (
            <UserAvatar size={30} name={currentMessage.user.name} src={currentMessage.user.avatar} />
          ) : (
            <FastImage
              source={avatar}
              style={{ width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: theme.black, backgroundColor: theme.background }}
              resizeMode="cover"
              onError={(e) => {
                console.log("Image loading error:", e);
              }}
            />
          )}
        </View>
      </View>
      ) : null}

    {currentMessage.image  ? (
      <View style={[
        isCurrentUser ? styles.imageWrapper : styles.otherImageWrapper,
      ]}>
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
              onError={(e) => {
                console.log("Image loading error:", e);
              }}
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
              <View style={[
          isCurrentUser ? styles.avatarWrapper : styles.otherUser,
        ]}>
          {currentMessage.user.avatar ? (
            <UserAvatar size={30} name={currentMessage.user.name} src={currentMessage.user.avatar} />
          ) : (
            <FastImage
              source={avatar}
              style={{ width: 30, height: 30, borderRadius: 50 , borderWidth: 1, borderColor: theme.black,
              backgroundColor: theme.background,
              }}
              resizeMode="cover"
              onError={(e) => {
                console.log("Image loading error:", e);
              }}
            />
          )}
        </View>
    </View>
    ) : null}
    </View>
  );
};

export default Bubble;

const getStyles = (theme) => {
  return StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  textContainer: {
    backgroundColor: theme.lightPrimary,
    borderRadius:5,
    borderWidth: 1.2,
    padding: 5,
    paddingRight: 20,
    borderColor: theme.primary,
    margin: 10,
    maxWidth: '80%',
  },
  otherTextContainer: {
    backgroundColor: theme.background,
    borderRadius:5,
    borderWidth: 1.2,
    padding: 5,
    paddingLeft: 20,
    borderColor: "rgba(2, 173, 148, 0.5)",
    margin: 10,
    maxWidth: '80%',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    borderColor: theme.white,
    borderWidth: 1,
    borderRadius: 50,
  },
  otherUser: {
    position: 'absolute',
    bottom: -15,
    left: -15,
    borderColor: theme.white,
    borderWidth: 1,
    borderRadius: 50,
  },
  imageWrapper: {
    flexDirection: 'column', 
    gap: 10,
    marginVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: theme.background,
    borderRadius: 5,
    borderWidth: 1.2,
    borderColor: "rgba(158, 65, 240, 0.5)",
    padding:10 ,
    position: 'relative',
    marginRight: 10,
  },
  otherImageWrapper: {
    flexDirection: 'column', 
    gap: 10,
    marginVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: theme.background,
    borderRadius: 5,
    borderWidth: 1.2,
    borderColor: theme.primary,
    padding:10 ,
    position: 'relative',
    marginLeft: 10,
  },
  imageContainer: {
    flexDirection: 'row', 
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    
  },
  evenImageContainer: {
    justifyContent: 'flex-end', 
  },
});
}