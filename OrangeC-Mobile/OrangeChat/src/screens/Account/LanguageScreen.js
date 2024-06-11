import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../themes/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../../redux/languageSlice';
import Icons from '../../themes/Icons';
import i18next from '../../i18n/i18n';


const LanguageScreen = ({navigation}) => {
  const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
  const dispatch = useDispatch();
  const [check, setCheck] = useState(false);

  const changeLanguage = (location) => {
    dispatch(setLanguage(location));
    i18next.changeLanguage(location);
  };

  useEffect(() => {
    if (selectedLanguage === 'vi') {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [selectedLanguage]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat, padding: 10 }}>
      <View style={{
        height: 150,
        justifyContent: 'space-around'
      }}>
        <Pressable
          onPress={() => {
            changeLanguage('vi');
          }}
          style={{
            height: 50,
            padding: 10,
            borderWidth: 1,
            borderColor: Colors.primary,
            justifyContent: 'space-between',
            flexDirection: 'row'
          }}>
          <Text style={{ color: Colors.white }}>Tiếng Việt</Text>
          <View>
            {check && Icons.Icons({ name: 'check', width: 16, height: 24 })}
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            changeLanguage('en');
          }}
          style={{
            height: 50,
            padding: 10,
            borderWidth: 1,
            borderColor: Colors.primary,
            justifyContent: 'space-between',
            flexDirection: 'row'
          }}>
          <Text style={{ color: Colors.white }}>English</Text>
          <View>
            {!check && Icons.Icons({ name: 'check', width: 16, height: 24 })}
          </View>
        </Pressable>
      </View>
      <Pressable 
      onPress={()=>{
        navigation.goBack();
      }}
      style={{
        marginTop: 20,
        width: 200,
        height: 40,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
      }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{i18next.t('luu')}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default LanguageScreen;
