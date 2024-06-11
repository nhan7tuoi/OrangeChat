import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Colors from '../../themes/Colors';
import DatePicker from 'react-native-date-picker';
import i18next from '../../i18n/i18n';
import authApi from '../../apis/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/authSlice';
import connectSocket from '../../server/ConnectSocket';
import { Alert } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const URL_IMAGE_MALE =
    'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/man-user-circle-icon.png';
const URL_IMAGE_FEMALE =
    'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/woman-user-circle-icon.png';

const RegisterScreen = ({ route }) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const account = route.params;
    const dispatch = useDispatch();


    const handleRegister = async (values) => {
        const userData = {
            email: account.email,
            password: account.password,
            phone: account.phoneNumber,
            name: values.fullName,
            gender: values.gender,
            dateOfBirth: date,
            image: values.gender == 'male' ? URL_IMAGE_MALE : URL_IMAGE_FEMALE,
            active: true,
        }

        try {
            if (userData.dateOfBirth > new Date()) {
                Alert.alert('ngaySinhKhongHopLe');
                return;
            } else if (userData.dateOfBirth.getFullYear() > 2008) {
                Alert.alert('Chưa đủ 16 tuổi');
                return;
            } else {
                const response = await authApi.register({ ...userData });
                console.log('response', response);
                if (response.message === 'ok') {
                    await AsyncStorage.setItem(
                        'accessToken',
                        JSON.stringify(response.accessToken),
                    );

                    dispatch(
                        setAuth({
                            user: response.userRespones,
                            accessToken: response.accessToken,
                        }),
                    );
                    connectSocket.initSocket(response.userRespones._id);
                } else {
                    Alert.alert('Đăng ký thất bại');
                }
            }
        } catch (error) {
            Alert.alert('Đăng ký thất bại');
            console.log('error', error);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat, paddingHorizontal: 10 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={{ height: windowHeight * 0.45 }}>
                    <Formik
                        initialValues={{ fullName: '', gender: 'male' }}
                        validationSchema={Yup.object({
                            fullName: Yup.string().required(i18next.t('khongDuocBoTrong')),
                        })}
                        validateOnMount={true}
                        onSubmit={(values) => {
                            handleRegister(values);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (

                            <View style={{ flex: 1, justifyContent: 'space-around' }}>
                                <View>
                                    <TextInput
                                        style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
                                        label={i18next.t('nhapTen')}
                                        onChangeText={handleChange('fullName')}
                                        onBlur={handleBlur('fullName')}
                                        value={values.fullName}
                                        error={errors.fullName && touched.fullName}
                                    />
                                    {errors.fullName && touched.fullName && <Text style={{ color: Colors.white, fontSize: 12 }}>{errors.fullName}</Text>}
                                </View>
                                <View>
                                    <RadioButton.Group
                                        onValueChange={(newValue) => handleChange('gender')(newValue)}
                                        value={values.gender}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <RadioButton value='male' />
                                            <Text style={{ color: Colors.white }}>{i18next.t('nam')}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <RadioButton value="female" />
                                            <Text style={{ color: Colors.white }}>{i18next.t('nu')}</Text>
                                        </View>
                                    </RadioButton.Group>
                                </View>
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Pressable onPress={() => setOpen(true)}
                                            style={{
                                                width: 120,
                                                height: 30,
                                                backgroundColor: Colors.primary,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 10
                                            }} >
                                            <Text style={{ color: Colors.white, fontSize: 12 }}>{i18next.t('chonNgaySinh')}</Text>
                                        </Pressable>
                                        <DatePicker
                                            mode='date'
                                            modal
                                            open={open}
                                            date={date}
                                            onConfirm={(date) => {
                                                setOpen(false)
                                                setDate(date)
                                                console.log('date', date);
                                            }}
                                            onCancel={() => {
                                                setOpen(false)
                                            }}
                                        />
                                        <Text style={{ color: Colors.white, fontSize: 20, alignSelf: 'center' }}>{date.toLocaleDateString()}</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Pressable
                                        disabled={!isValid}
                                        onPress={handleSubmit}
                                        style={
                                            isValid ?
                                                { height: 50, width: 200, backgroundColor: Colors.primary, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }
                                                :
                                                { height: 50, width: 200, backgroundColor: Colors.grey, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }
                                        }>
                                        <Text style={{ color: Colors.white }}>{i18next.t('xacNhan')}</Text>
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

export default RegisterScreen;
