import React, { Children } from 'react';
import {Text, StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl} from 'react-native';
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
    restaurantsList: [],
    currentPage: 1,
    perPage: 10,
    refreshing: false,
    isLoadLastItem: false
  };

  constructor(props) {
    super(props);
    this.realmHelper = RealmHelper.getInstance();
  }

  componentDidMount() {
    let tRestaurantsList = this.getRestaurantListFromDB()
    if (tRestaurantsList.length == 0) {
      this.getRestaurantsList()
    } else {
      this.setState({ restaurantsList: tRestaurantsList }, () => {
        this.checkIsLoadLastObject()
      })
    }
  }

  getRestaurantListFromDB = () => {
    let { currentPage, perPage } = this.state
    let startIndex = (currentPage * perPage) - perPage
    let endIndex = currentPage * perPage
    let tRestaurantsList = this.realmHelper.getAllObject(RESTAURANT, startIndex, endIndex)
    return tRestaurantsList
  }

  loaderView = (isShowLoader) => {
    this.setState({ showLoader: isShowLoader })
  }

  checkIsLoadLastObject = () => {
    let length = this.realmHelper.getAllObjectsCount(RESTAURANT)
    console.log(`length: ${length}`)
    if (this.state.restaurantsList.length >= length) {
      this.setState({ isLoadLastItem: true })
    }
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
                let tRestaurantsList = this.getRestaurantListFromDB()
                this.setState({ restaurantsList: tRestaurantsList }, () => {
                  this.checkIsLoadLastObject()
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
          ListFooterComponent={this.renderFooter}
          onEndReached={() => {
            console.log(`onEndReached`)
            if (!this.state.refreshing && !this.state.isLoadLastItem) {
              this.setState({ refreshing: true, currentPage: this.state.currentPage+1 })
              setTimeout(() => {
                let tRestaurantsList = this.getRestaurantListFromDB()
                this.setState({ refreshing: false, restaurantsList: [...this.state.restaurantsList, ...tRestaurantsList] }, ()=> {
                  this.checkIsLoadLastObject()
                })
              }, 500)
            }
          }}
          onEndReachedThreshold={0.2}
        />
        <Loader showLoader={this.state.showLoader} />
      </View>
    );
  }

  renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.loadMoreBtn}>
        {this.state.refreshing && !this.state.isLoadLastItem ? (
          <ActivityIndicator style={{marginLeft: 8}} />
        ) : null}
        {this.state.isLoadLastItem ? <Text>No more restaurant at the moment</Text> : null}
      </View>
    );
  };


  refreshData = async () => {
    console.log(`refreshing`)
    this.setState({ refreshing: true })
    setTimeout(() => {
      this.setState({ refreshing: false })
    }, 500)
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
  },
  loadMoreBtn: {
    padding: 12,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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