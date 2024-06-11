import axios from 'axios';
import IPV4 from './ipv4';
const token = JSON.parse(localStorage.getItem('token'));


const BASE_URL = `https://${IPV4}/api/v1`;

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
})

//up avatar
const uploadAvatar = async ({userId,image}) => {
    const headers = {
        'Authorization': `Bearer ${token}`
    };
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