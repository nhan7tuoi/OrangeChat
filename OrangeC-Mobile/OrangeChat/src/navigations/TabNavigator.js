import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CaNhanScreen from '../screens/CaNhanScreen';
import NhomScreen from '../screens/NhomScreen';
import TaiKhoanScreen from '../screens/TaiKhoanScreen';
import { useSelector } from 'react-redux';
import i18next from '../i18n/i18n';
import Icons from '../themes/Icons';
import FriendNavigation from './FriendNavigation';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
    i18next.changeLanguage(selectedLanguage);
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'rgba(238, 102, 25, 1)',
            tabBarInactiveTintColor: 'white',
            tabBarStyle: {
                backgroundColor: 'black',
                borderTopWidth: 2,
                borderTopColor: 'rgba(238, 102, 25, 1)',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                shadowOpacity: 4,
                shadowRadius: 4,
                elevation: 4,
                shadowOffset: {
                    width: 0,
                    height: -4
                },
                height: 60,
            }
        }}>
            <Tab.Screen name="CaNhan" component={CaNhanScreen}
                options={{
                    tabBarLabel: i18next.t('caNhan'),
                    tabBarLabelStyle:{fontSize:12},
                    tabBarIcon: ({ focused }) => {
                        return (
                            focused ? (
                                <>
                                {Icons.Icons({name: 'caNhan', width: 24, height: 24})}
                                </>
                            ) : (
                                <>
                                {Icons.Icons({name: 'caNhan2', width: 24, height: 24})}
                                </>
                            )
                        )
                    }
                }}
            />
            <Tab.Screen name="Nhom" component={NhomScreen} options={{
                tabBarLabel: i18next.t('nhom'),
                tabBarLabelStyle:{fontSize:12},
                tabBarIcon: ({ focused }) => {
                    return (
                        focused ? (
                            <>
                            {Icons.Icons({name: 'nhom', width: 24, height: 24})}
                            </>
                        ) : (
                            <>
                            {Icons.Icons({name: 'nhom2', width: 24, height: 24})}
                            </>
                        )
                    )
                }
            }} />
            <Tab.Screen name="DanhBa" component={FriendNavigation} options={{
                tabBarLabel: i18next.t('danhBa'),
                tabBarLabelStyle:{fontSize:12},
                tabBarIcon: ({ focused }) => {
                    return (
                        focused ? (
                            <>
                            {Icons.Icons({name: 'danhBa', width: 24, height: 24})}
                            </>
                        ) : (
                            <>
                            {Icons.Icons({name: 'danhBa2', width: 24, height: 24})}
                            </>
                        )
                    )
                }
            }} />
            <Tab.Screen name="TaiKhoan" component={TaiKhoanScreen} options={{
                tabBarLabel: i18next.t('user'),
                tabBarLabelStyle:{fontSize:12},
                tabBarIcon: ({ focused }) => {
                    return (
                        focused ? (
                            <>
                            {Icons.Icons({name: 'taiKhoan', width: 24, height: 24})}
                            </>
                        ) : (
                            <>
                            {Icons.Icons({name: 'taiKhoan2', width: 24, height: 24})}
                            </>
                        )
                    )
                }
            }} />
        </Tab.Navigator>
    );
}

export default TabNavigator;
