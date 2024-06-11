import React, { useState,useEffect } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import i18n from '../i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { removeAuth } from '../redux/authSlice';
import { useSelector } from 'react-redux';
import connectSocket from '../server/ConnectSocket';


const TaiKhoanScreen = ({navigation}) => {
  const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
      <View style={{ height: '35%', justifyContent: 'space-around', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: Colors.white, fontSize: 24, fontWeight: 'bold' }}>{i18n.t('toi')}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image resizeMode='contain' style={{ width: 150, height: 150, borderRadius: 75, borderWidth: 2, borderColor: Colors.primary }} source={{uri:user.image}} />
        </View>
        <Text style={{ color: Colors.white, fontSize: 24, fontWeight: 'bold' }}>
          {user.name}
        </Text>
      </View>
      <View style={{ height: '60%',justifyContent:'space-around' }}>
        <View style={{height:'50%',justifyContent:'space-around'}}>
          <Pressable 
          onPress={()=>{
            navigation.navigate('EditProfile')
          }}
          style={{ height: 60, justifyContent: 'center', paddingLeft: 30,borderWidth:1,borderColor:Colors.primary}}>
            <Text style={{
              color: Colors.white,
              fontSize: 16,
              fontWeight: 'bold'
            }}>{i18n.t('chinhSuaProfile')}</Text>
          </Pressable>
          <Pressable 
          onPress={()=>{
            navigation.navigate('ChangePass')
          }}
          style={{ height: 60, justifyContent: 'center', paddingLeft: 30,borderWidth:1,borderColor:Colors.primary }}>
            <Text style={{
              color: Colors.white,
              fontSize: 16,
              fontWeight: 'bold'
            }}>{i18n.t('doiMatKhau')}</Text>
          </Pressable>
          <Pressable 
          onPress={()=>{
            navigation.navigate('Language')
          }}
          style={{ height: 60, justifyContent: 'center', paddingLeft: 30,borderWidth:1,borderColor:Colors.primary }}>
            <Text style={{
              color: Colors.white,
              fontSize: 16,
              fontWeight: 'bold'
            }}>{i18n.t('ngonNgu')}</Text>
          </Pressable>
        </View>
        <Pressable style={{width:200,height:60,backgroundColor:Colors.primary,alignSelf:'center',justifyContent:'center',alignItems:'center',borderRadius:10}}
        onPress={()=>{
          AsyncStorage.removeItem('accessToken');
          console.log('logout');
          dispatch(removeAuth());
          console.log('user',user)
          connectSocket.emit('logout',user._id);
        }}
        >
          <Text style={{
            color: Colors.white,
            fontSize: 20,
            fontWeight: 'bold'
          }}>{i18n.t('dangXuat')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default TaiKhoanScreen;
