import React,{useState} from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import  {firebase} from '../Config/FireBaseConfig';
const TestFireBase = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [quenmk, setQuenMK] = useState('');
    const signUpWithEmailAndPhone = async (email, password) => {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            // const user = userCredential.user;

            // // Cập nhật thông tin số điện thoại cho người dùng
            // await user.updatePhoneNumber(phoneNumber);

            console.log('Tài khoản đã được đăng ký thành công!');
        } catch (error) {
            console.error('Đã xảy ra lỗi khi đăng ký tài khoản:', error);
        }
    };

    const resetPasswordWithEmail = async (email) => {
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            console.log('Một email đặt lại mật khẩu đã được gửi đến địa chỉ email của bạn.');
        } catch (error) {
            console.error('Đã xảy ra lỗi khi gửi email đặt lại mật khẩu:', error);
        }
    };
    return (
        <View style={{flex:1,backgroundColor:'pink',justifyContent:'center',alignItems:'center'}}>
            <TextInput onChangeText={setEmail} placeholder='Email' />
            <TextInput onChangeText={setPassword} placeholder='Password' secureTextEntry/>
            <TextInput onChangeText={setPhoneNumber} placeholder='Số điện thoại' />
            <Pressable onPress={()=>{
                signUpWithEmailAndPhone(email, password, phoneNumber);
            }}
            
            style={{width:100,height:50,backgroundColor:'white'}}>
                <Text>Đăng ký</Text>
            </Pressable>
            <TextInput onChangeText={setQuenMK} placeholder='Nhập email để quên mk' />
            <Pressable onPress={()=>{
                resetPasswordWithEmail(quenmk);
            }}>
                <Text>Quên mật khẩu</Text>
            </Pressable>
        </View>
    );
}

export default TestFireBase;
