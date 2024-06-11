import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  ImageBackground,
  ScrollView,
  Keyboard,
  Animated,
  ActivityIndicator,
  Alert,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutogrowInput from 'react-native-autogrow-input';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import connectSocket from '../server/ConnectSocket';
import { useSelector, useDispatch } from 'react-redux';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { setConversations, setCoversation } from '../redux/conversationSlice';
import conversationApi from '../apis/conversationApi';
import messageApi from '../apis/messageApi';
import FirstMessage from '../components/firstMessage';
import TextMessage from '../components/textMessage';
import ImageMessage from '../components/imageMessage';
import FileMessage from '../components/fileMessage';
import VideoMessage from '../components/videoMessage';
import i18next from '../i18n/i18n';
import EmojiPicker, { vi } from 'rn-emoji-keyboard';
import StickerMessage from '../components/stickerMessage';
import NotificationRemove from '../components/notificationRemove';
import NotificationLeave from '../components/notificationLeave';
import NotificationAdd from '../components/notificationAdd';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ChatScreen = ({ navigation, route }) => {
  const selectedLanguage = useSelector(
    state => state.language.selectedLanguage,
  );
  const stickerData = useSelector(state => state.sticker.stickers);
  console.log('sticker', stickerData);
  // const receiverName = useSelector(state => state.conversation.nameGroup);
  // const {receiverId, conversationId, receiverImage, conversation} =
  //   route.params;
  const user = useSelector(state => state.auth.user);
  const conversation = useSelector(state => state.conversation.conversation);
  const receiverId = conversation.members?.filter(
    member => member._id !== user._id,
  );
  const conversationId = conversation._id;
  const receiverImage = conversation.image;
  const receiverName = conversation.nameGroup;
  const scrollViewRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const dispatch = useDispatch();
  const userId = user._id;
  const showGif = useRef(new Animated.Value(0)).current;
  const showPress = useRef(new Animated.Value(0)).current;
  const sumReaction = useRef(new Animated.Value(0)).current;
  const [showReactionIndex, setShowReactionIndex] = useState(-1);
  const [reactionMsg, setReactionMsg] = useState({});
  const [hasPerformedAction, setHasPerformedAction] = useState(false);
  const [itemSelected, setItemSelected] = useState({});
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [isShowReCall, setIsShowReCall] = useState(false);
  const [selectedPack, setSelectedPack] = useState(stickerData[0]);
  const [msgReply, setMsgReply] = useState(null);

  // Get Messages
  useEffect(() => {
    getLastMessage();
    console.log('fetch message');
  }, []);

  useEffect(() => {
    if (typeof conversation._id !== 'undefined') {
    } else {
    }
  }, [conversation]);

  const getLastMessage = async () => {
    const response = await messageApi.getMessage({
      conversationId: conversationId,
    });
    if (response) {
      setMessages(response.data);
    }
  };

  // Get conversation
  const getConversation = async () => {
    try {
      const response = await conversationApi.getConversation({
        userId: user._id,
      });

      if (response) {
        console.log('update');
        dispatch(setConversations(response.data));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // Format thời gian
  const formatTime = time => {
    const options = { hour: 'numeric', minute: 'numeric' };
    return new Date(time).toLocaleString('en-US', options);
  };

  //Cuộn xuống cuối
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollToBottom();
    }
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollToBottom();
      },
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  // Hàm xử lý sự kiện cuộn của ScrollView (bug chưa fix)
  const handleScroll = event => {
    const { contentOffset } = event.nativeEvent;
    const distanceToEnd = contentOffset.y;

    // Kiểm tra nếu người dùng đã cuộn đến cuối danh sách, không có dữ liệu đang được tải và chưa thực hiện hành động
    if (distanceToEnd < 20 && !isLoading && !hasPerformedAction) {
      // Gửi yêu cầu tải thêm dữ liệu
      console.log('load more');
      loadMoreMessages();
      // Đặt biến trạng thái để chỉ ra rằng hành động đã được thực hiện
      setHasPerformedAction(true);
    }
  };
  const loadMoreMessages = async () => {
    try {
      setIsLoading(true);
      // Thực hiện yêu cầu tải thêm dữ liệu từ máy chủ
      const response = await messageApi.getMoreMessage({
        conversationId: conversationId,
      });
      if (response) {
        // Thêm tin nhắn mới vào cuối danh sách tin nhắn hiện tại
        setMessages(prevMessages => [...response.data, ...prevMessages]);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      // Cập nhật trạng thái isLoading sau khi nhận phản hồi từ máy chủ
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // Reset biến trạng thái khi component mất khỏi màn hình
    return () => {
      setHasPerformedAction(false);
    };
  }, []);

  // Đóng mở emoji
  const handleEmoji = () => {
    setIsOpenEmoji(!isOpenEmoji);
  };

  // Open Sickers và Other
  const showIcon = () => {
    Animated.timing(showGif, {
      toValue: 300,
      duration: 100,
      useNativeDriver: false,
    }).start(() => {
      scrollToBottom();
    });
  };
  const hideIcon = () => {
    console.log('hide');
    Animated.timing(showGif, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };
  const showPressOther = () => {
    Animated.timing(showPress, {
      toValue: 70,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  const hidePressOther = () => {
    Animated.timing(showPress, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const showSumReaction = () => {
    Animated.timing(sumReaction, {
      toValue: 200,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const hideSumReaction = () => {
    Animated.timing(sumReaction, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };


  const selectStickerPack = pack => {
    setSelectedPack(pack);
  };

  //- show recall
  const showReCall = isShowReCall => {
    setIsShowReCall(isShowReCall);
  };

  // Xử lý tin nhắn gửi lên
  //- set tin nhắn
  const handleInputText = text => {
    setInputMessage(text);
  };
  //- gửi tin nhắn lên Socket
  const sendMessage = message => {
    connectSocket.emit('chat message', message);
    getConversation();
  };
  //- gửi tin nhắn TEXT
  const onSend = () => {
    if (!inputMessage.trim()) {
      return;
    }
    const newMessage = {
      conversationId: conversationId,
      senderId: userId,
      receiverId: receiverId,
      type: 'text',
      contentMessage: inputMessage,
      urlType: '',
      createAt: new Date(),
      deleteBy: [],
      reaction: [],
      isSeen: false,
      isReceive: false,
      isSend: false,
      isRecall: false,
      reply: msgReply
    };
    console.log('text', newMessage.reply);
    setInputMessage('');
    sendMessage(newMessage);
    setMsgReply(null);
  };
  // - gửi tin nhắn STICKER
  const onSendSticker = url => {
    const newMessage = {
      conversationId: conversationId,
      senderId: userId,
      receiverId: receiverId,
      type: 'sticker',
      urlType: url,
      createAt: new Date(),
      deleteBy: [],
      reaction: [],
      isSeen: false,
      isReceive: false,
      isSend: false,
      isRecall: false,
      reply: msgReply
    };
    sendMessage(newMessage);
    setMsgReply(null);
  };
  // - gửi tin nhắn IMAGE + VIDEO
  const onSelectImage = async () => {
    launchImageLibrary(
      { mediaType: 'mixed', selectionLimit: 10 },
      async response => {
        if (!response.didCancel) {
          const selectedImages = [];
          let uploadedCount = 0; // Biến đếm số lượng hình ảnh đã tải lên

          try {
            await Promise.all(
              response.assets.map(async image => {
                const formData = new FormData();
                formData.append('image', {
                  uri: image.uri,
                  type: image.type,
                  name: image.fileName,
                });

                try {
                  const uploadResponse = await messageApi.uploadImage(formData);
                  const imageUrl = uploadResponse.data;
                  selectedImages.push(imageUrl);
                  console.log(uploadResponse.data);
                  uploadedCount++; // Tăng giá trị biến đếm sau khi tải lên thành công

                  // Kiểm tra xem đã tải lên tất cả các hình ảnh chưa
                  if (uploadedCount === response.assets.length) {
                    const newMessage = {
                      conversationId: conversationId,
                      senderId: userId,
                      receiverId: receiverId,
                      type: image.type === 'video/mp4' ? 'video' : 'image',
                      urlType: selectedImages,
                      createAt: new Date(),
                      deleteBy: [],
                      reaction: [],
                      isSeen: false,
                      isReceive: false,
                      isSend: false,
                      reply: msgReply
                    };
                    console.log('anh', newMessage);
                    sendMessage(newMessage);
                    setMsgReply(null);
                  }
                } catch (error) {
                  console.error('Error uploading image:', error);
                }
              }),
            );
          } catch (error) {
            console.error('Error processing images:', error);
          }
        }
      },
    );
  };
  // - gửi tin nhắn FILE
  const onSelectFile = async () => {
    try {
      const res = await DocumentPicker.pick();
      const formData = new FormData();
      formData.append('image', {
        uri: res[0].uri,
        type: res[0].type,
        name: res[0].name,
      });
      console.log(formData.getAll('image'));
      const fileUrl = await messageApi.uploadFile(formData);
      const newMessage = {
        conversationId: conversationId,
        senderId: userId,
        receiverId: receiverId,
        type: 'file',
        urlType: fileUrl.data,
        createAt: new Date(),
        isDeleted: false,
        reaction: [],
        isSeen: false,
        isReceive: false,
        isSend: false,
        typeFile: res[0].type,
        fileName: res[0].name,
        reply: msgReply
      };
      console.log('file', newMessage);
      sendMessage(newMessage);
      setMsgReply(null);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Hủy chọn tệp');
      } else {
        console.log('Lỗi khi chọn tệp: ' + err);
      }
    }
  };

  // Tải xuống và mở file
  const downloadAndOpenFile = async fileUrl => {
    try {
      const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
      const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const options = {
        fromUrl: fileUrl,
        toFile: localFilePath,
      };

      const download = RNFS.downloadFile(options);
      download.promise
        .then(response => {
          if (response.statusCode === 200) {
            // Mở tệp sau khi tải xuống hoàn tất
            FileViewer.open(localFilePath, { showOpenWithDialog: true })
              .then(() => console.log('File opened successfully'))
              .catch(error => console.error('Error opening file:', error));
          } else {
            Alert.alert('Download failed', `Failed to download ${fileName}`);
          }
        })
        .catch(error => console.error('Error downloading file:', error));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Reaction message
  //- Lấy index message
  const toggleReaction = index => {
    if (showReactionIndex === index) {
      setShowReactionIndex(-1);
    } else {
      setShowReactionIndex(index);
      console.log('index', index);
    }
  };
  //- send reaction lên socket
  const onSelectReaction = (index, reaction) => {
    connectSocket.emit('reaction message', {
      messageId: index,
      userId: user._id,
      reactType: reaction,
      receiverId: receiverId,
      conversationId: conversationId,
    });
    setShowReactionIndex(-1);
  };

  // Thu hồi tin nhắn
  const recallMessage = messageId => {
    console.log('recall message', itemSelected);
    hidePressOther();
    connectSocket.emit('recall message', {
      messageId: messageId,
      conversationId: conversationId,
    });
    getConversation();
  };

  // Xóa tin nhắn
  const deleteMessage = messageId => {
    console.log('delete message', itemSelected);
    hidePressOther();
    connectSocket.emit('delete message', {
      messageId: messageId,
      conversationId: conversationId,
      userDelete: user._id,
    });
    getConversation();
  };

  // Xử lý tin nhắn reply
  const replyMessage = message => {
    setMsgReply(message);
    console.log('reply', msgReply);
    hidePressOther();
  };

  // Update data từ Socket gửi về
  useEffect(() => {
    connectSocket.on('chat message', msg => {
      if (msg.conversationId === conversationId) {
        console.log('new message', msg);
        setMessages(preMessage => [...preMessage, msg]);
      }
    });
    connectSocket.on('reaction message', async reaction => {
      console.log('reaction message', reaction.messageId, reaction.reactType);
      const newMessages = messages.map(message => {
        if (message._id === reaction.messageId) {
          message.reaction = [{ type: reaction.reactType }];
        }
        return message;
      });
      getLastMessage();
    });
    connectSocket.on('recall message', msg => {
      console.log('recall message', msg);
      if (msg.conversationId === conversationId) {
        const newMessages = messages.map(message => {
          if (message._id === msg.messageId) {
            message.isRecall = true;
          }
          return message;
        });
        getLastMessage();
      }
    });
    connectSocket.on('delete message', msg => {
      console.log('delete message', msg);
      if (msg.conversationId === conversationId) {
        const newMessages = messages.map(message => {
          if (message._id === msg.messageId) {
            message.deleteBy = [{ userDelete: msg.userDelete }];
          }
          return message;
        });
        getLastMessage();
      }
    });
    connectSocket.on('removeMember', data => {
      setMessages(preMessage => [...preMessage, data.notification]);
    });
    connectSocket.on('addMember', data => {
      setMessages(preMessage => [...preMessage, data]);
    });
    connectSocket.on('deletedMember', data => {
      if (conversation._id === data._id) {
        Alert.alert(i18next.t('thongBao'), i18next.t('biXoa'), [
          {
            text: i18next.t('dongY'),
            onPress: () => {
              if (conversation.isGroup) navigation.navigate('Nhom');
              else navigation.navigate('CaNhan');
            },
          },
        ]);
      }
    });
    connectSocket.on('disbandGroup', data => {
      if (data._id === conversation._id) {
        Alert.alert(i18next.t('thongBao'), i18next.t('khongTonTai'), [
          {
            text: i18next.t('dongY'),
            style: 'cancel',
          },
        ]);
        // dispatch(setCoversation({}));
        if (conversation.isGroup) navigation.navigate('Nhom');
        else navigation.navigate('CaNhan');
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
      {/* header */}
      <View
        style={{
          height: windowHeight * 0.1,
          flexDirection: 'row',
          backgroundColor: Colors.black,
        }}>
        <View
          style={{
            width: '10%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Pressable
            onPress={() => {
              dispatch(setCoversation({}));
              if (conversation.isGroup) navigation.navigate('Nhom');
              else navigation.navigate('CaNhan');
            }}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {Icons.Icons({ name: 'iconBack', width: 16, height: 24 })}
          </Pressable>
        </View>
        <View style={{ width: '50%', height: '100%', flexDirection: 'row' }}>
          <View
            style={{
              width: '40%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{ width: 54, height: 54, borderRadius: 26 }}
              source={{ uri: receiverImage }}
            />
            <Pressable
              style={{
                position: 'absolute',
                backgroundColor: Colors.primary,
                width: 12,
                height: 12,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: Colors.white,
                bottom: 14,
                right: 20,
              }}
            />
          </View>
          <View
            style={{ width: '70%', height: '100%', justifyContent: 'center' }}>
            <Text
              numberOfLines={2}
              style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold' }}>
              {receiverName}
            </Text>
            <Text style={{ color: Colors.grey, fontSize: 12 }}>
              Đang hoạt động
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '40%',
            height: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingLeft: 30,
          }}>
          <Pressable
            onPress={() => {
              handleEmoji();
            }}
            style={{ width: '20%' }}>
            {Icons.Icons({ name: 'iconCall', width: 22, height: 22 })}
          </Pressable>
          <Pressable style={{ width: '20%' }}>
            {Icons.Icons({ name: 'iconVideoCall', width: 22, height: 22 })}
          </Pressable>
          <Pressable
            onPress={() => {
              conversation.isGroup
                ? navigation.navigate('InforGroup', conversation)
                : null;
            }}
            style={{ width: '20%' }}>
            {Icons.Icons({ name: 'iconOther', width: 22, height: 22 })}
          </Pressable>
        </View>
      </View>
      {/* body */}
      <Pressable
        style={{ flex: 8, backgroundColor: Colors.backgroundChat }}
        onPress={() => {
          hideIcon();
          setShowReactionIndex(-1);
          hidePressOther();
          setIsShowReCall(false);
          setItemSelected({});
          hideSumReaction();
        }}>
        {/* <ImageBackground
                    source={require('../assets/image/anh2.jpg')}
                    style={{ flex: 1 }}> */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}
          onContentSizeChange={handleContentSizeChange}
        // onScroll={handleScroll}
        // scrollEventThrottle={16}
        >
          {isLoading && <ActivityIndicator color={Colors.primary} size={32} />}

          {messages.map((item, index) => {
            if (item.type === 'first') {
              return <FirstMessage item={item} key={index} />;
            }
            if (item.type === 'notificationRemove') {
              return <NotificationRemove item={item} key={index} />;
            }
            if (item.type === 'notificationLeave') {
              return <NotificationLeave item={item} key={index} />;
            }
            if (item.type === 'notificationAdd') {
              return <NotificationAdd item={item} key={index} />;
            }
            if (
              item.type === 'text' &&
              (item.deleteBy?.length == 0 ||
                item.deleteBy?.find(f => f !== user._id))
            ) {
              return (
                <TextMessage
                  key={index}
                  item={item}
                  formatTime={formatTime}
                  toggleReaction={toggleReaction}
                  userId={user._id}
                  onSelectReaction={onSelectReaction}
                  showReactionIndex={showReactionIndex}
                  receiverImage={item.senderId.image}
                  showPressOther={showPressOther}
                  setItemSelected={setItemSelected}
                  showReCall={showReCall}
                  isShowReCall={isShowReCall}
                  conversation={conversation}
                  setReactionMsg={setReactionMsg}
                  showSumReaction={showSumReaction}
                  hideSumReaction={hideSumReaction}
                />
              );
            }

            if (
              item.type === 'image' &&
              (item.deleteBy?.length == 0 ||
                item.deleteBy?.find(f => f !== user._id))
            ) {
              return (
                <ImageMessage
                  key={index}
                  item={item}
                  userId={userId}
                  receiverImage={item.senderId.image}
                  toggleReaction={toggleReaction}
                  onSelectReaction={onSelectReaction}
                  showReactionIndex={showReactionIndex}
                  showPressOther={showPressOther}
                  setItemSelected={setItemSelected}
                  showReCall={showReCall}
                  isShowReCall={isShowReCall}
                  conversation={conversation}
                  setReactionMsg={setReactionMsg}
                  showSumReaction={showSumReaction}
                  hideSumReaction={hideSumReaction}
                />
              );
            }
            if (
              item.type === 'file' &&
              (item.deleteBy?.length == 0 ||
                item.deleteBy?.find(f => f !== user._id))
            ) {
              return (
                <FileMessage
                  key={index}
                  item={item}
                  userId={userId}
                  receiverImage={item.senderId.image}
                  toggleReaction={toggleReaction}
                  downloadAndOpenFile={downloadAndOpenFile}
                  onSelectReaction={onSelectReaction}
                  showReactionIndex={showReactionIndex}
                  showPressOther={showPressOther}
                  setItemSelected={setItemSelected}
                  showReCall={showReCall}
                  isShowReCall={isShowReCall}
                  conversation={conversation}
                  setReactionMsg={setReactionMsg}
                  showSumReaction={showSumReaction}
                  hideSumReaction={hideSumReaction}
                />
              );
            }
            if (
              item.type === 'video' &&
              (item.deleteBy?.length == 0 ||
                item.deleteBy?.find(f => f !== user._id))
            ) {
              return (
                <VideoMessage
                  key={index}
                  item={item}
                  userId={userId}
                  receiverImage={item.senderId.image}
                  toggleReaction={toggleReaction}
                  onSelectReaction={onSelectReaction}
                  showReactionIndex={showReactionIndex}
                  showPressOther={showPressOther}
                  setItemSelected={setItemSelected}
                  showReCall={showReCall}
                  isShowReCall={isShowReCall}
                  conversation={conversation}
                  setReactionMsg={setReactionMsg}
                  showSumReaction={showSumReaction}
                  hideSumReaction={hideSumReaction}
                />
              );
            }
            if (
              item.type === 'sticker' &&
              (item.deleteBy?.length == 0 ||
                item.deleteBy?.find(f => f !== user._id))
            ) {
              return (
                <StickerMessage
                  key={index}
                  item={item}
                  userId={userId}
                  receiverImage={item.senderId.image}
                  showPressOther={showPressOther}
                  setItemSelected={setItemSelected}
                  showReCall={showReCall}
                  isShowReCall={isShowReCall}
                  conversation={conversation}
                  // setReactionMsg={setReactionMsg}
                  // showSumReaction={showSumReaction}
                  // hideSumReaction={hideSumReaction}
                />
              );
            }
          })}
        </ScrollView>
        {/* </ImageBackground> */}
      </Pressable>
      {/* footer */}
      {msgReply !== null && (
        <View style={{ height: 50, width: '100%', backgroundColor: Colors.backgroundChat, flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderTopWidth: 0.5, borderColor: Colors.primary }}>
          <View style={{ width: '90%' }}>
            <Text style={{ color: Colors.white }}>Đang trả lời
              {msgReply?.senderId?._id == user._id ? ' chính bạn' : msgReply?.senderId?.name}
            </Text>
            <Text numberOfLines={1} style={{ color: Colors.grey }}>
              {msgReply?.type == 'text' ? msgReply?.contentMessage : msgReply?.type == 'image' ? 'Hình ảnh' : msgReply?.type == 'File' ? 'Tệp' : 'Sticker'}
            </Text>
          </View>
          <View style={{ width: '30%' }}>
            <Pressable onPress={() => setMsgReply(null)}
              style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary, borderRadius: 10, marginTop: 5, marginRight: 10 }}
            >
              <Text style={{ color: Colors.white, textAlign: 'center', fontSize: 12 }}>X</Text>
            </Pressable>
          </View>
        </View>
      )}
      <View
        style={{
          height: windowHeight * 0.1,
          flexDirection: 'row',
          backgroundColor: Colors.black,
        }}>
        <View
          style={{
            width: '35%',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingLeft: 20,
          }}>
          <Pressable
            onPress={() => {
              onSelectImage();
            }}>
            {Icons.Icons({ name: 'iconImage', width: 22, height: 22 })}
          </Pressable>
          <Pressable
            onPress={() => {
              onSelectFile();
            }}>
            {Icons.Icons({ name: 'iconFile', width: 22, height: 22 })}
          </Pressable>
          <Pressable
            onPress={() => {
              showIcon();
            }}>
            {Icons.Icons({ name: 'iconIcon', width: 22, height: 22 })}
          </Pressable>
        </View>
        <View
          style={{
            width: '55%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AutogrowInput
            maxHeight={50}
            minHeight={30}
            placeholder={'Aa'}
            defaultHeight={30}
            style={{
              backgroundColor: Colors.white,
              fontSize: 16,
              borderRadius: 10,
              width: '100%',
              paddingLeft: 10,
              paddingRight: 10,
              color: Colors.black,
            }}
            value={inputMessage}
            onChangeText={handleInputText}
          />
        </View>
        <View
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Pressable
            onPress={() => {
              onSend();
            }}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {Icons.Icons({ name: 'iconSend', width: 22, height: 22 })}
          </Pressable>
        </View>
      </View>
      {/* //sticker */}
      <Animated.View
        style={{
          width: windowWidth,
          height: showGif,
          backgroundColor: Colors.black,
          opacity: 1,
        }}>
        <View>
          <View
            style={{ flexDirection: 'row', backgroundColor: Colors.lightBlue }}>
            {stickerData.map(pack => (
              <Pressable
                key={pack.id}
                onPress={() => selectStickerPack(pack)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 10,
                }}>
                <Image
                  source={{ uri: pack.data[0].url }}
                  style={{ width: 35, height: 35 }}
                />
              </Pressable>
            ))}
          </View>

          <View style={{ height: 260 }}>
            <Text
              style={{
                fontSize: 20,
                color: Colors.white,
                fontWeight: 'bold',
                paddingLeft: 10,
              }}>
              {selectedPack?.title}
            </Text>
            {selectedPack && (
              <ScrollView
                contentContainerStyle={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                }}>
                {selectedPack.data.map((item, index) => (
                  <Pressable
                    onPress={() => {
                      onSendSticker(item.url);
                    }}
                    key={index}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{ uri: item.url }}
                      style={{ width: 80, height: 80 }}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Animated.View>
      {/* //other */}
      <Animated.View
        style={{
          width: windowWidth,
          height: showPress,
          backgroundColor: 'gray',
          position: 'absolute',
          bottom: 0,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: 70,
          }}>
          <Pressable
            onPress={() => {
              replyMessage(itemSelected);
            }}
            style={{
              width: '24%',
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.white,
            }}>
            {Icons.Icons({ name: 'replyMsg', width: 22, height: 22 })}
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                fontWeight: 'bold',
                marginTop: 5,
              }}>
              {i18next.t('traLoi')}
            </Text>
          </Pressable>
          {isShowReCall && (
            <Pressable
              onPress={() => {
                recallMessage(itemSelected._id);
              }}
              style={{
                width: '25%',
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.white,
              }}>
              {Icons.Icons({ name: 'removeMsg', width: 22, height: 22 })}
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.black,
                  fontWeight: 'bold',
                  marginTop: 5,
                }}>
                {i18next.t('thuHoi')}
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => {
              deleteMessage(itemSelected._id);
            }}
            style={{
              width: '25%',
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.white,
            }}>
            {Icons.Icons({ name: 'deleteMsg', width: 22, height: 22 })}
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                fontWeight: 'bold',
                marginTop: 5,
              }}>
              {i18next.t('xoa')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('ForwardMessage', { msg: itemSelected });
            }}
            style={{
              width: '25%',
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.white,
            }}>
            {Icons.Icons({ name: 'shareMsg', width: 22, height: 22 })}
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                fontWeight: 'bold',
                marginTop: 5,
              }}>
              {i18next.t('chuyenTiep')}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
      <EmojiPicker
        open={isOpenEmoji}
        onClose={() => handleEmoji()}
        onEmojiSelected={emoji => {
          setInputMessage(inputMessage + emoji.emoji);
        }}
        theme={{
          backdrop: '#16161888',
          knob: '#766dfc',
          container: '#282829',
          header: '#fff',
          skinTonesContainer: '#252427',
          category: {
            icon: '#766dfc',
            iconActive: '#fff',
            container: '#252427',
            containerActive: '#766dfc',
          },
        }}
        translation={vi}
      />

      <Animated.View style={{
        width: '100%',
        height: sumReaction,
        position: 'absolute',
        bottom: 0,
        backgroundColor: Colors.primary,
      }}>
        <View style={{
          borderBottomWidth: 1,
          borderColor: Colors.white,
          height: 40
        }}>
          <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
            Tất cả: {reactionMsg?.reaction?.length}
          </Text>
        </View>
        <ScrollView style={{
          width: '100%',
          height: 200,
          padding: 10
        }}>
          {
            reactionMsg?.reaction?.map((item, index) => (
              item.type === 'delete' ? null :
                <View key={index} style={{ width: '100%', height: 60, padding: 10, flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ width: '70%', flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginRight: 15
                    }} source={{ uri: item?.userId?.image }} />
                    <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                      {item?.userId?.name}
                    </Text>
                  </View>
                  <View style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }}>
                    {item?.type == 'like' ? Icons.Icons({ name: 'like', width: 32, height: 32 })
                      : item?.type == 'love' ? Icons.Icons({ name: 'love', width: 32, height: 32 })
                        : item?.type == 'angry' ? Icons.Icons({ name: 'angry', width: 32, height: 32 })
                          : item?.type == 'sad' ? Icons.Icons({ name: 'sad', width: 32, height: 32 })
                            : item?.type == 'wow' ? Icons.Icons({ name: 'wow', width: 32, height: 32 })
                              : item?.type == 'haha' ? Icons.Icons({ name: 'haha', width: 32, height: 32 }) : null}
                  </View>
                </View>

            ))
          }
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const arrgif = [
  {
    id: 1,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(1).gif',
  },
  {
    id: 2,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(2).gif',
  },
  {
    id: 3,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(3).gif',
  },
  {
    id: 4,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(4).gif',
  },
  {
    id: 5,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(1).jpg',
  },
  {
    id: 6,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(2).png',
  },
  {
    id: 7,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(3).png',
  },
  {
    id: 8,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(4).png',
  },
  {
    id: 9,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(5).png',
  },
  {
    id: 10,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(6).png',
  },
  {
    id: 11,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(7).png',
  },
  {
    id: 12,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(8).png',
  },
  {
    id: 13,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(9).png',
  },
  {
    id: 14,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(10).png',
  },
  {
    id: 15,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(11).png',
  },
  {
    id: 16,
    url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
  },
];
// const stickerData = [
//   {
//     title: 'Animals',
//     data: [
//       {
//         id: 1,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//       {
//         id: 2,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//     ],
//   },
//   {
//     title: 'Emotions',
//     data: [
//       {
//         id: 1,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//       {
//         id: 2,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//       {
//         id: 3,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//       {
//         id: 4,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//       {
//         id: 5,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//       {
//         id: 6,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//       {
//         id: 7,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//       {
//         id: 8,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//       {
//         id: 9,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//       {
//         id: 10,
//         url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png',
//       },
//     ],
//   },
// ];

export default ChatScreen;
