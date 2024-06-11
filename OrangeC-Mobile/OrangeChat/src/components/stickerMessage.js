import React from 'react';
import { View, Image, Pressable, Text } from 'react-native';
import Colors from '../themes/Colors';
import Video from 'react-native-video';

const StickerMessage = ({ item, index, setItemSelected, showPressOther, userId, receiverImage, showReCall, isShowReCall, conversation }) => {
    const getLastWord = (text) => {
        const words = text.split(' ');
        const last = words[words.length - 1];
        return last;
    }
    return (
        <View key={index} style={[
            item?.senderId._id === userId ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
            {
                flexDirection: 'row',
                paddingLeft: 10
            }
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
                    setItemSelected(item)
                    if (item?.senderId._id === userId) {
                        showReCall(!isShowReCall)
                    }
                    showPressOther()
                }}

                style={[
                    {
                        maxWidth: '60%',
                        padding: 2,
                        borderRadius: 10,
                        margin: 10,
                    }
                ]}
            >

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

                {item.isReCall === false ? (
                    <View>
                        <Image
                            source={{ uri: item.urlType[0] }}
                            style={{ width: 200, height: 200 }}
                        />
                    </View>
                ) : (
                    <Text style={{
                        width: '100%',
                        height:'100%',
                        fontSize: 14,
                        padding: 3,
                        color: Colors.white,
                        fontWeight: 600,
                        backgroundColor: Colors.primary,

                    }}>
                        Đã thu hồi
                    </Text>
                )}
            </Pressable>
        </View>
    );
}

export default StickerMessage;
