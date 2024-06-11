import axios from 'axios';
import IPV4 from './ipv4';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `https://${IPV4}/api/v1`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

//ham get message theo conversationId
const getMessage = async ({conversationId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get(`/messages/${conversationId}`,{
      headers: headers,
    
    });
    console.log('messs', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get 20 tin nhan gan nhat
const getLastMessage = async ({conversationId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get(`/messages/last/${conversationId}`,{
      headers: headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get image messages
const getImageMessages = async ({conversationId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get(`/messages/image/${conversationId}`,{
      headers: headers,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

//get video messages
const getVideoMessages = async ({conversationId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get(`/messages/video/${conversationId}`,{
      headers: headers,
    
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get file messages
const getFileMessages = async ({conversationId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get(`/messages/file/${conversationId}`,{
      headers: headers,
    
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get tat ca tin nhan tru 20 tin nhan gan nhat
const getMoreMessage = async ({conversationId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get(`/messages/more/${conversationId}`,{
      headers: headers,
    
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//post reaction
const postReaction = async ({messageId, userId, reactType}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.post('/message/reaction', {
      messageId,
      userId,
      reactType,
    },{
      headers: headers,
    
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//ham up nhan anh tu client va up len aws
const uploadImage = async file => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);

  try {
    const response = await instance.post('/files/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
//ham up file tu client va up len aws
const uploadFile = async file => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);

  try {
    const response = await instance.post('/files/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  getMessage,
  uploadFile,
  getLastMessage,
  getMoreMessage,
  postReaction,
  uploadImage,
  getImageMessages,
  getVideoMessages,
  getFileMessages,
};
