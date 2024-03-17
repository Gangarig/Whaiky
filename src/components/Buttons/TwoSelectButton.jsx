import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const TwoSelectButton = ({
  onPressPrimary,
  onPressSecondary,
  primary,
  secondary,
  primaryDisabled,
  secondaryDisabled,
  icon,
  controlledActiveButtonType,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [buttonType, setButtonType] = useState(controlledActiveButtonType || secondary);

  useEffect(() => {
    if (controlledActiveButtonType) {
      setButtonType(controlledActiveButtonType);
    }
  }, [controlledActiveButtonType, primary, secondary]);

  const primaryPress = () => {
    if (!primaryDisabled) {
      if (!controlledActiveButtonType) { 
        setButtonType(primary);
      }
      onPressPrimary();
    }
  };

  const secondaryPress = () => {
    if (!secondaryDisabled) {
      if (!controlledActiveButtonType) { 
        setButtonType(secondary);
      }
      onPressSecondary();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.buttonTypeBox}>
        <TouchableOpacity
          style={buttonType === secondary ? styles.activeBtnType : styles.inActiveBtnType}
          onPress={secondaryPress}
          disabled={secondaryDisabled}
        >
          <Text style={buttonType === secondary ? styles.activeText : styles.inActiveText}>
            {secondary}
          </Text>
          {icon && (
            <FontAwesomeIcon icon={faChevronDown} size={20} color={buttonType === secondary ? theme.white : theme.text} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={buttonType === primary ? styles.activeBtnType : styles.inActiveBtnType}
          onPress={primaryPress}
          disabled={primaryDisabled}
        >
          <Text 
          style={buttonType === primary ? styles.activeText : styles.inActiveText}
          >
            {primary}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TwoSelectButton;

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
    backgroundColor: theme.background,
    borderColor: theme.primary,
    overflow: 'hidden',
    width: '100%',
    height: 60,
  },
  activeBtnType: {
    backgroundColor: theme.primary,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '50%',
    flexDirection: 'row',
  },
  inActiveBtnType: {
    backgroundColor: theme.background,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '50%',
  },
  activeText: {
    color: theme.white,
    fontSize: 18,
    maxWidth: '70%',
  },
  inActiveText: {
    color: theme.text,
    fontSize: 18,
    maxWidth: '80%',
  },
});
