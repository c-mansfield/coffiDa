/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';

import Login from './screens/Login.js';
import MainStackNavigation from './navigation/MainStackNavigation.js';

const App = () => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
        <MainStackNavigation />
    </ApplicationProvider>
  );
};

export default App;
