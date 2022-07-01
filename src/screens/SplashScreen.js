import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import BaseScreen from './BaseScreen';

class SplashScreen extends BaseScreen {
  state = {};

  constructor(props) {
    super(props);
    this.getData();
  }

  componentDidMount() {
    setTimeout(() => {
      // console.log(`SplashScreen.next`);
      this.props.navigation.replace('restaurants_list');
    }, 3000);
  }

  getData = async () => {
    try {
      
    } catch (e) {
      console.log(`SplashScreen.ERROR: ${e}`);
    }
  };

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

const mapStateToProps = state => ({
  
});

const mapDispatchToProps = dispatch => {
  return {
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
