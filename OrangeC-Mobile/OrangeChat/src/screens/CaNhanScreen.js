import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18next from '../i18n/i18n';
import { useSelector, useDispatch } from 'react-redux';
import Conversation from '../components/conversation';
import Colors from '../themes/Colors';
import conversationApi from '../apis/conversationApi';
import stickerApi from '../apis/stickerApi';
import { setConversations } from '../redux/conversationSlice';
import connectSocket from '../server/ConnectSocket';
import { useFocusEffect } from '@react-navigation/native';
import { formatConversation } from '../utils/formatConversation';
import Icons from '../themes/Icons';
import { setSticker } from '../redux/stickerSlice';

const CaNhanScreen = ({ navigation, route }) => {
  const windowHeight = Dimensions.get('window').height;
  const selectedLanguage = useSelector(
    state => state.language.selectedLanguage,
  );
  const user = useSelector(state => state.auth.user);
  const accessToken = useSelector(state => state.auth.accessToken);
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.conversation.conversations);
  const [temp, setTemp] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    getSticker();
  }, []);

  const getSticker = async () => {
    try {
      const response = await stickerApi.getSticker();
      console.log("response sticker: ", response);
      if (response) {
        dispatch(setSticker(response));
      }
    } catch (error) {
      throw error;
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (keyword == '') getConversation();
      else {
        const data = temp.filter(c =>
          c.nameGroup.toLowerCase().includes(keyword.toLowerCase()),
        );
        dispatch(setConversations(data));
      }
      // getConversation();
    }, [keyword]),
  );

  useEffect(() => {
    connectSocket.on('newConversation', () => {
      getConversation();
    });

    connectSocket.on('chat message', () => {
      getConversation();
    });
  }, []);

  const getConversation = async () => {
    try {
      const response = await conversationApi.getConversation({
        userId: user._id,
      });
      console.log("response: ", response.data);
      if (response) {
        const fmConversations = formatConversation({
          data: response.data,
          userId: user._id,
        });
        dispatch(setConversations(fmConversations));
        setTemp(fmConversations);
      }
    } catch (error) {
      console.log('error nè', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
        <View
          style={{
            height: windowHeight * 0.15,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
            paddingTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Pressable onPress={() => navigation.navigate('TaiKhoan')}>
              <Image
                style={{ width: 40, height: 40, borderRadius: 20 }}
                source={{ uri: user.image }}
              />
            </Pressable>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
              {i18next.t('doanChat')}
            </Text>
            <Pressable>
              <Image source={require('../assets/icon/Vectorfriends.png')} />
            </Pressable>
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                width: '80%',
                height: 50,
                backgroundColor: Colors.grey,
                borderRadius: 10,
                fontSize: 18,
                paddingLeft: 40,
                color: Colors.white,
              }}
              placeholder={i18next.t('timKiem')}
              placeholderTextColor={Colors.white}
              cursorColor={Colors.white}
              onChangeText={setKeyword}
            />
            <View
              style={{ position: 'absolute', left: 50, width: 24, height: 24 }}>
              {Icons.Icons({ name: 'search', width: 22, height: 22 })}
            </View>
          </View>
        </View>
        <View style={{ height: '85%', marginTop: 15 }}>
          <Conversation navigation={navigation} data={conversations} />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CaNhanScreen;
