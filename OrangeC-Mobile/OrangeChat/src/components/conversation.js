import React from 'react';
import {View, Text, Pressable, Image, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setCoversation, setNameGroup} from '../redux/conversationSlice';

const Conversation = ({data, navigation}) => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => {
        return (
          <Pressable
            key={index}
            onPress={() => {
              // dispatch(setNameGroup(item?.nameGroup));
              dispatch(setCoversation(item));
              navigation.navigate(
                'ChatScreen',
                // , {
                //   receiverId: item?.members.filter(
                //     member => member._id !== user._id,
                //   ),
                //   conversationId: item?._id,
                //   receiverImage: item?.image,
                //   conversation: item,
                // }
              );
            }}
            style={{width: '100%', height: 70, flexDirection: 'row'}}>
            <View
              style={{
                width: '20%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 56, height: 56, borderRadius: 28}}
                source={{uri: item?.image}}
              />
              {/* online */}
              <Pressable
                style={{
                  position: 'absolute',
                  backgroundColor: 'rgba(238, 102, 25, 1)',
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: 'white',
                  bottom: 5,
                  right: 20,
                }}
              />
              {/* offline */}
              {/* <Pressable style={{
                                position: 'absolute',
                                backgroundColor: 'black',
                                width: 40,
                                height: 15,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: 'rgba(238, 102, 25, 1)',
                                bottom: 5,
                                right: 5,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{ color: 'rgba(238, 102, 25, 1)', fontSize: 8 }}>59 phút</Text>
                            </Pressable> */}
            </View>
            <View
              style={{
                width: '65%',
                height: '100%',
                justifyContent: 'center',
                paddingLeft: 10,
                gap: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                {item?.nameGroup}
              </Text>
              {typeof item.lastMessage === 'undefined' ? (
                <Text numberOfLines={1} style={{color: 'white'}}>
                  Chào mừng bạn đến với OrangeC - Nơi gắn kết bạn bè online
                </Text>
              ) : item?.lastMessage?.senderId === user._id ? (
                <Text numberOfLines={1} style={{color: 'gray'}}>
                  Bạn: {item?.lastMessage?.contentMessage}
                </Text>
              ) : (
                <Text numberOfLines={1} style={{color: 'gray'}}>
                  {item?.lastMessage?.contentMessage}
                </Text>
              )}
              {/* {
                                item?.lastMessage?.senderId === user._id
                                    ? (<Text numberOfLines={1} style={{ color: 'gray' }}>
                                        Bạn: {
                                            item?.lastMessage?.contentMessage
                                        }
                                    </Text>)
                                    : (<Text numberOfLines={1} style={{ color: 'gray' }}>
                                        {
                                            item?.lastMessage?.contentMessage
                                        }
                                    </Text>)
                            } */}
            </View>
            <View
              style={{
                width: '15%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Pressable
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: 'blue',
                  borderRadius: 7,
                }}
              />
            </View>
          </Pressable>
        );
      }}
    />
  );
};

export default Conversation;
