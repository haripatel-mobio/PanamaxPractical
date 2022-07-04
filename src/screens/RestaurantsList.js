import React from 'react';
import {Text, StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import { API_CALL } from '../helper/network/CallingWebService';
import BaseScreen, { isValueNull, showToast } from './BaseScreen';
import WebServiceURL from '../helper/network/WebServiceURL';
import Loader from '../components/Loader';
import RealmHelper from '../helper/database/RealmHelper';
import { RESTAURANT } from '../helper/database/schema/SchemaRestaurants';
import { Card, Image, Rating } from 'react-native-elements';
import { RFPercentage } from "react-native-responsive-fontsize";
import { COLORS } from '../helper/Color';

let mapIconOriginalWidth = 52
let mapIconOriginalHeight = 72
let mapIconWidth = 20
let newMapIconHeight = (mapIconOriginalHeight * mapIconWidth) / mapIconOriginalWidth

class RestaurantsList extends BaseScreen {
  state = {
    showLoader: false,
    restaurantsList: []
  };

  constructor(props) {
    super(props);
    this.realmHelper = RealmHelper.getInstance();
  }

  componentDidMount() {
    let tRestaurantsList = this.realmHelper.getAllObject(RESTAURANT)
    if (tRestaurantsList.length == 0) {
      this.getRestaurantsList()
    } else {
      this.setState({ restaurantsList: tRestaurantsList }, () => {
        //console.log(`componentDidMount.restaurantsList. ${JSON.stringify(this.state.restaurantsList)}`)
      })
    }
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
          // console.log(`response: ${JSON.stringify(response)}`)
          this.realmHelper.deleteAllRecordsOfSchema(RESTAURANT);
          if (response.Result.length != 0) {
            let result = response.Result
            this.realmHelper.insertMultipleSchemaData(RESTAURANT, result, (status, error) => {
              /* console.log(`status: ${status}`)
              console.log(`error: ${error}`) */
              if (status) {
                let tRestaurantsList = this.realmHelper.getAllObject(RESTAURANT)
                this.setState({ restaurantsList: tRestaurantsList }, () => {
                  //console.log(`getRestaurantsList.restaurantsList. ${JSON.stringify(this.state.restaurantsList)}`)
                })
              } else {
                showToast(error)
              }
            });
          }
        } else {
          showToast(error)
        }
      }
    )
  }

  render() {
    return (
      <View style={styles.rootView}>
        <FlatList
          keyExtractor={(item, index) => item._id}
          data={
            this.state.restaurantsList
          }
          renderItem={
            this.renderRestaurantListView
          }
          horizontal={false}
          showsVerticalScrollIndicator={false}
        />
        <Loader showLoader={this.state.showLoader} />
      </View>
    );
  }

  renderRestaurantListView = ({item, index}) => {
    return (
      <Card containerStyle={styles.cardView}>
        <TouchableOpacity 
          style={styles.cardSubView}
          onPress={()=> {
            this.props.navigation.navigate('restaurant_details', {
              selectedRestaurant: item,
            })
          }}
        >
          <View>
            <Image
              source={{ uri: item.image }}
              style={styles.imageView}
              PlaceholderContent={<ActivityIndicator />}
            />
          </View>
          <View style={styles.middleView}>
            <Text style={styles.testView}>
              {item.business_name}
            </Text>
            <Rating
              type="custom"
              ratingImage={require("../assets/images/Star-fill.png")}
              ratingCount={5}
              startingValue={0}
              imageSize={20}
              readonly={true}
              style={{paddingVertical: 8, alignSelf: 'flex-start'}}
            />
          </View>
          <TouchableOpacity
            style={styles.mapView}
            onPress={() => {
              this.props.navigation.navigate('map_view', {
                selectedRestaurant: item,
              })
            }}
          >
            <Image
              source={require('../assets/images/map.png')}
              style={styles.mapImageView}
              placeholderStyle={{ backgroundColor: 'transparent' }}
              PlaceholderContent={<ActivityIndicator color={COLORS.white} />}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  cardView: {
    borderWidth: 0,
    borderRadius: 4
  },
  cardSubView: {
    flexDirection: 'row'
  },
  imageView: {
    width: 64,
    height: 64,
    borderRadius: 4
  },
  middleView: {
    alignSelf: 'center',
    marginLeft: 12,
    marginRight: 12,
    flex: 1
  },
  testView: {
    fontWeight: '400',
    fontSize: RFPercentage(2.5)
  },
  mapView: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 44,
    height: 44,
    borderRadius: 4
  },
  mapImageView: {
    width: mapIconWidth,
    height: newMapIconHeight,
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: 'transparent'
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