import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faIdBadge, faFile, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

const ServiceButton = ({ item,navigation,onPress }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <TouchableOpacity style={styles.container}
    onPress={onPress}
    >
            <View style={styles.cardIcon}>
              <FontAwesomeIcon size={40} color={theme.primary} icon={faIdBadge} />
            </View>
            <Text style={[styles.cardText]}>
                Select or Change Categories
            </Text>
          <View style={styles.cardMenuWrapper} onPress={() => console.log('Menu Pressed')}>
            <FontAwesomeIcon size={30} color={theme.primary} icon={faEllipsisVertical} />
          </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.backgroundColor,
      borderRadius: 12,
      overflow: 'hidden',
      padding: 10,
    },
    cardText: {
        color: theme.text,
        fontSize: 14,
        fontWeight: 'bold',
        },
  })
}

export default ServiceButton