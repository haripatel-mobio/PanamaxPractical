import {Component} from 'react';
import {StatusBar} from 'react-native';
import {Dimensions, Platform} from 'react-native';
import Toast from 'react-native-root-toast';

var toast = null;

export const {height, width} = Dimensions.get('window');
export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

export const isValueNull = value => {
  return value === undefined || value === null || value === '';
};

export const showToast = (
  message = 'Something went wrong. Please try again.',
) => {
  if (isValueNull(message) && typeof(message) != 'string') {
    message = 'Something went wrong. Please try again.';
  }
  if (toast) {
    Toast.hide(toast);
  }
  toast = Toast.show(message, {
    keyboardAvoiding: false,
    position: -100,
    opacity: 1,
  });
  return toast;
};

// ! from this a/c 
export const GOOGLE_API_KEY = 'AIzaSyAFBmCNOPrVgEmKK_5fWqPeEcsS3x8uWpE';

class BaseScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    StatusBar.setBarStyle('light-content', true);
  }
}

export default BaseScreen;
