import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const TwoSelectBtnWithActiveState = ({
  onPressPrimary,
  onPressSecondary,
  primary,
  secondary,
  primaryActive = false,
  secondaryActive = false,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const renderButton = (label, isActive, onPress) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <View
          style={[styles.btnWrapper,
            { backgroundColor: isActive ? theme.primary : theme.background },
          ]}
        >
          <Text style={isActive ? styles.activeText : styles.inActiveText}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.buttonTypeBox}>
        {renderButton(secondary, secondaryActive, onPressSecondary)}
        {renderButton(primary, primaryActive, onPressPrimary)}
      </View>
    </View>
  );
};

export default TwoSelectBtnWithActiveState;

const getStyles = (theme) => StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  buttonTypeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.primary,
    overflow: 'hidden',
    width: '100%',
    height: 60,
  },
  button: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeText: {
    color: theme.white,
    fontSize: 18,
  },
  inActiveText: {
    color: theme.text,
    fontSize: 18,
  },
  btnWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
