import Geolocation from '@react-native-community/geolocation';
import {
  PermissionsAndroid,
  ToastAndroid,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import {isAndroid, isIOS} from '../screens/BaseScreen';
import AndroidOpenSettings from 'react-native-android-open-settings';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

// ? Get permission from user at first time when gps='yes' into Login API
export const getInitPermission = async () => {
  if (isAndroid) {
    const hasLocationPermission = await hasPermission();
    if (!hasLocationPermission) {
      return;
    }
  } else {
    console.log(`GetLocation.getInitPermission`)
    Geolocation.requestAuthorization();
  }
};

// ? Get latitude and longitude when goto survey
export const getCurrentLocation = async callback => {
  const hasLocationPermission = await hasPermission();
  if (!hasLocationPermission) {
    // return callback(null);
  }

  Geolocation.getCurrentPosition(
    position => {
      return callback(position);
    },
    error => {
      checkPermission(error);
      return callback(null);
    },
    {/* enableHighAccuracy: true, */ timeout: 20000 /* , maximumAge: 1000 */},
  );
};

// ? Check error and according to error take action
const checkPermission = error => {
  console.log(`checkPermission.ERROR:`, error);
  let msg = '';
  switch (error.code) {
    case error.PERMISSION_DENIED:
      msg = 'User denied the request for Geolocation.';
      console.log(`GetLocation.checkPermission`)
      showPermissionAlert();
      break;
    case error.POSITION_UNAVAILABLE:
      msg = 'Location information is unavailable.';
      showEnableLocationAlert();
      break;
    case error.TIMEOUT:
      msg = 'The request to get user location timed out.';
      showEnableLocationAlert();
      break;
    case error.UNKNOWN_ERROR:
      msg = 'An unknown error occurred.';
      break;
  }
  console.log(`ERROR_MESSAGE: ${msg}`);
};

// ? Check Permission for android and request for permission
const hasPermission = async () => {
  if (isIOS || (isAndroid && Platform.Version < 23)) {
    return true;
  }
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show('Location permission revoked by user', ToastAndroid.LONG);
  }

  return false;
};

// ? Open popup for re-enable permission from setting
const showPermissionAlert = () => {
  Alert.alert(
    'App Permission Denied',
    'To re-enable, please go to settings and turn on Location Service for this app.',
    [
      {
        text: 'SETTINGS',
        onPress: () => {
          if (isIOS) {
            Linking.canOpenURL('app-settings:')
              .then(supported => {
                if (!supported) {
                  //console.log('Can\'t handle settings url');
                } else {
                  return Linking.openURL('app-settings:');
                }
              })
              .catch(err => console.error('An error occurred', err));
          } else {
            AndroidOpenSettings.appDetailsSettings();
          }
        },
      },
    ],
    {cancelable: false},
  );
};

// ? Open system default location enable popup for android only
const showEnableLocationAlert = () => {
  if (isAndroid) {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        console.log(`data:`, data);
      })
      .catch(err => {
        console.log(`err:`, err);
      });
  } else {
    console.log(`GetLocation.showEnableLocationAlert`)
    showPermissionAlert();
  }
};
