import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  Text,
  RefreshControl,
  TouchableOpacity,
  Platform
} from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'react-native-admob'
import { connect } from 'react-redux';
import News from './News';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

var refreshing = false;
var serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
const uniqueId = require('react-native-device-info').getUniqueID();
function _onRefresh(init, initCategories) {
  fetch(serverHost + '/categories.json')
    .then((response) => response.json())
    .then((categories) => {
      refreshing = false;
      initCategories(categories)
    })
    .catch((error) => {});

  fetch(serverHost + '/news.json')
    .then((response) => response.json())
    .then((news) => {
      refreshing = false;
      init(news)
    })
    .catch((error) => {
      refreshing = false;
      init([])
  });
}

const MainScreen = ({promotions, categories, loaded, init, initCategories}) => {
  if (!loaded.status) {
    refreshing = true
    _onRefresh(init, initCategories)
  }

  var all = []
  for (var index=0; index<categories.length; index+=3) {

    var temp = []
    for (var innerIndex=index; innerIndex<Math.min(index+3, categories.length); innerIndex++) {
      temp.push(
      <TouchableOpacity key={innerIndex} onPress={promotions.bind(this, categories[innerIndex].id, categories[innerIndex].name)}>
        <View style={{justifyContent:'center',alignItems:'center'}}>
          <Image elevation={5} style={{backgroundColor:'white',width:100,height:100}} source={{uri:categories[innerIndex].image}} />
          <Text style={{marginTop: 12,fontSize:18,lineHeight:30,fontFamily:'Saysettha OT'}}>{categories[innerIndex].name}</Text>
        </View>
      </TouchableOpacity>
      )
    }
    all.push(
    <View key={index} style={{marginTop:5,marginLeft:0,marginRight:0,flexDirection:'row',justifyContent:'space-between'}}>
      {temp}
    </View>
    )

  }

  return (
    <View style={{flex:1}}>
    <ScrollView
    refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>{_onRefresh(init, initCategories)}}
          />
        }
    >

    <View style={{marginTop:30,marginLeft:30,marginRight:30,flexDirection:'column',justifyContent:'space-around'}}>
      {all}
    </View>

    </ScrollView>
    <AdMobBanner
      style={{justifyContent:'center',alignItems:'center'}}
      bannerSize="banner"
      adUnitID="ca-app-pub-5604817964718511/5290589982"
      testDeviceID="EMULATOR" />
    </View>
  )
}

var header = <View style={{
  marginTop:(Platform.OS === 'ios') ? 20 : 0,
  flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'white'}} elevation={5}>
  <Image style={{width:40,height:40}} source={require('../img/logo.png')}/>
  <Text style={{fontFamily:'Saysettha ot',fontSize:20,color:'#4b5056',fontWeight:"500",padding:5}}> ບອກຕໍ່ </Text>
</View>

MainScreen.navigationOptions = {
  header: header,
  headerStyle: {textAlign:'center'}
};

MainScreen.propTypes = {
  categories: PropTypes.array.isRequired,
  promotions: PropTypes.func.isRequired,
  loaded: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  categories: state.news.categories,
  loaded: state.news.loaded,
});
const mapDispatchToProps = dispatch => ({
  init: (news) => dispatch({ type: 'init', value:news }),
  initCategories: (cats) => dispatch({ type: 'initCategories', value:cats }),
  promotions: (id, n) => dispatch({ type: 'promotions', value:id, name:n }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
