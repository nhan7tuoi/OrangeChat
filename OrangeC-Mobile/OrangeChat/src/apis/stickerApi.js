import axios from 'axios';
import IPV4 from './ipv4';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `https://${IPV4}/api/v1`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

//get all sticker
const getSticker = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  try {
    const response = await instance.get('/allstickers',{
      headers: headers,
    
    });
    console.log("response: ", response.data);
    return response.data;
  } catch (error) {
    console.log('error nè', error);
    throw error;
  }
};

export default {getSticker};