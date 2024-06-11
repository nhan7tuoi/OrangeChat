import axios from 'axios';
import IPV4 from './ipv4';
const token = JSON.parse(localStorage.getItem('token'));

const BASE_URL = `https://${IPV4}/api/friend`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

const getFriends = async ({userId}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
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
  const headers = {
    Authorization: `Bearer ${token}`,
  };
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
  const headers = {
    Authorization: `Bearer ${token}`,
  };
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
  const headers = {
    Authorization: `Bearer ${token}`,
  };
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
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await instance.put(`/${friendRequestId}`,{
      headers: headers,
    
    });
  } catch (error) {
    throw error;
  }
};

const reject = async ({friendRequestId}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const res = await instance.delete(`/${friendRequestId}`,{
      headers: headers,
    
    });
  } catch (error) {
    throw error;
  }
};
export default {getFriends, getFriendRequests, sendFriendRequest, accept,reject,getAllFriendRequests};