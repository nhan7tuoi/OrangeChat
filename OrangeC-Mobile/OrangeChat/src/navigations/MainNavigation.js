import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import CaNhanScreen from '../screens/CaNhanScreen';
import ChatScreen from '../screens/ChatScreen';
import SearchUserScreen from '../screens/SearchUserScreen';
import EditProfileScreen from '../screens/Account/EditProfileScreen';
import ChangePassScreen from '../screens/Account/ChangePassScreen';
import LanguageScreen from '../screens/Account/LanguageScreen';
import i18next from '../i18n/i18n';
import Colors from '../themes/Colors';
import { useSelector } from 'react-redux';
import ForwardScreen from '../screens/forwardScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import InforGroupScreen from '../screens/InforGroupScreen';
import AddMemberGroup from '../screens/AddMemberGroup';
import FileNavigation from './FileNavigation';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const selectedLanguage = useSelector(
    state => state.language.selectedLanguage,
  );
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="TabNavigator">
      {/* <Stack.Screen name='LoginNavigator' component={LoginNavigator} /> */}
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="CaNhanScreen" component={CaNhanScreen} />
      <Stack.Screen name="SearchUser" component={SearchUserScreen} />
      <Stack.Screen
        name="FileNavigation"
        component={FileNavigation}
        options={{
          headerShown: true,
          title: i18next.t('hinhAnhVideoFile'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }} />
      <Stack.Screen
        name="AddMember"
        component={AddMemberGroup}
        options={{
          headerShown: true,
          title: i18next.t('themThanhVien'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="InforGroup"
        component={InforGroupScreen}
        options={{
          headerShown: true,
          title: i18next.t('tuyChon'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{
          headerShown: true,
          title: i18next.t('nhomMoi'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="ForwardMessage"
        component={ForwardScreen}
        options={{
          headerShown: true,
          title: i18next.t('guiDen'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          title: i18next.t('chinhSuaProfile'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="ChangePass"
        component={ChangePassScreen}
        options={{
          headerShown: true,
          title: i18next.t('doiMatKhau'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{
          headerShown: true,
          title: i18next.t('ngonNgu'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
  );
};
export default MainNavigation;
