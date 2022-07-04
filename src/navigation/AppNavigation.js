import React from 'react';
import BaseScreen from '../screens/BaseScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as actions from '../store/actions/AuthAction';
import {connect} from 'react-redux';
import {COLORS} from '../helper/Color'

import NetInfo from "@react-native-community/netinfo";

//* Screens
import SplashScreen from '../screens/SplashScreen';
import RestaurantsList from '../screens/RestaurantsList';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import RestaurantDetails from '../screens/RestaurantDetails';
import RestaurantAddressMapView from '../screens/RestaurantAddressMapView';

const Stack = createStackNavigator();

class AppNavigation extends BaseScreen {
  state = {
    isConnected: false,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      this._subscription = NetInfo.addEventListener(state => {
        this.props.saveIsConnected(state.isConnected)
      });
    }, 1000);
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={'splash_screen'}
          screenOptions={this.screenDefaultOption()}>
          <Stack.Screen 
            options={{ headerShown: false }}
            name="splash_screen"
            component={SplashScreen}
          />
          <Stack.Screen
            options={{ title: 'Restaurants List' }}
            name="restaurants_list"
            component={RestaurantsList}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="restaurant_details"
            component={RestaurantDetails}
          />
          <Stack.Screen
            options={{ title: 'Map View' }}
            name="map_view"
            component={RestaurantAddressMapView}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  screenDefaultOption = navigation => {
    return {
      headerShown: true,
      gestureEnabled: true,
      headerTintColor: COLORS.white,
      headerStyle: {
        backgroundColor: COLORS.primary
      }
    };
  };
}

const mapStateToProps = state => ({
  
});

const mapDispatchToProps = dispatch => {
  return {
    saveIsConnected: isConnected => dispatch(actions.saveIsConnected(isConnected))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);
