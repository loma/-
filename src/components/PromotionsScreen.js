import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  Text,
  RefreshControl,
} from 'react-native';
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
var serverHost = __DEV__ ? 'http://10.0.2.2:3000' : 'https://borktor.57bytes.com/'
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

const PromotionsScreen = ({selectedCatId, initCat, news, loaded, init}) => {
  if (!loaded.status) {
    refreshing = true
    _onRefresh(init, initCat)
  }

  var allNews = []
  var keys = Object.keys(news);
  var values = keys.map(function(v) { return news[v]; });

  for(var index in values) {
    if (values[index].category_id === selectedCatId)
      allNews.push(<News key={values[index].id} data={values[index]} />)
  }
  allNews.push(<View key={0} style={{height:100}}></View>)
  return (
    <View style={{flex:1}}>
    <ScrollView
    refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>{_onRefresh(init, initCat)}}
          />
        }>
      {allNews}
    </ScrollView>
    </View>
  )
}

var header = <View style={{marginTop:30,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'white'}} elevation={5}>
  <Image style={{width:40,height:40}} source={require('../img/logo.png')}/>
  <Text style={{fontFamily:'Saysettha ot',fontSize:20,color:'#4b5056',fontWeight:"500",padding:5}}> ບອກຕໍ່ </Text>
</View>

PromotionsScreen.navigationOptions =
  ({ navigation }) => ({
    title: `${navigation.state.params.name}`,
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
