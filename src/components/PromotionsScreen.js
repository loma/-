import React from 'react';
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
      allNews.push(values[index])
  }
  return (
    <View style={{flex:1}}>
      <FlatList
        data={allNews}
        renderItem={({item}) => <News key={item.id} data={item} /> }
        keyExtractor = {(item, index) => item.id}
      />
    </View>
  )
}

PromotionsScreen.navigationOptions =
  ({ navigation }) => ({
    title: <Text style={{lineHeight:30,fontSize:18,fontFamily:'Saysettha OT'}}>{navigation.state.params.name}</Text>,
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
