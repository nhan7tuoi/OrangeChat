import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../themes/Colors';
import {fetchFriends} from '../redux/friendSlice';
import i18next from 'i18next';
import connectSocket from '../server/ConnectSocket';
import {setCoversation, setNameGroup} from '../redux/conversationSlice';
import {formatConversation} from '../utils/formatConversation';
import {formatOneConversation} from '../utils/formatOneConversation';

const AddMemberGroup = ({navigation, route}) => {
  const {width, height} = Dimensions.get('window');
  const conversation = useSelector(state=>state.conversation.conversation)
  const dispatch = useDispatch();
  const listFriends = useSelector(state => state.friend.listFriends);
  const user = useSelector(state => state.auth.user);
  const [newList, setNewList] = useState([]);
  useEffect(() => {
    fetchData();
     
    setNewList(listFriends.filter(
      f => !conversation.members.some(m => m._id === f._id),
    ));
  }, []);
  const fetchData = async () => {
    try {
      dispatch(fetchFriends(user._id));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleAddMember = member => {
    connectSocket.emit('add member to group', {
      conversation: conversation,
      member: member,
    });
  };
  useEffect(() => {
    connectSocket.on('respondAdd', data => {
      
      const fConversation = formatOneConversation({
        conversation: data,
        userId: user._id,
      });

      dispatch(setCoversation(fConversation));
      navigation.navigate('ChatScreen');
    });
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <View
        style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
        <FlatList
          data={newList}
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
                    {item.name}
                  </Text>
                </View>
                <View>
                  <Pressable
                    onPress={() => handleAddMember(item)}
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
                      {i18next.t('them')}
                    </Text>
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

export default AddMemberGroup;

const styles = StyleSheet.create({});
