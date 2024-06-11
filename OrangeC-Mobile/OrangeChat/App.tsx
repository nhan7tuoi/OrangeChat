/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { View } from 'react-native';

import AuthNavigation from './src/navigations/AuthNavigation';

const App = () => {
  return (
    <Provider store={store}>
        <NavigationContainer>
          <AuthNavigation />
        </NavigationContainer>
        {/* <View style={{ height: 100, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'red'}}>
        </View> */}
    </Provider>
  )
}

export default App;
