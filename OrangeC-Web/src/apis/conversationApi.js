import axios from 'axios';
import IPV4 from './ipv4';
const token = JSON.parse(localStorage.getItem('token'));
// import Conversation from ;

const BASE_URL = `https://${IPV4}/api/v1`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

//get conversation by userId
const getConversation = async ({userId}) => {
  console.log("tokenn",token);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await instance.get(`/conversation/${userId}`,{
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.log('error1', error);
    throw error;
  }
};

const getAllConversation = async ({userId}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  console.log(userId);
  try {
    const response = await instance.get(`/allConversations/${userId}`,{
      headers: headers,
    
    });
    console.log("res data:",response.data);
    return response.data;
  } catch (error) {
    console.log("can't fetch data", error);
    throw error;
  }
};

const getConversationGroups = async ({userId}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
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
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await instance.get(
      `/getOneConversation/${sendetId}/${receiverId}`,
      {headers: headers}
    );
    console.log("res data:",response.data);
    return response.data;
  } catch (error) {
    console.log("can't fetch data", error);
    throw error;
  }
};

const uploadAvatar = async ({conversationId, image}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await instance.post('/uploadAvatarGroup', {
      conversationId: conversationId,
      image: image,
    },{
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