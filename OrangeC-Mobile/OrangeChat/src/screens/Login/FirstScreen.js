import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import i18next from '../../i18n/i18n';
import { setLanguage } from '../../redux/languageSlice';


const FirstScreen = ({ navigation }) => {
  const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
  console.log(selectedLanguage);
  console.log(i18next.t('dangNhap'));
  const dispatch = useDispatch();

  const changeLanguage = (location) => {
    dispatch(setLanguage(location));
    i18next.changeLanguage(location);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{ height: '10%', justifyContent: 'center', alignItems: 'center', }}>
        <Text style={{
          fontSize: 40,
          fontWeight: 'bold',
          color: 'rgba(238, 102, 25, 1)'
        }}>Orange Chat</Text>
      </View>
      <View style={{ height: '40%' }}>
        <Image source={require('../../assets/image/firstImage.jpg')}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View style={{ height: '15%', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>{i18next.t('chatNhomTienLoi')}</Text>
        <Text style={{ width: '80%', textAlign: 'center', fontSize: 16, color: 'gray' }}>{i18next.t('chatNhomTienLoiDes')}</Text>
      </View>
      <View style={{ height: '25%', justifyContent: 'center', alignItems: 'center', gap: 25 }}>
        <Pressable style={{
          width: 300,
          height: 60,
          backgroundColor: 'rgba(238, 102, 25, 1)',
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center'
        }}
          onPress={() => {
            navigation.navigate('LoginScreen');
          }}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{i18next.t("dangNhap")}</Text>
        </Pressable>
        <Pressable onPress={() => {
          navigation.navigate('RegisterCheck');
        }}
          style={{
            width: 300,
            height: 60,
            backgroundColor: 'gray',
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{i18next.t('dangKy')}</Text>
        </Pressable>
      </View>
      <View style={{ height: '10%', flexDirection: 'row', justifyContent: 'center', gap: 40, paddingTop: 30 }}>
        <Pressable onPress={() => {
          changeLanguage('vi');
        }} >
          <Text style={{ color: selectedLanguage === 'vi' ? 'white' : 'gray' }}>Tiếng Việt</Text>
        </Pressable>
        <Pressable onPress={() => {
          changeLanguage('en');
        }}>
          <Text style={{ color: selectedLanguage === 'en' ? 'white' : 'gray' }}>English</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default FirstScreen;
