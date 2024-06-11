import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import i18next from 'i18next';
import FriendApi from '../apis/FriendApi';
import {useDispatch, useSelector} from 'react-redux';
import {Icon} from 'react-native-paper';
import {addFriend, deleteFriend, fetchFriends} from '../redux/friendSlice';
import {useFocusEffect} from '@react-navigation/native';
import connectSocket from '../server/ConnectSocket';
import Icons from '../themes/Icons';
import conversationApi from '../apis/conversationApi';
import {formatOneConversation} from '../utils/formatOneConversation';
import {setCoversation} from '../redux/conversationSlice';

const FriendScreen = ({navigation, route}) => {
  const selectedLanguage = useSelector(
    state => state.language.selectedLanguage,
  );
  const user = useSelector(state => state.auth.user);
  const {width, height} = Dimensions.get('window');
  const dispatch = useDispatch();
  const listFriends = useSelector(state => state.friend.listFriends);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          dispatch(fetchFriends(user._id));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, [user._id, dispatch]),
  );

  //render khi dc accept
  useEffect(() => {
    connectSocket.on('acceptFriendRequest', data => {
      if (data) dispatch(addFriend(data));
    });
    connectSocket.on('responseDeleteFriend', data => {
      if (data) dispatch(deleteFriend(data.receiverId));
    });
    connectSocket.on('deleteFriend', data => {
      if (data) dispatch(deleteFriend(data.senderId));
    });
  }, []);

  const handleChat = async receiverId => {
    const response = await conversationApi.getOneConversation({
      sendetId: user._id,
      receiverId: receiverId,
    });
    const conversation = formatOneConversation({
      conversation: response.data,
      userId: user._id,
    });

    dispatch(setCoversation(conversation));
    navigation.navigate('ChatScreen');
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <Pressable
        onPress={() => navigation.navigate('SearchUser')}
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
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
          readOnly
        />
        <View style={{position: 'absolute', left: 50, width: 24, height: 24}}>
          {Icons.Icons({name: 'search', width: 22, height: 22})}
        </View>
      </Pressable>
      <View
        style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
        <FlatList
          data={listFriends}
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
                  borderColor: Colors.primary,
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
                    source={{uri: item.image}}
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
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.white,
                    }}>
                    {item.phone}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: width * 0.2,
                  }}>
                  <Pressable onPress={() => handleChat(item._id)}>
                    {Icons.Icons({name: 'mess', width: 32, height: 32})}
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      Alert.alert(
                        i18next.t('huyKetBan'),
                        i18next.t('xacNhanHuy'),
                        [
                          {
                            text: i18next.t('huy'),
                            style: 'cancel',
                          },
                          {
                            text: i18next.t('dongY'),
                            onPress: () => {
                              connectSocket.emit('delete friend', {
                                senderId: user._id,
                                receiverId: item._id,
                              });
                              console.log('item:', item);
                            },
                          },
                        ],
                      );
                    }}>
                    {Icons.Icons({name: 'bin', width: 32, height: 32})}
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default FriendScreen;

const styles = StyleSheet.create({});
