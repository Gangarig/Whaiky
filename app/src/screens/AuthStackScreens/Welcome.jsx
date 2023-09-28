import React, { useState, useRef } from 'react';
import { Animated, StyleSheet, Image, View, Button, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../../../assets/logo/logo.png';
import Image1 from '../../../assets/images/image1.png';
import Image2 from '../../../assets/images/image2.png';
import Image3 from '../../../assets/images/image3.png';

const Welcome = ({ navigation }) => {
    const [activeView, setActiveView] = useState(1);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const barWidth = useRef(new Animated.Value(0.25)).current; // Start with 25%
  
    const handleScreenTouch = () => {
      if (activeView === 4) {
        navigation.navigate('login');
        return;
      }
  
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setActiveView(prevView => {
          const nextView = prevView < 4 ? prevView + 1 : 1;
  
          // Animate the bar width based on the next view.
          Animated.timing(barWidth, {
            toValue: nextView * 0.25, // 0.25 (25%) is each step's increment
            duration: 1000,
            useNativeDriver: false,
          }).start();
  
          return nextView;
        });
  
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#9E41F0', '#01AD94']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
        <TouchableOpacity style={styles.touchableArea} onPress={handleScreenTouch}>
          <Animated.View style={{ ...styles.content, opacity: fadeAnim }}>
            {activeView === 1 && (
              <>
                <Text style={styles.textWelcome}>Welcome</Text>
                <Text style={styles.textWelcome}>to</Text>
                <Image source={Logo} style={styles.logoImage} />
                <Text style={styles.textWelcome}>Whaiky</Text>
              </>
            )}
            {activeView === 2 && (
              <>
                <View style={styles.imageView}>
                  <Image source={Image1} style={styles.image} />
                </View>
                <View style={styles.textView}>
                  <Text style={styles.text}>
                    Find the service you are looking for at the best prices, fast easy and without leaving home with the security of Whaiky
                  </Text>
                </View>
              </>
            )}
            {activeView === 3 && (
              <>
                <View style={styles.imageView}>
                  <Image source={Image2} style={styles.image} />
                </View>
                <View style={styles.textView}>
                  <Text style={styles.text}>
                    Get the most out of your service and offer it on whaiky, where everyone can find you more easily.
                  </Text>
                </View>
              </>
            )}
            {activeView === 4 && (
              <>
                <View style={styles.imageView}>
                  <Image source={Image3} style={styles.image} />
                </View>
                <View style={styles.textView}>
                  <Text style={styles.text}>Start enjoying the adventure</Text>
                  <TouchableOpacity onPress={()=>navigation.navigate('login')}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                  </View>
                  </TouchableOpacity>
                </View>

              </>
            )}
          </Animated.View>
        </TouchableOpacity>

        {activeView > 1 && (
          <View style={styles.barContainer}>
            <Animated.View style={[styles.filledBar, { width: barWidth.interpolate({
                inputRange: [ 0.5, 0.75, 1],
                outputRange: ['33%', '66%', '100%']
            })}]} />
            <View style={styles.emptyBar} />
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageView: {
    width: '100%', // Full width
    height: '75%', // 70% of height
    position: 'absolute', // Absolute positioning
    top: 0, // Start from the top

  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',

  },
  logoImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },

  textView: {
    height: '20%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  textWelcome: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 36,
    fontWeight: '400',
  },
  text: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
  },
  barContainer: {
    height: 15,
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Using a background color on the main container
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align bar to the start
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  filledBar: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: '100%',
  },

  emptyBar: { // Removed this style as we are using the background color of the barContainer for the empty state.
    display: 'none'
  },
  button: {
    width: 150,
    height: 40,
    flexShrink: 0,
    borderRadius: 8,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    
  },
  buttonText: {
    color: '#000',
    fontFamily: 'Montserrat',
    fontSize: 25,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 32 * 1.2,
  },
});

export default Welcome;
