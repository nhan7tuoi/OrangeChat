import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Dimensions, Alert } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Colors from '../../themes/Colors';
import i18next from '../../i18n/i18n';
import authApi from '../../apis/authApi';
import { useSelector } from 'react-redux';

const windowHeight = Dimensions.get('window').height;

const RegisterCheck = ({ navigation }) => {
    const selectedLanguage = useSelector((state) => state.language.selectedLanguage);

    const checkEmail = async (values) => {
        try {
            const response = await authApi.checkInfo({
                email: values.email,
            });
            if (response.message === 'email') {
                Alert.alert(i18next.t('emailDaTonTai'));
            } else {
                handleSendCode(values.email);
            }
        } catch (error) {
            console.log('error', error);
        }
    }
    const handleSendCode = async (email) => {
        try {
            const response = await authApi.verifycation({ username: email });
            if (response.message === 'ok') {
                navigation.navigate('RegisterConfirm', { email,code: response.data.code});
            } else {
                Alert.alert('Gửi mã thất bại');
            }
        } catch (error) {
            Alert.alert('Gửi mã thất bại');
            console.log('error', error);
        }
    };

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat, paddingHorizontal: 10 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  >
                <View style={{ height: windowHeight * 0.20 }}>
                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                              .matches(
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|vn)$/,
                                i18next.t('diaChiEmailKhongHopLe')
                              )
                              .required(i18next.t('khongDuocBoTrong')),
                          })}
                        validateOnMount={true}
                        onSubmit={(values) => {
                            checkEmail(values);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                            <View style={{ flex: 1, justifyContent: 'space-around', marginTop: 10 }}>
                                <View>
                                    <TextInput
                                        style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
                                        label={i18next.t('nhapGmail')}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        error={errors.email && touched.email}
                                    />
                                    {errors.email && touched.email && <Text style={{ color: Colors.white, fontSize: 12 }}>{errors.email}</Text>}
                                </View>
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default RegisterCheck;
