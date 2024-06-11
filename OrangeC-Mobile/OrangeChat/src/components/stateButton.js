import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {deleteFriend, deleteFriendRequest} from '../redux/friendSlice';
import {Icon} from 'react-native-paper';
import Colors from '../themes/Colors';
import connectSocket from '../server/ConnectSocket';
import Icons from '../themes/Icons';
import i18next from 'i18next';
import conversationApi from '../apis/conversationApi';
import {formatOneConversation} from '../utils/formatOneConversation';
import {setCoversation} from '../redux/conversationSlice';
import {useNavigation} from '@react-navigation/native';

const StateButton = props => {
  const {width, height} = Dimensions.get('window');
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const sendFriendRequest = receiverId => {
    console.log(receiverId);
    const requestData = {
      senderId: user._id,
      receiverId: receiverId,
    };
    connectSocket.emit('send friend request', requestData);
  };
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
  if (!props.listFriends.find(f => f._id === props.itemId)) {
    if (props.listFriendRequests.find(fq => fq.senderId === props.itemId)) {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width * 0.2,
          }}>
          <Pressable
            onPress={() => {
              const fq = props.listFriendRequests.find(
                fq => fq.senderId === props.itemId,
              );
              if (fq) {
                // FriendApi.reject({friendRequestId: fq._id});
                connectSocket.emit('reject friend request', fq);
                dispatch(deleteFriendRequest(fq._id));
                props.onPressButton();
              }
            }}>
            {Icons.Icons({name: 'denied', width: 22, height: 22})}
          </Pressable>
          <Pressable
            onPress={() => {
              const fq = props.listFriendRequests.find(
                fq => fq.senderId === props.itemId,
              );
              if (fq) {
                // FriendApi.accept({friendRequestId: fq._id});
                connectSocket.emit('accept friend request', fq);
                connectSocket.emit('create new conversation', {
                  nameGroup: '',
                  isGroup: false,
                  members: [user._id, fq.senderId],
                });
                dispatch(deleteFriendRequest(fq._id));
                props.onPressButton();
              }
            }}>
            {Icons.Icons({name: 'check', width: 30, height: 30})}
          </Pressable>
        </View>
      );
    }
    if (
      props.listFriendRequests.find(
        fq => fq.senderId === user._id && fq.receiverId === props.itemId,
      )
    ) {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width * 0.1,
          }}>
          <Pressable
            onPress={() => {
              const fq = props.listFriendRequests.find(
                fq =>
                  fq.senderId === user._id && fq.receiverId === props.itemId,
              );
              if (fq) {
                connectSocket.emit('reject friend request', fq);
                props.onPressButton();
              }
            }}>
            {Icons.Icons({name: 'userCheck', width: 32, height: 32})}
          </Pressable>
        </View>
      );
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: width * 0.1,
        }}>
        <Pressable
          onPress={async () => {
            await sendFriendRequest(props.itemId);
            props.onPressButton();
          }}>
          {Icons.Icons({name: 'userPlus', width: 32, height: 32})}
        </Pressable>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: width * 0.2,
        }}>
        <Pressable onPress={() => handleChat(props.itemId)}>
          {Icons.Icons({name: 'mess', width: 32, height: 32})}
        </Pressable>
        <Pressable
          onPress={() => {
            Alert.alert(i18next.t('huyKetBan'), i18next.t('xacNhanHuy'), [
              {
                text: i18next.t('huy'),
                style: 'cancel',
              },
              {
                text: i18next.t('dongY'),
                onPress: () => {
                  connectSocket.emit('delete friend', {
                    senderId: user._id,
                    receiverId: props.itemId,
                  });
                  dispatch(deleteFriend(props.itemId));
                },
              },
            ]);
          }}>
          {Icons.Icons({name: 'bin', width: 32, height: 32})}
        </Pressable>
      </View>
    );
  }
};

export default StateButton;

const styles = StyleSheet.create({});
