import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Button,Text } from 'react-native';
import Search from './chat/Search';
import Chats from './chat/Chats';
import Colors from '../../../constant/Colors';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { Global } from '../../../constant/Global';

const ChatScreen = ({ navigation }) => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const handleSearchButtonPress = useCallback(() => {
    setSearchModalVisible(true);
  }, []);
  const handleCloseSearch = useCallback(() => {
    setSearchModalVisible(false);
  }, []);



  return (
    <View style={styles.container}>
        <TouchableOpacity
         style={[styles.inputWrapper]}
        onPress={handleSearchButtonPress}
         >
          <Text style={Global.titleSecondary}>
            Search a User
          </Text>
        </TouchableOpacity>

      <Search isVisible={searchModalVisible} onClose={handleCloseSearch} />
      <Chats navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    paddingLeft: 10,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    fontWeight: '600',
  },

});

export default ChatScreen;
