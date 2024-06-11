import React from 'react';
import { View, Pressable, Image, Dimensions, Text } from 'react-native';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import Lightbox from 'react-native-lightbox-v2';
import Reaction from './reaction';
import Video from 'react-native-video';

const windowWidth = Dimensions.get('window').width;

const ImageMessage = ({ item, index, userId, receiverImage, toggleReaction, onSelectReaction, showReactionIndex, showPressOther, setItemSelected, showReCall, isShowReCall, conversation, setReactionMsg, showSumReaction, hideSumReaction }) => {
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
                style={[
                    {
                        backgroundColor: Colors.bubble,
                        maxWidth: '60%',
                        borderRadius: 10,
                        margin: 10,
                        padding: 2,
                    }
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

                {item.isReCall === false ? (
                    <>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', padding: 5 }}>
                            {item.urlType.map((url, urlIndex) => (
                                <View key={urlIndex}>
                                    <Lightbox
                                        onLongPress={() => {
                                            if (item.isReCall === false) {
                                                setItemSelected(item)
                                                if (item?.senderId._id === userId) {
                                                    showReCall(!isShowReCall)
                                                }
                                                showPressOther()
                                                console.log(item);
                                            }
                                        }}
                                        activeProps={{
                                            style: { flex: 1, resizeMode: 'contain', width: windowWidth, height: 400, }
                                        }}
                                    >
                                        <Image
                                            source={{ uri: url }}
                                            style={{ width: 100, height: 100, borderRadius: 10, marginVertical: 5 }}
                                        />
                                    </Lightbox>

                                </View>

                            ))}
                            {/* <Text
                            style={[
                                {
                                    fontSize: 12,
                                    paddingHorizontal: 2,
                                    paddingTop: 3
                                },
                                item.senderId === userId ? { textAlign: "right" } : { textAlign: "left" }
                            ]}
                        >
                            {formatTime(item.createAt)}
                        </Text> */}
                        </View>
                        <Pressable
                            onPress={() => {
                                toggleReaction(item._id)
                                setReactionMsg(item);
                                if (item.reaction.length > 0) {
                                    showSumReaction();
                                }
                            }}
                            style={[
                                { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.grey, justifyContent: 'center', alignItems: 'center' },
                                item?.senderId._id === userId ? { left: 5, bottom: -5 } : { right: 5, bottom: -5 }
                            ]}>

                            {Icons.Icons({
                                name: (item?.reaction.length === 0 || item?.reaction[0]?.type === 'delete') ? 'iconTym' : item?.reaction[0]?.type,
                                width: 13,
                                height: 13
                            })}
                        </Pressable>

                        {(showReactionIndex == item._id) && (
                            <Reaction onSelectReaction={onSelectReaction} item={item} hideSumReaction={hideSumReaction} />
                        )}
                    </>
                ) : (
                    <Text style={{
                        fontSize: 14,
                        padding: 3,
                        color: Colors.white,
                        fontWeight: 600

                    }}>
                        Đã thu hồi
                    </Text>
                )}
            </Pressable>
        </View>
    );
}

export default ImageMessage;
