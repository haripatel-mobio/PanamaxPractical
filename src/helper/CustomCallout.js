import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import BaseScreen, { isIOS } from '../screens/BaseScreen';
import { COLORS } from '../helper/Color';
import { Rating } from 'react-native-elements';

let ratingValue = 5

class CustomCallout extends BaseScreen {
  state = {
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ height: isIOS ? 'auto' : 54, marginTop: isIOS ? 'auto' : 4 }}>
        <Text>{this.props.restaurantData.business_name}</Text>
        {/* <Text>
          <Image
            style={{width: 20, height: 20}}
            source={require("../assets/images/Star-fill.png")}
            resizeMode="cover"
          />
        </Text> */}
        {isIOS ? 
          <Rating
            type="custom"
            ratingImage={require("../assets/images/Star-fill.png")}
            ratingCount={5}
            startingValue={0}
            imageSize={18}
            readonly={true}
            style={{paddingVertical: 2, alignSelf: 'flex-start'}}
          /> : 
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {this.loadAndroidRatingView()}
          </View>
        }
      </View>
    );
  }

  loadAndroidRatingView = () => {
    var ratingView = []
    for (let i = 0; i < 5; i++) {
      if (i < ratingValue) {
        ratingView.push(
          <Text>
            <Image
              style={{width: 20, height: 20}}
              source={require("../assets/images/Star-fill.png")}
              resizeMode="cover"
            />
          </Text>
        )
      } else {
        ratingView.push(
          <Text>
            <Image
              style={{width: 20, height: 20}}
              source={require("../assets/images/Star-empty.png")}
              resizeMode="cover"
            />
          </Text>
        )
      }
    }
    return ratingView
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

export default CustomCallout;