/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StatusBar,
  View,
  Text
} from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';
import AppNavigation from './src/navigation/AppNavigation';
import store from './src/store';
import RealmHelper from './src/helper/database/RealmHelper';

let realmHelper

class App extends React.Component {
  constructor(props) {
    super(props);
    realmHelper = RealmHelper.getInstance();
    realmHelper.createSchema();
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <StatusBar />
          <RootSiblingParent>
            <AppNavigation />
          </RootSiblingParent>
        </View>
      </Provider>
    );
  }
}

export default App;