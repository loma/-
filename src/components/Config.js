import {
  Platform,
  Dimensions,
} from 'react-native';

const serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
const uniqueId = require('react-native-device-info').getUniqueID();

class Config {
  isIpad() {
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;
    if (width == 768 && height == 1024) return true
    if (width == 834 && height == 1112) return true
    if (width == 1024 && height == 1366) return true
    return false;
  }

  getApiEndPoint() {
    return serverHost
  }

  getUniqueID() {
    return uniqueId
  }
}

export { Config as default}
