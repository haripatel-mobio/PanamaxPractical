import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import BaseScreen from './BaseScreen';

class SplashScreen extends BaseScreen {
  state = {};

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // ? 3 second timer and open home screen
    setTimeout(() => {
      this.props.navigation.replace('restaurants_list');
    }, 3000);
  }

  render() {
    return (
      <View style={styles.rootView}>
        <Text style={styles.welcomeTest}>
          Welcome to Panamax
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  welcomeTest: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold'
  }
});
export default SplashScreen;
