import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import {launchImageLibrary} from 'react-native-image-picker';
import messageApi from '../apis/messageApi';
import i18next from 'i18next';
import {useSelector, useDispatch} from 'react-redux';
import Icons from '../themes/Icons';
import {fetchFriends, setFriends} from '../redux/friendSlice';
import {
  addMember,
  removeMember,
  setCoversation,
  setMembers,
  setNameGroup,
} from '../redux/conversationSlice';
import FriendApi from '../apis/FriendApi';
import connectSocket from '../server/ConnectSocket';
import {formatConversation} from '../utils/formatConversation';
import { formatOneConversation } from '../utils/formatOneConversation';

const CreateGroupScreen = ({navigation}) => {
  const {width, height} = Dimensions.get('window');
  const [keyword, setKeyword] = useState('');
  const [groupName, setGroupName] = useState('');
  const members = useSelector(state => state.conversation.members);
  const avatarGroup = useRef(
    'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/group-user-circle.png',
  ).current;
  const listFriends = useSelector(state => state.friend.listFriends);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [temp, setTemp] = useState([]);

  //fetch data
  useEffect(() => {
    if (keyword === '') {
      fetchData();
      dispatch(setMembers([]));
    } else {
      const resultSearch = temp.filter(
        f => f.name.includes(keyword) || f.phone.includes(keyword),
      );
      console.log(resultSearch);
      dispatch(setFriends(resultSearch));
    }
  }, [navigation, keyword]);

  const fetchData = async () => {
    try {
      dispatch(fetchFriends(user._id));
      const friends = await FriendApi.getFriends({userId: user._id});
      setTemp(friends.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // listen event socket when create group
  useEffect(() => {
    connectSocket.on('newConversationGroup', data => {
      try {
        if (data.administrators.includes(user._id)) {
          const fConversation = formatOneConversation({
            conversation: data,
            userId: user._id,
          });

          dispatch(setCoversation(fConversation));
          navigation.navigate('ChatScreen');
          // dispatch(setNameGroup(temp[0].nameGroup));
          // navigation.navigate('ChatScreen', {
          //   receiverId: temp[0].members.filter(
          //     member => member._id !== user._id,
          //   ),
          //   conversationId: temp[0]._id,
          //   receiverImage: temp[0].image,
          //   conversation: temp[0],
          // });
        }
      } catch (error) {
        console.error(
          'Đã xảy ra lỗi khi chuyển đến màn hình trò chuyện:',
          error,
        );
      }
    });
  }, []);
  const onSelectAvatar = async () => {
    launchImageLibrary(
      {mediaType: 'photo', selectionLimit: 1},
      async response => {
        if (!response.didCancel) {
          const selectedImage = response.assets[0];
          try {
            const formData = new FormData();
            formData.append('image', {
              uri: selectedImage.uri,
              type: selectedImage.type,
              name: selectedImage.fileName,
            });

            try {
              const uploadResponse = await messageApi.uploadFile(formData);
              const avatarUrl = uploadResponse.data;
              if (avatarUrl) {
                console.log('avatarUrl', avatarUrl);
                avatarGroup.current = avatarUrl;
              }
            } catch (error) {
              console.error('Error uploading avatar:', error);
            }
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }
      },
    );
  };

  const handleAddMember = member => {
    dispatch(addMember(member));
    const updatedList = listFriends.map(f => {
      if (f._id === member._id) {
        return {...f, addStatus: true};
      }
      return f;
    });
    dispatch(setFriends(updatedList));
  };

  const handleRemoveMember = member => {
    dispatch(removeMember(member._id));
    const updatedList = listFriends.map(f => {
      if (f._id === member._id) {
        return {...f, addStatus: false};
      }
      return f;
    });
    dispatch(setFriends(updatedList));
  };

  const handleCreateGroup = () => {
    let tempMembers = members.map(m => m._id);
    tempMembers = [...tempMembers, user._id];
    connectSocket.emit('create new conversation', {
      nameGroup: groupName,
      isGroup: true,
      administrators: [user._id],
      members: tempMembers,
      image: avatarGroup,
    });
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: Colors.backgroundChat, padding: 10}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Pressable
          onPress={() => onSelectAvatar()}
          style={{width: 70, height: 70, borderRadius: 35}}>
          <Image
            source={{
              uri: avatarGroup,
            }}
            style={{width: 70, height: 70, borderRadius: 35}}
          />
        </Pressable>
        <TextInput
          onChangeText={setGroupName}
          style={{
            borderBottomWidth: 2,
            borderColor: Colors.primary,
            width: '80%',
            fontSize: 20,
          }}
          placeholder={i18next.t('datTenNhom')}
        />
      </View>
      <View
        style={{
          marginTop: 20,
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <FlatList
          data={members}
          horizontal={true}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  position: 'relative',
                }}>
                <Image
                  source={{uri: item?.image}}
                  style={{width: 55, height: 55, borderRadius: 27.5}}
                />
                <Pressable
                  onPress={() => handleRemoveMember(item)}
                  style={{
                    position: 'absolute',
                    left: 50,
                    top: 10,
                    borderRadius: 10,
                    backgroundColor: Colors.white,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {Icons.Icons({name: 'denied', width: 12, height: 12})}
                </Pressable>
              </View>
            );
          }}
        />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        {members.length > 1 ? (
          <Pressable
            onPress={() => handleCreateGroup()}
            style={{
              width: width * 0.5,
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: Colors.primary,
              height: 35,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 16, fontWeight: '600', color: Colors.white}}>
              {i18next.t('tao')}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={{
              width: width * 0.5,
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: Colors.primary,
              height: 35,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.3,
            }}>
            <Text
              style={{fontSize: 16, fontWeight: '600', color: Colors.white}}>
              {i18next.t('tao')}
            </Text>
          </Pressable>
        )}
      </View>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TextInput
          onChangeText={setKeyword}
          style={{
            width: '100%',
            borderWidth: 1,
            backgroundColor: Colors.grey,
            borderRadius: 10,
            paddingLeft: 40,
            fontSize: 18,
          }}
          placeholder={i18next.t('nhapSoDienThoaiHoacTen')}
        />
        <View style={{position: 'absolute', left: 10, width: 24, height: 24}}>
          {Icons.Icons({name: 'search', width: 22, height: 22})}
        </View>
      </View>
      <View
        style={{marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
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
                {!item.addStatus ? (
                  <Pressable
                    onPress={() => handleAddMember(item)}
                    style={{
                      alignItems: 'center',
                      width: width * 0.2,
                      borderWidth: 1,
                      borderRadius: 10,
                      backgroundColor: Colors.primary,
                      height: 35,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: Colors.white,
                        fontWeight: '600',
                      }}>
                      {i18next.t('them')}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => handleRemoveMember(item)}
                    style={{
                      alignItems: 'center',
                      width: width * 0.2,
                      borderWidth: 1,
                      borderRadius: 10,
                      backgroundColor: Colors.primary,
                      height: 35,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: Colors.white,
                        fontWeight: '600',
                      }}>
                      {i18next.t('loaiBo')}
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateGroupScreen;

const styles = StyleSheet.create({});
