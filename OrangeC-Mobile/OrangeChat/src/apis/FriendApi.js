import axios from 'axios';
import IPV4 from './ipv4';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `https://${IPV4}/api/friend`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

const getFriends = async ({userId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get(`/getFriends/${userId}`,{
      headers: headers,
    
    });
    return response.data;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

const getFriendRequests = async ({userId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const res = await instance.get(`/getFriendRequest/${userId}`,{
      headers: headers,
    
    });
    return res.data;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

const getAllFriendRequests = async({userId})=>{
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
   try {
     const res = await instance.get(`/getAllFriendRequests/${userId}`,{
        headers: headers,
      
     });
     return res.data;
   } catch (error) {
     console.log('error', error);
     throw error;
   }
}

const sendFriendRequest = async ({receiverId, senderId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const res = await instance.post('/send', {
      senderId,
      receiverId,
    },{
      headers: headers,
    });
  } catch (error) {
    throw error;
  }
};

const accept = async ({friendRequestId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const res = await instance.put(`/${friendRequestId}`,{
      headers: headers,
    
    });
  } catch (error) {
    throw error;
  }
};

const reject = async ({friendRequestId}) => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const res = await instance.delete(`/${friendRequestId}`,{
      headers:headers,
    });
  } catch (error) {
    throw error;
  }
};
export default {getFriends, getFriendRequests, sendFriendRequest, accept,reject,getAllFriendRequests};
