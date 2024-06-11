
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import FirstScreen from '../screens/Login/FirstScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterAccount from '../screens/Register/RegisterAccount';
import RegisterConfirm from '../screens/Register/RegisterConfirm';
import RegisterInfo from '../screens/Register/RegisterInfo';
import ForgotPassword from '../screens/Login/ForgotPassword';
import RegisterCheck from '../screens/Register/RegisterCheck';
import ForgotConfirm from '../screens/Login/ForgotConfirm';
import ForgotUpdatePassword from '../screens/Login/ForgotUpdatePassword';

import i18next from '../i18n/i18n';
import Colors from '../themes/Colors';

const Stack = createNativeStackNavigator();


const LoginNavigator = () => {
  const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
  i18next.changeLanguage(selectedLanguage);
  return (
    <Stack.Navigator
      initialRouteName='FirstScreen'
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="FirstScreen" component={FirstScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen}
        options={{
          headerShown: true,
          title: i18next.t('dangNhap'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }} />
      <Stack.Screen name="RegisterAccount" component={RegisterAccount}
        options={{
          headerShown: true,
          title: i18next.t('dangKy'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen name="RegisterCheck" component={RegisterCheck}
        options={{
          headerShown: true,
          title: i18next.t('dangKy'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen name="RegisterInfo" component={RegisterInfo} options={{
        headerShown: true,
        title: i18next.t('nhapThongTin'),
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: 'white',
      }} />
      <Stack.Screen name="RegisterConfirm" component={RegisterConfirm}
        options={{
          headerShown: true,
          title: i18next.t('xacNhanDangKy'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword}
        options={{
          headerShown: true,
          title: i18next.t('quenMatKhau'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen name="ForgotConfirm" component={ForgotConfirm}
        options={{
          headerShown: true,
          title: i18next.t('quenMatKhau'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen name="ForgotUpdatePassword" component={ForgotUpdatePassword}
        options={{
          headerShown: true,
          title: i18next.t('quenMatKhau'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />

    </Stack.Navigator>
  )
}
export default LoginNavigator;
