import React, { createRef } from 'react';
import {StyleSheet, View} from 'react-native';
import BaseScreen, { GOOGLE_API_KEY, isValueNull, showToast } from './BaseScreen';
import { COLORS } from '../helper/Color';
import MapView, { Marker, Callout } from 'react-native-maps'
import CustomCallout from '../helper/CustomCallout';
import { getCurrentLocation } from '../helper/GetLocation';
import Loader from '../components/Loader';
import MapViewDirections from 'react-native-maps-directions';
import WebServiceURL from '../helper/network/WebServiceURL';
import {connect} from 'react-redux';
import { API_CALL } from '../helper/network/CallingWebService';

class RestaurantAddressMapView extends BaseScreen {
  state = {
    showLoader: false,
    selectedOrderRestaurantData: {},
    currentLocation: {
      latitude: 0.0,
      longitude: 0.0
    },
    restaurantLocation: {
      latitude: 0.0,
      longitude: 0.0
    },
    /* restaurantLocation: {
      latitude: 22.690144,
      longitude: 72.839149
    } */
  };

  constructor(props) {
    super(props);
    this.map = createRef()
  }

  loaderView = (isShowLoader) => {
    this.setState({ showLoader: isShowLoader })
  }

  componentDidMount() {
    // ? get restaurant data and current coordinates form parameters
    let tSelectedRestaurantData = {};
    let tCurrentLocation = {}
    if (this.props.route.params != undefined) {
      if (this.props.route.params.selectedRestaurant != undefined) {
        tSelectedRestaurantData = this.props.route.params.selectedRestaurant;
      }

      if (this.props.route.params.currentLocation != undefined) {
        tCurrentLocation = this.props.route.params.currentLocation;
      }
    }

    if (!isValueNull(tSelectedRestaurantData) && !isValueNull(tCurrentLocation)) {
      this.setState({
        selectedOrderRestaurantData: tSelectedRestaurantData,
        currentLocation: tCurrentLocation
      }, () => {
        // this.getLocation()
        this.getRestaurantLocationInCoordinates(this.state.selectedOrderRestaurantData.address)
      });
    }
  }

  /* getLocation = () => {
    this.loaderView(true)
    getCurrentLocation(position => {
      // this.loaderView(false)
      if (position != null) {
        let lat = position.coords.latitude.toFixed(6);
        let long = position.coords.longitude.toFixed(6);

        console.log('latitude : ' + lat + ', longitude : ' + long);
        this.setState({currentLocation:{latitude: parseFloat(lat), longitude: parseFloat(long)}}, () => {
          this.getRestaurantLocationInCoordinates(this.state.selectedOrderRestaurantData.address)
        });
      } else {
        // if (position == null) {
        //   this.props.navigation.goBack()
        // }
        this.loaderView(false)
      }
    });
  } */

  // ? Call google API for get coordinates from address to show marker
  getRestaurantLocationInCoordinates = (address) => {
    this.loaderView(true)
    let url = WebServiceURL.GET_COORDINATE
    url = url.replace('[address]', address)
    console.log(`getRestaurantLocationInCoordinates.url: ${url}`)
    API_CALL(
      'GET', 
      url, 
      null,
      this.props.isConnected,
      (response, error) => {
        this.loaderView(false)
        // console.log(`getRestaurantLocationInCoordinates.response: ${JSON.stringify(response)}`)
        if (isValueNull(error)) {
          if (response.status == "OK" && response.results.length != 0) {
            let resultData = response.results[0]
            console.log(`resultData: ${JSON.stringify(resultData)}`)
            if (!isValueNull(resultData.geometry) && !isValueNull(resultData.geometry.location)) {
              let lat = parseFloat(resultData.geometry.location.lat.toFixed(6))
              let lng = parseFloat(resultData.geometry.location.lng.toFixed(6))
              this.setState({ restaurantLocation: { latitude: lat, longitude: lng } }, () => {
                setTimeout(() => {
                  this.fitPadding()
                }, 500)
              })
            } else {
              showToast()
            }
          } else if (response.status == "REQUEST_DENIED") {
            showToast(response.error_message)
          }
        } else {
          showToast(error)
        }
      }
    )
  }

  render() {
    let { latitude, longitude } = this.state.currentLocation
    return (
      <View style={styles.rootView}>
        <MapView
          ref={this.map}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          style={{ flex: 1 }}
        >
          {this.state.restaurantLocation.latitude != 0.0 && this.state.restaurantLocation.longitude != 0.0 ? 
          <Marker
            coordinate={{ latitude : this.state.restaurantLocation.latitude, longitude : this.state.restaurantLocation.longitude }}
            image={require('../assets/images/shop-pin.png')}
          >
            <Callout>
              <CustomCallout restaurantData={this.state.selectedOrderRestaurantData} />
            </Callout>
          </Marker> : null }
          // ? Show directions between two coordinates
          {this.state.restaurantLocation.latitude != 0.0 && this.state.restaurantLocation.longitude != 0.0 ? 
          <MapViewDirections
            origin={this.state.currentLocation}
            // destination={this.state.restaurantLocation}
            destination={this.state.selectedOrderRestaurantData.address}
            apikey={GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor={COLORS.primary}
            onError={(errorMessage) => {
              console.log(`errorMessage: ${errorMessage}`)
              setTimeout(() => {
                if (typeof(errorMessage) == 'string') {
                  let newErrorMessage = errorMessage.replace('Error on GMAPS route request: ', '')
                  if (newErrorMessage == "ZERO_RESULTS") {
                    showToast('There is no route between your location to restaurant location.')
                  } else {
                    showToast(newErrorMessage)
                  }
                }
              }, 500)
            }}
          /> : null }
        </MapView>
        <Loader showLoader={this.state.showLoader} />
      </View>
    );
  }

  // ? According to coordinates move and adjust camera position
  fitPadding = () => {
    this.map.current?.fitToCoordinates([this.state.currentLocation, this.state.restaurantLocation], {
      edgePadding: { top: 24, right: 24, bottom: 24, left: 24 },
      animated: true,
    });
  }
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: 'white'
  },
  backView: {
    position: 'absolute',
    top: 16,
    left: 0,
    zIndex: 1,
    margin: 12,
    padding: 4,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 24
  },
  backTextView: {
    fontSize: 18,
    fontWeight: '600'
  }
});

const mapStateToProps = state => ({
  isConnected: state.auth.isConnected
});

export default connect(mapStateToProps)(RestaurantAddressMapView);