import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import BaseScreen, { dialCall, height, isValueNull, width } from './BaseScreen';
import Slideshow from 'react-native-image-slider-show';
import { Button, Rating } from 'react-native-elements';
import { COLORS } from '../helper/Color';

class RestaurantDetails extends BaseScreen {
  state = {
    selectedOrderRestaurantData: {},
    sliderDataSource: []
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let tSelectedRestaurantData = '';
    if (this.props.route.params != undefined) {
      if (this.props.route.params.selectedRestaurant != undefined) {
        tSelectedRestaurantData = this.props.route.params.selectedRestaurant;
      }
    }

    if (!isValueNull(tSelectedRestaurantData)) {
      this.setState({
        selectedOrderRestaurantData: tSelectedRestaurantData,
      }, () => {
        // ? Check condition for slider because currently string value get from API
        let tDataSource = []
        if (Array.isArray(this.state.selectedOrderRestaurantData.image)) {
          for (let i = 0; i < this.state.selectedOrderRestaurantData.image.length; i++) {
            let imageData = this.state.selectedOrderRestaurantData.image[i];
            let imageURL = {url: imageData}
            tDataSource.push(imageURL)
          }
        } else if (typeof(this.state.selectedOrderRestaurantData.image) == 'string') {
          let imageURL = {url: this.state.selectedOrderRestaurantData.image}
          tDataSource.push(imageURL)
        }
        this.setState({ sliderDataSource: tDataSource })
      });
    }
  }

  render() {
    return (
      <View style={styles.rootView}>
        <TouchableOpacity
          style={styles.backView}
          onPress={() => {
            this.props.navigation.pop()
          }}
        >
          <Text style={styles.backTextView}>
            Back
          </Text>
        </TouchableOpacity>
        
        <Slideshow 
          dataSource={this.state.sliderDataSource}
          height={height*0.35} // ! Slide show height is 35% of screen height
          arrowSize={0}
        />
        <ScrollView 
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24
          }}
          showsVerticalScrollIndicator={false}
          style={styles.detailsView}
        >
          <Text style={styles.mainTitleView}>
            {this.state.selectedOrderRestaurantData.business_name}
          </Text>
          <TouchableOpacity onPress={() => {
            dialCall(this.state.selectedOrderRestaurantData.phone)
          }}>
            <Text style={styles.phoneView}>
              {this.state.selectedOrderRestaurantData.phone}
            </Text>
          </TouchableOpacity>
          <View style={styles.reviewView}>
            <Rating
              type="custom"
              ratingImage={require("../assets/images/Star-fill.png")}
              ratingCount={5}
              startingValue={0}
              imageSize={18}
              readonly={true}
              style={{paddingVertical: 12, alignSelf: 'flex-start'}}
            />
            <Text style={styles.reviewCountView}>
              ( {<Text style={{ color: COLORS.primary, fontWeight: '700' }}>
                  {this.state.selectedOrderRestaurantData.reviews}
                </Text>
              } Reviews )
            </Text>
          </View>
          <Text style={styles.titleView}>
            Description
          </Text>
          <Text style={styles.textView}>
            {this.state.selectedOrderRestaurantData.location}
          </Text>
          <Text style={styles.titleView}>
            Address
          </Text>
          <Text style={styles.textView}>
            {this.state.selectedOrderRestaurantData.address}
          </Text>
        </ScrollView>
      </View>
    );
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
  },
  detailsView: {
    flex: 1,
    marginTop: 8,
    padding: 12,
  },
  mainTitleView: {
    fontSize: 36,
    fontWeight: '400'
  },
  phoneView: {
    fontSize: 18,
    marginTop: 4,
    color: COLORS.gray
  },
  reviewView: {
    flexDirection: 'row'
  },
  reviewCountView: {
    marginLeft: 12,
    alignSelf: 'center'
  },
  titleView: {
    marginTop: 16,
    fontSize: 18
  },
  textView: {
    marginTop: 4,
    color: COLORS.gray,
    fontSize: 16
  }
});

const mapStateToProps = state => ({
  isConnected: state.auth.isConnected
});

const mapDispatchToProps = dispatch => {
  return {
  
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantDetails);