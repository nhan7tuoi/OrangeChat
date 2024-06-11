import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../themes/Colors';
import i18next from '../i18n/i18n';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchFriends, setFriends} from '../redux/friendSlice';
import connectSocket from '../server/ConnectSocket';
import conversationApi from '../apis/conversationApi';
import {setConversations} from '../redux/conversationSlice';
import {formatConversation} from '../utils/formatConversation';

const {width, height} = Dimensions.get('window');

const ForwardScreen = ({route}) => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    state => state.language.selectedLanguage,
  );
  const [listConversations, setConversations] = useState([]);
  const [temp, setTemp] = useState([]);
  const [keyword, setKeyword] = useState('');
  useEffect(() => {
    if (keyword === '') {
      getConversation();
    } else {
      const data = temp.filter(c => c.nameGroup.includes(keyword));
      setConversations(data);
    }
  }, [keyword]);

  const getConversation = async () => {
    try {
      const response = await conversationApi.getAllConversation({
        userId: user._id,
      });

      if (response) {
        const fConversation = formatConversation({
          data: response.data,
          userId: user._id,
        });
        setConversations(fConversation);
        setTemp(fConversation)
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const forwardMessage = conversation => {
    connectSocket.emit('forward message', {
      conversation: conversation,
      msg: route?.params?.msg,
      senderId: user._id,
    });
    const updatedList = listConversations.map(c => {
      if (c._id === conversation._id) {
        return {...c, sentStatus: true};
      }
      return c;
    });
    console.log(updatedList);
    setConversations(updatedList);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <TextInput
          onChangeText={setKeyword}
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
        />
        <Image
          style={{position: 'absolute', left: 50, width: 24, height: 24}}
          source={require('../assets/icon/Vectorsearch.png')}
        />
      </View>
      <View>
        <View
          style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
          <FlatList
            data={listConversations}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    width: width * 0.9,
                    height: height * 0.1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: Colors.darkOrange,
                    padding: 5,
                    borderRadius: 10,
                    borderTopWidth: 0,
                    borderRightWidth: 0,
                  }}>
                  <View
                    style={{
                      width: width * 0.15,
                    }}>
                    <Image
                      source={{uri: item?.image}}
                      style={{width: 55, height: 55, borderRadius: 27.5}}
                    />
                  </View>
                  <View
                    style={{
                      width: width * 0.5,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: Colors.white,
                      }}>
                      {item.nameGroup}
                    </Text>
                  </View>
                  <View>
                    {!item.sentStatus ? (
                      <Pressable
                        onPress={() => forwardMessage(item)}
                        style={{
                          borderWidth: 1,
                          borderRadius: 10,
                          backgroundColor: Colors.primary,
                          width: 65,
                          height: 35,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 15,
                            fontWeight: '600',
                          }}>
                          {i18next.t('gui')}
                        </Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        style={{
                          borderWidth: 1,
                          borderRadius: 10,
                          backgroundColor: Colors.grey,
                          width: 65,
                          height: 35,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 15,
                            fontWeight: '600',
                          }}>
                          {i18next.t('daGui')}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForwardScreen;

const styles = StyleSheet.create({});
