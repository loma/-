import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  Alert,
  View,
  AsyncStorage,
  Dimensions,
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

isIpad = () => {
  var width = Dimensions.get('window').width;
  var height = Dimensions.get('window').height;

  if (width == 768 && height == 1024) return true
  if (width == 834 && height == 1112) return true
  if (width == 1024 && height == 1366) return true

  return false;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontWeight:'100',
    lineHeight:isIpad()?34:28,
    fontSize:isIpad()?22:18,
    fontFamily:'Saysettha OT'
  }
});

var serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
function _onRefresh(init, initCat) {
  return fetch(serverHost + '/news.json')
    .then((response) => response.json())
    .then((news) => {
      init(news)
    })
    .catch((error) => {
      init([])
  });
}

//const PromotionsScreen = ({selectedCatId, initCat, news, loaded, init}) => {
class PromotionsScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      refreshing:false
    }
  }

  componentDidMount() {
    Alert.alert(
      'Alert Title',
      'My Alert Msg',
      [
        {text: 'OK', onPress: () => {}},
      ],
      { cancelable: false }
    )
  }

  componentWillUnmount() {
    const initLastReadCategories = this.props.initLastReadCategories
    var lastReadId = this.props.lastReadId
    lastReadId[this.props.selectedCatId] = this.props.maxId[this.props.selectedCatId]
    AsyncStorage.setItem('@LASTREAD_ID:key', JSON.stringify(lastReadId))
      .then((error)=>{
        if (error == null) {
          initLastReadCategories(lastReadId)
        }
      })
  }

  render() {
    var maxIdRead = this.props.maxId[this.props.selectedCatId]
    var allNews = []
    const news = this.props.news
    var keys = Object.keys(news);
    var values = keys.map(function(v) { return news[v]; });
    values.sort((a,b) => {return b.id - a.id})

    for(var index in values) {
      if (values[index].category_id === this.props.selectedCatId && values[index].images.length > 0)
        allNews.push(values[index])
    }

    var adv = __DEV__ ? null : <View style={{flexDirection:'row',justifyContent:'center'}}>
          <AdMobBanner
            style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
            bannerSize="banner"
            adUnitID="ca-app-pub-5604817964718511/5290589982"
            testDeviceID="EMULATOR" />
        </View>

    var lastReadId = this.props.lastReadId
    var lastId = lastReadId[this.props.selectedCatId];
    return (
      <View style={{flex:1}}>
        <FlatList
          data={allNews}
          renderItem={({item}) => <News key={item.id} data={item} lastId={lastId}/> }
          keyExtractor = {(item, index) => item.id}
          refreshing={this.state.refreshing}
          onRefresh={()=>{
            this.setState({refreshing:true})
            _onRefresh(this.props.init, this.props.initCat)
              .then(()=>{
                this.setState({refreshing:false})
              })
          }}
        />
        {adv}
      </View>
    )
  }
}

PromotionsScreen.navigationOptions =
  ({ navigation }) => ({
    title: <Text style={styles.header}>{navigation.state.params.name}</Text>,
  });

PromotionsScreen.propTypes = {
  news: PropTypes.object.isRequired,
  selectedCatId: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  news: state.news.list,
  selectedCatId: state.news.selectedCatId,
  maxId: state.news.maxId,
  lastReadId: state.news.lastReadId
});
const mapDispatchToProps = dispatch => ({
  init: (news) => dispatch({ type: 'init', value:news }),
  initLastReadCategories: (lastRead) => dispatch({ type: 'initLastReadCategories', value:lastRead }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionsScreen);
