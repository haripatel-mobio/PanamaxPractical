import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import { API_CALL } from '../helper/network/CallingWebService';
import BaseScreen, { isValueNull, showToast } from './BaseScreen';
import WebServiceURL from '../helper/network/WebServiceURL';
import Loader from '../components/Loader';

class RestaurantsList extends BaseScreen {
  state = {
    showLoader: false
  };

  constructor(props) {
    super(props);
    this.getRestaurantsList()
  }

  loaderView = (isShowLoader) => {
    this.setState({ showLoader: isShowLoader })
  }

  getRestaurantsList = () => {
    this.loaderView(true)
    API_CALL(
      'GET', 
      WebServiceURL.RESTAURANT_LIST, 
      null,
      this.props.isConnected,
      (response, error) => {
        this.loaderView(false)
        if (isValueNull(error)) {
          console.log(`response: ${JSON.stringify(response)}`)
          //reviews
          //phone
          //image
          //averagecost
          //address
          //id
          //location
          //restauranttype
          //businessname
        } else {
          showToast(error)
        }
      }
    )
  }

  render() {
    return (
      <View style={styles.rootView}>
        <Text style={styles.welcomeTest}>
          RestaurantsList
        </Text>
        <Loader showLoader={this.state.showLoader} />
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
  isConnected: state.auth.isConnected
});

const mapDispatchToProps = dispatch => {
  return {
  
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantsList);