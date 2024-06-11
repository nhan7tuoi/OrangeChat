import React, {useCallback, useState} from 'react';
import {View, Text, ScrollView, Image, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import Lightbox from 'react-native-lightbox-v2';
import {useSelector} from 'react-redux';
import messageApi from '../apis/messageApi';
import { useFocusEffect } from '@react-navigation/native';

const VideoScreen = () => {
  const conversation = useSelector(state => state.conversation.conversation);
  const [videos, setVideos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }),
  );
  const fetchData = async () => {
    try {
      const data = messageApi.getVideoMessages({
        conversationId: conversation._id,
      });
      setVideos(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {videos?.map(item => {
          return (
            <View key={item.id}>
              <Pressable>
                <Lightbox
                  onLongPress={() => {
                    console.log('chuyen tiep');
                  }}
                  activeProps={{
                    style: {
                      flex: 1,
                      resizeMode: 'contain',
                      width: 400,
                      height: 400,
                    },
                  }}>
                  <Image
                    source={{uri: item.urlType}}
                    style={{
                      width: 95,
                      height: 95,
                      borderRadius: 10,
                      marginVertical: 5,
                      marginHorizontal: 2,
                    }}
                  />
                </Lightbox>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
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

export default VideoScreen;
