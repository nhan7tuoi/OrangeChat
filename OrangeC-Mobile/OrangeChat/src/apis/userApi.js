import axios from 'axios';
import IPV4 from './ipv4';
import AsyncStorage from '@react-native-async-storage/async-storage';



const BASE_URL = `https://${IPV4}/api/v1`;

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
})

//up avatar
const uploadAvatar = async ({userId,image}) => {
    const token = await AsyncStorage.getItem('accessToken');
  const accessToken = JSON.parse(token);
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
    try {
        const response = await instance.post('/uploadAvatar', {
            userId: userId,
            image: image,
        },{
            headers: headers
        
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export default {
    uploadAvatar
}