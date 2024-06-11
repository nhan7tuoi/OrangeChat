import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../themes/Colors';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native-paper';
import i18next from '../../i18n/i18n';
import authApi from '../../apis/authApi';
import { useSelector,useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeAuth } from '../../redux/authSlice';
import connectSocket from '../../server/ConnectSocket';


const ChangePassScreen = () => {
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);


  const changePassword = async (values) => {
    try {
      const response = await authApi.changePassword({
        userId: user._id,
        oldpassword: values.oldpassword,
        password: values.password,
      });
      console.log('response', response);
      if (response.message === 'ok') {
        Alert.alert(i18next.t('doiMatKhauThanhCong'));
        AsyncStorage.removeItem('accessToken');
        console.log('logout');
        dispatch(removeAuth());
        console.log('user', user)
        connectSocket.emit('logout', user._id);
      } else if (response.message === 'sai') {
        Alert.alert(i18next.t('matKhauCuKhongDung'));
      }
    }
    catch (error) {
      console.log('error', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
      <View style={{ flex: 1 }}>
        <Formik
          initialValues={{ oldpassword: '', password: '', repassword: '' }}
          validationSchema={Yup.object({
            oldpassword: Yup.string().min(6, i18next.t('matKhauPhaiCoItNhat6KyTu')).required(i18next.t('khongDuocBoTrong')),
            password: Yup.string().min(6, i18next.t('matKhauPhaiCoItNhat6KyTu')).required(i18next.t('khongDuocBoTrong')),
            repassword: Yup.string().oneOf([Yup.ref('password'), null], i18next.t('matKhauKhongTrungKhop')).required(i18next.t('khongDuocBoTrong')),
          })}
          validateOnMount={true}
          onSubmit={(values) => {
            changePassword(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
            <View style={{ height: 300, justifyContent: 'space-around' }}>
              <TextInput
                style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
                label={i18next.t('nhapMatKhauCu')}
                onChangeText={handleChange('oldpassword')}
                onBlur={handleBlur('oldpassword')}
                value={values.oldpassword}
                error={errors.oldpassword && touched.oldpassword}
                secureTextEntry={!passwordVisible}
                right={
                  <TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} />
                }
              />
              {errors.oldpassword && touched.oldpassword && <Text style={{ color: Colors.white, fontSize: 12 }}>{errors.oldpassword}</Text>}
              <TextInput
                style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
                label={i18next.t('nhapMatKhau')}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                error={errors.password && touched.password}
                secureTextEntry={!passwordVisible}
                right={
                  <TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} />
                }
              />
              {errors.password && touched.password && <Text style={{ color: Colors.white, fontSize: 12 }}>{errors.password}</Text>}
              <TextInput
                style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
                label={i18next.t('nhapLaiMatKhau')}
                onChangeText={handleChange('repassword')}
                onBlur={handleBlur('repassword')}
                value={values.repassword}
                error={errors.repassword && touched.repassword}
                secureTextEntry={!passwordVisible}
                right={
                  <TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} />
                }
              />
              {errors.repassword && touched.repassword && <Text style={{ color: Colors.white, fontSize: 12 }}>{errors.repassword}</Text>}
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Pressable
                  disabled={!isValid}
                  onPress={handleSubmit}
                  style={
                    isValid ? {

                      height: 50, width: 200, backgroundColor: Colors.primary, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20

                    } : {

                      height: 50, width: 200, backgroundColor: Colors.grey, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20

                    }
                  }>
                  <Text style={{ color: Colors.white }}>{i18next.t('tiep')}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

export default ChangePassScreen;
