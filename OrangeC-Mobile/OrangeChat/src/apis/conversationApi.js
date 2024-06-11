import axios from 'axios';
import IPV4 from './ipv4';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `https://${IPV4}/api/v1`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

//get conversation by userId
const getConversation = async ({userId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get(`/conversation/${userId}`, {
      headers: headers,
    });
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.log('error1', error);
    throw error;
  }
};

const getAllConversation = async ({userId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get(`/allConversations/${userId}`,{
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.log("can't fetch data", error);
    throw error;
  }
};

const getConversationGroups = async ({userId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get(`/getConversationGroups/${userId}`,{
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.log("can't fetch data", error);
    throw error;
  }
};

const getOneConversation = async ({sendetId, receiverId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get(
      `/getOneConversation/${sendetId}/${receiverId}`,
      {
        headers: headers,
      }
    );
    console.log('res data:', response.data);
    return response.data;
  } catch (error) {
    console.log("can't fetch data", error);
    throw error;
  }
};

const uploadAvatar = async ({conversationId, image}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.post('/uploadAvatarGroup', {
      conversationId: conversationId,
      image: image,
    },
  {
    headers: headers,
  });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getConversation,
  getAllConversation,
  getConversationGroups,
  uploadAvatar,
  getOneConversation,
};
