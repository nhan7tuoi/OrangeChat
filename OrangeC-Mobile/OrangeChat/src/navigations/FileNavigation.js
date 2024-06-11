import React from 'react'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import i18next from 'i18next';
import Colors from '../themes/Colors';
import FileScreen from '../screens/FileScreen';
import ImageScreen from '../screens/ImageScreen';
import VideoScreen from '../screens/VideoScreen';
import {useSelector} from 'react-redux';


const Tab = createMaterialTopTabNavigator();
const FileNavigation = () => {
    const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
    return (
        <Tab.Navigator
            initialRouteName="Image"
            screenOptions={{
                tabBarInactiveTintColor: 'white',
                tabBarActiveTintColor: 'rgba(238, 102, 25, 1)',
                tabBarStyle: {
                    backgroundColor: Colors.black,
                    borderBottomColor: 'rgba(238, 102, 25, 1)',
                },
                tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
                tabBarIndicatorStyle: {
                    backgroundColor: 'rgba(238, 102, 25, 1)',
                },
            }}>
            <Tab.Screen
                name="Image"
                component={ImageScreen}
                options={{ tabBarLabel: i18next.t('hinhAnh') }}
            />
            <Tab.Screen
                name="Video"
                component={VideoScreen}
                options={{ tabBarLabel: i18next.t('video') }}
            />
            <Tab.Screen
                name="File"
                component={FileScreen}
                options={{ tabBarLabel: i18next.t('file') }}
            />
        </Tab.Navigator>
    );
}
export default FileNavigation;