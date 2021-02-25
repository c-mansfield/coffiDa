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
import { default as evaTheme } from 'assets/theme/theme.json';
import { default as mapping } from 'assets/mapping.json';
import DropdownAlert from 'react-native-dropdownalert';

import DropDownHolder from 'src/services/DropdownHolder.js';
import ThemeContext from 'src/services/theme-context';
import MainStackNavigation from './navigation/MainStackNavigation.js';

const App = () => {
  const [theme, setTheme] = React.useState('dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider
          {...eva}
          theme={{ ...eva[theme], ...evaTheme }}
          customMapping={mapping}
        >
          <MainStackNavigation />
          <DropdownAlert ref={(ref) => DropDownHolder.setDropDown(ref)} />
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  );
};

export default App;
