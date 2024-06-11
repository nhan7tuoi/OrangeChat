import React from 'react';
import {ActivityIndicator, Image, ImageBackground,Dimensions} from 'react-native';
import Colors from '../themes/Colors';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/image/flashScreen.png')}
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
      imageStyle={{ flex: 1 }}>
      {/* <Image
        source={require('../assets/image/avt1.png')}
        style={{
          width: windowWidth * 0.7,
          resizeMode: 'contain',
        }}
      /> */}
      {/* <SpaceComponent height={16} /> */}
      <ActivityIndicator color={Colors.primary} size={50} />
    </ImageBackground>
  );
}

export default SplashScreen;
