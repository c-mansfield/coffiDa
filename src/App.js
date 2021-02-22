/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef } from 'react';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  IconRegistry,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { default as theme } from 'assets/theme/theme.json';
import { default as mapping } from 'assets/mapping.json';
import DropdownAlert from 'react-native-dropdownalert';

import DropDownHolder from 'src/services/DropdownHolder.js';
import MainStackNavigation from './navigation/MainStackNavigation.js';

const App = () => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{ ...eva.light, ...theme }}
        customMapping={mapping}
      >
        <MainStackNavigation />
        <DropdownAlert ref={(ref) => DropDownHolder.setDropDown(ref)} />
      </ApplicationProvider>
    </>
  );
};

export default App;
