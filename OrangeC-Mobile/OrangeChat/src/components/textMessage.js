import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import Reaction from './reaction';
import Video from 'react-native-video';

const TextMessage = ({
  item,
  formatTime,
  toggleReaction,
  index,
  userId,
  onSelectReaction,
  showReactionIndex,
  receiverImage,
  showPressOther,
  setItemSelected,
  showReCall,
  isShowReCall,
  conversation,
  setReactionMsg,
  showSumReaction,
  hideSumReaction
}) => {

  const getLastWord = (text) => {
    const words = text.split(' ');
    const last = words[words.length - 1];
    return last;
  };
  return (
    <View
      key={index}
      style={[
        item?.senderId._id === userId
          ? { alignSelf: 'flex-end' }
          : { alignSelf: 'flex-start' },
        {
          flexDirection: 'row',
          paddingLeft: 10,
        },
      ]}>
      {item?.senderId._id !== userId && (
        <View>
          {conversation.isGroup === true && (
            <Text
              style={{
                fontSize: 12,
                paddingHorizontal: 2,
                color: Colors.grey,
                textAlign: 'center',

              }}>
              {getLastWord(item?.senderId.name)}
            </Text>
          )}
          <Image
            source={{ uri: receiverImage }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
        </View>
      )}
      <Pressable
        onLongPress={() => {
          if (item.isReCall === false) {
            setItemSelected(item);
            if (item?.senderId._id === userId) {
              showReCall(!isShowReCall);
            }
            showPressOther();
            console.log(item);
          }
        }}
        style={[
          {
            backgroundColor: Colors.bubble,
            maxWidth: '60%',
            padding: 2,
            borderRadius: 10,
            margin: 10,
            minWidth: '20%',
          },
        ]}>

        {item?.reply !== null && item.isReCall === false && (
          <View key={item._id} style={{ width: '100%', backgroundColor: '#FF6633', padding: 10, borderRadius: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{item?.reply.senderId.name}</Text>
            {item?.reply?.type === 'text' && (
              <Text
                style={{
                  fontSize: 12,
                  padding: 3,
                  color: Colors.white,
                  fontWeight: 600,
                }}>
                {item?.reply?.contentMessage}
              </Text>
            ) || item?.reply?.type === 'image' && (
              <Image
                source={{ uri: item?.reply?.urlType[0] }}
                style={{ width: 50, height: 50, borderRadius: 5 }}
              />
            ) || item?.reply?.type === 'file' && (
              <Text numberOfLines={3} style={{ color: Colors.white, fontSize: 12, fontWeight: 600 }}>
                {item?.reply?.fileName}
              </Text>
            ) || item?.reply?.type === 'video' && (
              <Video
                source={{ uri: item.urlType[0] }}
                resizeMode="contain"
                controls={false}
                fullscreen={false}
                paused={false}
                style={{
                  width: 50,
                  height: 50,
                }}
              >
              </Video>

            ) || item?.reply?.type === 'sticker' && (
              <Image
                source={{ uri: item?.reply?.urlType[0] }}
                style={{ width: 50, height: 50, borderRadius: 5 }}
              />
            )
            }
          </View>
        )}

        <Text
          style={{
            fontSize: 14,
            padding: 3,
            color: Colors.white,
            fontWeight: 600,
          }}>
          {item.isReCall === true ? 'Đã thu hồi' : item.contentMessage}
        </Text>
        {item.isReCall === false && (
          <>
            <Text
              style={[
                {
                  fontSize: 12,
                  paddingHorizontal: 2,
                },
                item?.senderId._id === userId
                  ? { textAlign: 'right' }
                  : { textAlign: 'left' },
              ]}>
              {formatTime(item.createAt)}
            </Text>
            <Pressable
              onPress={() => {
                toggleReaction(item._id);
                setReactionMsg(item);
                if (item.reaction.length > 0) {
                  showSumReaction();
                }
              }}
              style={[
                {
                  position: 'absolute',
                  width: item.reaction.length > 0 ? 20 : 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: Colors.grey,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                item?.senderId._id === userId
                  ? { left: 5, bottom: -5 }
                  : { right: 5, bottom: -5 },
              ]}>
              <View>
                {Icons.Icons({
                  name:
                    item?.reaction.length === 0 ||
                      item?.reaction[0]?.type === 'delete'
                      ? 'iconTym'
                      : item?.reaction[0]?.type,
                  width: 13,
                  height: 13,
                })}
                {item?.reaction.length > 1 && (
                  <View style={{position:'absolute',left:5}}>
                    {Icons.Icons({
                      name:item?.reaction[1]?.type,
                      width: 13,
                      height: 13,
                    })}
                  </View>
                )}
              </View>
            </Pressable>

            {showReactionIndex == item._id && (
              <Reaction onSelectReaction={onSelectReaction} item={item} hideSumReaction={hideSumReaction} />
            )}
          </>
        )}
      </Pressable>
    </View>

  );
};

export default TextMessage;
