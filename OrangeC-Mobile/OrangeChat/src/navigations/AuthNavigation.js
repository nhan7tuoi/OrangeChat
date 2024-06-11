import React, { useEffect, useState } from 'react';
import LoginNavigator from './LoginNavigator';
import MainNavigation from './MainNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/authSlice';
import SplashScreen from '../screens/SplashScreen';
import authApi from '../apis/authApi';
import { View } from 'react-native';


const AuthNavigation = () => {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isShowSplash, setIsShowSplash] = useState(true);

    useEffect(() => {
        AsyncStorage.clear();

        checkLogin();
        const timeout = setTimeout(() => {
            setIsShowSplash(false);
        }, 5000);
        return () => {
            clearTimeout(timeout);
        };

    }, []);

    const checkLogin = async () => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await authApi.refreshToken({ token: token });
                dispatch(setAuth({
                    accessToken: response.accessToken
                }));
            } catch (error) {
                console.log('error', error);
            }
        }
    };

    return (
        <>
            {isShowSplash ? <SplashScreen /> :
                auth.accessToken ? <MainNavigation /> : <LoginNavigator />}
        </>
    );
}

export default AuthNavigation;
