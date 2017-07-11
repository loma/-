import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  Text,
  RefreshControl,
  FlatList,
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
function _onRefresh(init, initCat) {
  refreshing = true;
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

//const PromotionsScreen = ({selectedCatId, initCat, news, loaded, init}) => {
class PromotionsScreen extends Component {
  render() {
    if (!this.props.loaded.status) {
      refreshing = true
      _onRefresh(this.props.init, this.props.initCat)
    }

    var allNews = []
    const news = this.props.news
    var keys = Object.keys(news);
    var values = keys.map(function(v) { return news[v]; });
    values.sort((a,b) => {return b.id - a.id})

    for(var index in values) {
      if (values[index].category_id === this.props.selectedCatId && values[index].images.length > 0)
        allNews.push(values[index])
    }
    return (
      <View style={{flex:1}}>
        <FlatList
          data={allNews}
          renderItem={({item}) => <News key={item.id} data={item} /> }
          keyExtractor = {(item, index) => item.id}
          refreshing={refreshing}
          onRefresh={()=>{_onRefresh(this.props.init, this.props.initCat)}}
        />
        <View style={{flexDirection:'row',justifyContent:'center'}}>
          <AdMobBanner
            style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
            bannerSize="banner"
            adUnitID="ca-app-pub-5604817964718511/5290589982"
            testDeviceID="EMULATOR" />
        </View>
      </View>
    )
  }
}

PromotionsScreen.navigationOptions =
  ({ navigation }) => ({
    title: <Text style={{fontWeight:'100',lineHeight:28,fontSize:18,fontFamily:'Saysettha OT'}}>{navigation.state.params.name}</Text>,
  });

PromotionsScreen.propTypes = {
  news: PropTypes.object.isRequired,
  loaded: PropTypes.object.isRequired,
  selectedCatId: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  news: state.news.list,
  selectedCatId: state.news.selectedCatId,
  loaded: state.news.loaded,
});
const mapDispatchToProps = dispatch => ({
  init: (news) => dispatch({ type: 'init', value:news }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionsScreen);
