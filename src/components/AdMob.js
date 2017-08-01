import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  AdMobBanner,
} from 'react-native-admob'

const styles = StyleSheet.create({
  container: {
    marginTop:-10,
    flexDirection:'row',justifyContent:'center',
    borderColor:'#CCC',backgroundColor:'#CCC',
    borderBottomWidth:5
  },
  adv: {
    flexDirection:'row',justifyContent:'center',
    alignItems:'center'
  }
});

class AdMob extends Component {
  render() {
    return (
      <View style={styles.container}>
        <AdMobBanner
          style={styles.adv}
          bannerSize="banner"
          adUnitID="ca-app-pub-5604817964718511/5290589982"
          testDeviceID="EMULATOR" />
      </View>
    )
  }
}

export default AdMob
