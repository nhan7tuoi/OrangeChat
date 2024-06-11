import {
  Alert,
  Animated,
  Button,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import i18next from 'i18next';
import {useDispatch, useSelector} from 'react-redux';
import conversationApi from '../apis/conversationApi';
import {launchImageLibrary} from 'react-native-image-picker';
import messageApi from '../apis/messageApi';
import connectSocket from '../server/ConnectSocket';
import {setCoversation, setNameGroup} from '../redux/conversationSlice';
import {formatOneConversation} from '../utils/formatOneConversation';

const InforGroupScreen = ({navigation, route}) => {
  const conversation = useSelector(state => state.conversation.conversation);
  const avatarGroup = useRef(conversation.image).current;
  const user = useSelector(state => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [optionVisible, setOptionVisible] = useState(false);
  const [newName, setNewName] = useState(conversation.nameGroup);
  const dispatch = useDispatch();
  const [showFlatList, setShowFlatList] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const mem = useRef({}).current;
  //bat event socket
  useEffect(() => {
    connectSocket.on('updateConversation', data => {
      if (conversation._id === data._id) {
        const temp = formatOneConversation({
          conversation: data,
          userId: user._id,
        });
        dispatch(setCoversation(temp));
      }
    });
    connectSocket.on('removeMember', data => {
      if (conversation._id === data.conversation._id) {
        const temp = formatOneConversation({
          conversation: data.conversation,
          userId: user._id,
        });
        console.log("test remove");
        dispatch(setCoversation(temp));
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
                const response = await conversationApi.uploadAvatar({
                  conversationId: conversation._id,
                  image: avatarUrl,
                });
                const temp = formatOneConversation({
                  conversation: response.data,
                  userId: user._id,
                });
                dispatch(setCoversation(temp));
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
  const handleChangeName = () => {
    connectSocket.emit('change name group', {
      conversation: conversation,
      newName: newName,
    });
    setModalVisible(false);
  };

  const handleShowMembers = () => {
    setShowFlatList(!showFlatList);
    Animated.timing(slideAnimation, {
      toValue: showFlatList ? 0 : 50,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleGrantAdmin = () => {
    connectSocket.emit('grant admin', {
      conversation: conversation,
      member: mem.current,
    });
    setOptionVisible(false);
  };
  const handleRevokeAdmin = () => {
    connectSocket.emit('revoke admin', {
      conversation: conversation,
      member: mem.current,
    });
    setOptionVisible(false);
  };
  const handleRemoveMember = () => {
    connectSocket.emit('remove member', {
      conversation: conversation,
      member: mem.current,
    });
    setOptionVisible(false);
  };
  const handleDisband = () => {
    Alert.alert(i18next.t('thongBao'), i18next.t('xacNhanGiaiTan'), [
      {
        text: i18next.t('huy'),
        style: 'cancel',
      },
      {
        text: i18next.t('dongY'),
        onPress: () => {
          connectSocket.emit('disband the group', conversation);
        },
      },
    ]);
  };
  const handleLeave = () => {
    Alert.alert(i18next.t('thongBao'), i18next.t('xacNhanRoi'), [
      {
        text: i18next.t('huy'),
        style: 'cancel',
      },
      {
        text: i18next.t('dongY'),
        onPress: () => {
          if (
            conversation.administrators?.length > 1 ||
            !conversation.administrators?.includes(user._id)
          ) {
            connectSocket.emit('remove member', {
              conversation: conversation,
              member: user,
            });
            // dispatch(setCoversation({}));
            navigation.navigate('Nhom');
          } else {
            Alert.alert(i18next.t('thongBao'), i18next.t('dieuKienRoi'), [
              {
                text: i18next.t('dongY'),
                style: 'cancel',
              },
            ]);
          }
        },
      },
    ]);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 20,
          paddingBottom: 20,
        }}>
        <Pressable onPress={() => onSelectAvatar()}>
          <Image
            source={{uri: avatarGroup}}
            style={{width: 100, height: 100, borderRadius: 50}}
          />
          <View style={{position: 'absolute', right: 0, bottom: 5}}>
            {Icons.Icons({name: 'camera', width: 20, height: 20})}
          </View>
        </Pressable>
        <View>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 17,
                color: Colors.white,
                borderBottomWidth: 1,
                borderBottomColor: Colors.primary,
                padding: 5,
                fontWeight: '700',
              }}>
              {newName}
            </Text>
            {Icons.Icons({name: 'edit', width: 30, height: 30})}
          </Pressable>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  backgroundColor: Colors.grey,
                  borderRadius: 20,
                  width: '80%',
                  padding: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 5,
                }}>
                <TextInput
                  placeholder="Nhập tên mới"
                  onChangeText={setNewName}
                  value={newName}
                  style={{
                    width: '100%',
                    marginBottom: 20,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    fontSize: 16,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: 200,
                  }}>
                  <Pressable
                    style={{
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: Colors.primary,
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      setModalVisible(false);
                      setNewName(conversation.nameGroup);
                    }}>
                    <Text>{i18next.t('huy')}</Text>
                  </Pressable>
                  <Pressable
                    style={{
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: Colors.primary,
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onPress={() => handleChangeName()}>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>
                      {i18next.t('dongY')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View>
        <Pressable
          onPress={() => {
            navigation.navigate('AddMember', conversation);
          }}
          style={{
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderColor: Colors.grey,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <View style={{width: '10%'}}>
            {Icons.Icons({name: 'addMember', width: 28, height: 28})}
          </View>
          <Text
            style={{
              fontSize: 16,
              color: Colors.white,
              fontWeight: '600',
              width: '90%',
            }}>
            {i18next.t('themThanhVien')}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleShowMembers}
          style={{
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderColor: Colors.grey,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <View style={{width: '10%'}}>
            {Icons.Icons({name: 'group', width: 30, height: 30})}
          </View>
          <Text
            style={{
              fontSize: 16,
              color: Colors.white,
              fontWeight: '600',
              width: '90%',
            }}>
            {i18next.t('xemThanhVien')}
          </Text>
        </Pressable>
        <View>
          <FlatList
            data={conversation.members}
            // horizontal={true}
            renderItem={({item}) => {
              return (
                <Pressable
                  onLongPress={() => {
                    if (
                      conversation.administrators?.includes(user._id) &&
                      item._id !== user._id
                    ) {
                      mem.current = item;
                      setOptionVisible(true);
                    }
                  }}>
                  <Animated.View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Animated.Image
                      source={{uri: item.image}}
                      style={{
                        margin: slideAnimation.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, 5],
                        }),
                        width: slideAnimation,
                        height: slideAnimation,
                        borderRadius: 25,
                      }}
                    />
                    <Animated.Text
                      style={{
                        lineHeight: slideAnimation,
                        textAlignVertical: 'center',
                        fontSize: 16,
                        color: Colors.white,
                        fontWeight: '600',
                      }}>
                      {item.name}
                    </Animated.Text>

                    {conversation.administrators?.includes(item._id) ? (
                      <Animated.Text
                        style={{
                          lineHeight: slideAnimation,
                          textAlignVertical: 'center',
                          paddingLeft: 20,
                          color: Colors.primary,
                        }}>
                        Admin
                      </Animated.Text>
                    ) : null}
                    {item._id === user._id ? (
                      <Animated.Text
                        style={{
                          lineHeight: slideAnimation,
                          textAlignVertical: 'center',
                          paddingLeft: 20,
                          color: Colors.primary,
                        }}>
                        {i18next.t('ban')}
                      </Animated.Text>
                    ) : null}
                  </Animated.View>
                </Pressable>
              );
            }}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={optionVisible}
          onRequestClose={() => {
            setOptionVisible(false);
          }}>
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: Colors.grey,
                borderRadius: 10,
                width: '100%',
                elevation: 5,
              }}>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  width: '100%',
                  height: 40,
                  paddingRight: 10,
                  backgroundColor: Colors.primary,
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  marginBottom: 5,
                }}>
                <Pressable onPress={() => setOptionVisible(false)}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '800',
                      color: Colors.white,
                      width: 30,
                      height: 30,
                      borderWidth: 2,
                      borderColor: Colors.white,
                      textAlign: 'center',
                    }}>
                    X
                  </Text>
                </Pressable>
              </View>
              <View>
                {conversation.administrators?.includes(mem.current?._id) ? (
                  <Pressable
                    onPress={() => {
                      handleRevokeAdmin();
                    }}
                    style={{
                      padding: 20,
                      marginBottom: 5,
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: Colors.primary,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: Colors.white,
                      }}>
                      {i18next.t('goAdmin')}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      handleGrantAdmin();
                    }}
                    style={{
                      padding: 20,
                      marginBottom: 5,
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: Colors.primary,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: Colors.white,
                      }}>
                      {i18next.t('chiDinh')}
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  onPress={() => handleRemoveMember()}
                  style={{
                    padding: 20,
                    marginBottom: 5,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: Colors.primary,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: Colors.white,
                    }}>
                    {i18next.t('xoa')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Pressable
          onPress={() => {
            navigation.navigate('FileNavigation', conversation);
          }}
          style={{
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderColor: Colors.grey,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <View style={{width: '10%'}}>
            {Icons.Icons({name: 'fileGroup', width: 30, height: 30})}
          </View>
          <Text
            style={{
              fontSize: 16,
              color: Colors.white,
              fontWeight: '600',
              width: '90%',
            }}>
            {i18next.t('media')}
          </Text>
        </Pressable>
        {conversation.administrators.find(m => m === user._id) ? (
          <Pressable
            onPress={() => handleDisband()}
            style={{
              borderTopWidth: 2,
              borderBottomWidth: 2,
              borderColor: Colors.grey,
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <View style={{width: '10%'}}>
              {Icons.Icons({name: 'removeGroup', width: 30, height: 30})}
            </View>
            <Text
              style={{
                fontSize: 16,
                color: Colors.white,
                fontWeight: '600',
                width: '90%',
              }}>
              {i18next.t('giaiTan')}
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={() => handleLeave()}
          style={{
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderColor: Colors.grey,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <View style={{width: '10%'}}>
            {Icons.Icons({name: 'leaveGroup', width: 30, height: 30})}
          </View>
          <Text
            style={{
              fontSize: 16,
              color: Colors.white,
              fontWeight: '600',
              width: '90%',
            }}>
            {i18next.t('roiNhom')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default InforGroupScreen;

const styles = StyleSheet.create({});
