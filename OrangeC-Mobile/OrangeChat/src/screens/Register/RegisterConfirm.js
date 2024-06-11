import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import i18next from '../../i18n/i18n';
import Colors from '../../themes/Colors';
import { useSelector } from 'react-redux';


const ConfirmRegister = ({ navigation, route }) => {
  const selectedLanguage = useSelector(
    state => state.language.selectedLanguage,
  );
  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [txtCode, setTxtCode] = useState('');
  const { email, code } = route.params;
  const [isComfirm, setIsComfirm] = useState(false);

  useEffect(() => {
    if (txtCode !== '' && txtCode.length == 6) {
      setIsComfirm(true);
    }
  }, [txtCode]);

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setIsResendEnabled(true);
    }

    return () => clearInterval(interval);
  }, [countdown]);

  const handleResend = () => {
    setIsResendEnabled(false);
    setCountdown(60);
  };

  const handleConfirm = async () => {
    console.log('txtCode', txtCode, code);
    if (txtCode == code) {
      navigation.navigate('RegisterAccount', { email });
    } else {
      Alert.alert('Mã xác nhận không đúng');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
      <View>
        <TextInput
          label={i18next.t('nhapMaXacNhan')}
          style={{
            backgroundColor: Colors.white,
            borderColor: Colors.primary,
            borderWidth: 2,
            fontWeight: 'bold',
            fontSize: 20,
            borderBottomWidth: 3,
            marginTop: 20,
          }}
          value={txtCode}
          onChangeText={text => setTxtCode(text)}
        />
        <Pressable
          disabled={!isComfirm}
          style={
            isComfirm
              ? {
                alignSelf: 'center',
                width: 200,
                height: 60,
                backgroundColor: Colors.primary,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }
              : {
                alignSelf: 'center',
                width: 200,
                height: 60,
                backgroundColor: Colors.grey,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }
          }
          onPress={() => {
            handleConfirm();
          }}>
          <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold' }}>
            {i18next.t('xacNhan')}
          </Text>
        </Pressable>
      </View>
      <Text
        style={{
          color: Colors.white,
          fontSize: 20,
          alignSelf: 'center',
          marginTop: 20,
        }}>
        {i18next.t('chuaNhanDuocMaXacNhan')}
      </Text>
      <Pressable
        style={{
          alignSelf: 'center',
          width: 200,
          height: 60,
          backgroundColor: isResendEnabled ? Colors.primary : Colors.gray,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}
        onPress={() => {
          if (isResendEnabled) {
            handleResend();
          }
        }}>
        <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold' }}>
          {isResendEnabled
            ? i18next.t('guiLai')
            : `${i18next.t('guiLai')} (${countdown}s)`}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ConfirmRegister;
