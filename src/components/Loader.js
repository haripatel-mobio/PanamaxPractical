import React from 'react';
import BaseScreen, {isAndroid} from '../screens/BaseScreen';
import {Overlay} from 'react-native-elements';
import * as Progress from 'react-native-progress';
import {View} from 'react-native';
import { COLORS } from '../helper/Color';

let progressSize = 56;

class Loader extends BaseScreen {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Overlay
        overlayStyle={{
          justifyContent: 'center',
          position: 'absolute',
          zIndex: 100,
          height: '100%',
          width: '100%',
          backgroundColor: COLORS.loaderBGColor,
          shadowColor: 'transparent',
        }}
        fullScreen={isAndroid ? true : false}
        overlayBackgroundColor="transparent"
        isVisible={this.props.showLoader}
        width="auto"
        height="auto"
        supportedOrientations={['portrait', 'landscape']}>
        <View
          style={{
            zIndex: 2,
            backgroundColor: 'white',
            padding: 6,
            borderRadius: progressSize,
            alignSelf: 'center',
          }}>
          <Progress.CircleSnail
            size={progressSize}
            indeterminate={true}
            thickness={5}
            duration={500}
            strokeCap={'round'}
            style={{alignSelf: 'center'}}
            color={[COLORS.primary]}
          />
        </View>
      </Overlay>
    );
  }
}

export default Loader;