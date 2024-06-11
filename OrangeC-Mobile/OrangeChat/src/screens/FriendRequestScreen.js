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
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import i18next from 'i18next';
import FriendApi from '../apis/FriendApi';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-native-paper';
import {
  addFriend,
  addFriendRequests,
  deleteFriendRequest,
  fetchFriendRequests,
} from '../redux/friendSlice';
import { useFocusEffect } from '@react-navigation/native';
import connectSocket from '../server/ConnectSocket';
import Icons from '../themes/Icons';

const FriendRequestScreen = ({ navidation, route }) => {
  const selectedLanguage = useSelector(
    state => state.language.selectedLanguage,
  );
  const user = useSelector(state => state.auth.user);
  const { width, height } = Dimensions.get('window');
  const dispatch = useDispatch();
  const listFriendRequests = useSelector(
    state => state.friend.listFriendRequests,
  );
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          dispatch(fetchFriendRequests(user._id));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, []),
  );
  //render
  useEffect(() => {
    connectSocket.on('newFriendRequest', data => {
      console.log('data: ' + data);
      dispatch(addFriendRequests(data));
    });
    connectSocket.on('rejectFriendRequest', data => {
      console.log(data);
      if (data) dispatch(deleteFriendRequest(data._id));
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
      <View
        style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <FlatList
          data={listFriendRequests}
          renderItem={({ item }) => {
            console.log(listFriendRequests);

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
                    source={{ uri: item?.senderId?.image }}
                    style={{ width: 55, height: 55, borderRadius: 27.5 }}
                  />
                </View>
                <View
                  style={{
                    width: width * 0.5,
                  }}>
                  <Text
                    style={{ fontSize: 16, fontWeight: '700', color: 'white' }}>
                    {item?.senderId?.name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: width * 0.2,
                  }}>
                  <Pressable
                    onPress={() => {
                      connectSocket.emit('reject friend request', item);
                      dispatch(deleteFriendRequest(item?._id));
                    }}>
                    {Icons.Icons({ name: 'denied', width: 22, height: 22 })}
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      connectSocket.emit('accept friend request', item);
                      dispatch(deleteFriendRequest(item?._id));
                    }}>
                    {Icons.Icons({ name: 'check', width: 30, height: 30 })}
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

export default FriendRequestScreen;

const styles = StyleSheet.create({});
