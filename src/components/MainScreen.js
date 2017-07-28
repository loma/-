import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  Text,
  RefreshControl,
  TouchableOpacity,
  Platform,
  Dimensions,
  AsyncStorage
} from 'react-native';
import {
  AdMobBanner,
} from 'react-native-admob'
import FastImage from 'react-native-fast-image'
const CachedImage = require('react-native-cached-image');
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
  title: {
    flex:1,
    paddingTop: (Platform.OS === 'ios') ? 3 : 0,
    paddingBottom: (Platform.OS === 'ios') ? 0 : 3,
    borderColor: '#fff',
    width:Dimensions.get('window').width/3,
    backgroundColor: 'rgba(255,255,255,0.8)',
    color: '#222',textAlign:'center',position:'absolute',bottom:0,
    fontSize:isIpad()?18:14,
    lineHeight:isIpad()?28:25,
    fontFamily:'Saysettha OT'
  },
  newIcon: {
    position:'absolute',
    top: 5,
    right: 5,
    width:20,
    height:20
  },
});

const serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
const uniqueId = require('react-native-device-info').getUniqueID();

class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing:true,
      pages:[],
      categories:[]
    }
  }

  loadCategories() {
    this.setState({ refreshing:true })
    fetch(serverHost + '/categories.json')
      .then((response) => response.json())
      .then((categories) => {
        this.setState({
          refreshing:false,
          categories:categories
        })
      })
      .catch((error) => {});
  }
  loadShops() {
    this.setState({ refreshing:true })
    fetch(serverHost + '/pages.json')
      .then((response) => response.json())
      .then((pages) => {
        this.setState({
          refreshing:false,
          pages:pages.sort((a,b) => { return a.order === b.order ? b.like - a.like : a.order - b.order })
        })
      })
      .catch((error) => {});
  }

  loadReadVersion() {
    const initLastReadCategories = this.props.initLastReadCategories
    AsyncStorage.getItem('@LASTREADID:key')
      .then((result)=>{
        if (result) {
          initLastReadCategories(JSON.parse(result))
        }
      })
  }

  loadLikes() {
    const initLikes = this.props.initLikes
    AsyncStorage.getItem('@LIKES:key')
      .then((result)=>{
        if (result) {
          initLikes(JSON.parse(result))
        }
      })
  }

  loadConfig() {
    const initConfig = this.props.initConfig
    return fetch(serverHost + '/configs.json')
      .then((response) => response.json())
      .then((configs) => {
        var conf = {}
        for (var c in configs) conf[configs[c].key] = configs[c].value
        initConfig(conf)
      })
      .catch((error) => {});
  }

  componentDidMount() {
    this.loadConfig()
      .then(() => {
        if (this.props.configs.log_activity === 'true') {
          var data = {'uId':uniqueId,'page':'main'}
          fetch(serverHost + '/activities.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(data)
          })
        }
      })
  }

  componentWillMount() {
    this.loadCategories()
    this.loadLikes()
    this.loadShops()
    this.loadReadVersion()
  }

  render() {
    var categories = this.state.categories.sort((a,b) => {return a.order === b.order ? a.id - b.id : a.order - b.order})
    var pages = this.state.pages
    var lastReadId = this.props.lastReadId
    const promotions = this.props.promotions

    var tempCategories = {}
    for (var c of categories) {
      tempCategories[c.id] = {
        header: <View key={'h' + c.id} style={{
            backgroundColor:'#e77d1f',
            alignItems:'center',
          }}
          elevation={2}>
            <Text style={{
              fontSize:16,
              lineHeight:23,
              margin:8,
              color:'white',
              fontFamily:'Saysettha OT'
            }}>{c.name}</Text>
          </View>,
        pages: []
      }
    }

    for (var p of pages) {
      var category_id = p.category_id
      if (tempCategories[category_id]) {

        var notif = null;
        var pageId = p.id
        var name = p.name
        var currentId = lastReadId[pageId] | 0
        var lastId = p.last_id | 0
        if (currentId < lastId) {
            notif = <Image resizeMode={'contain'} source={require('../img/fire.png')} style={styles.newIcon} />
        }
        tempCategories[category_id].pages.push(
          <View key={p.id} style={{
            justifyContent:'center',
            alignItems:'center'
          }}>
            <TouchableOpacity onPress={promotions.bind(this, pageId, name)}>
              <FastImage
                resizeMode={ FastImage.resizeMode.cover }
                elevation={3}
                style={{backgroundColor:'white',
                  height:Dimensions.get('window').width/3,
                  width:Dimensions.get('window').width/3,
                }}
                source={{uri:p.picture}} />
            </TouchableOpacity>
            <Text
              ellipsizeMode='tail'
              numberOfLines={1}
              style={styles.title}>
              {p.name}
            </Text>
            {notif}
          </View>
        )
      }
    }

    var adv = <View style={{
      flexDirection:'row',justifyContent:'center',
      borderColor:'#CCC',backgroundColor:'rgba(0,0,0,0)',
      borderBottomWidth:5
    }}>
      <AdMobBanner
        style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
        bannerSize="banner"
        adUnitID="ca-app-pub-5604817964718511/5290589982"
        testDeviceID="EMULATOR" />
    </View>

    var all = []
    var categoryIndex = 0;
    for (var index in categories) {
      sortedIndex = categories[index].id
      if (tempCategories[sortedIndex].pages.length === 0) continue
      all.push(tempCategories[sortedIndex].header)
      var pageCount = tempCategories[sortedIndex].pages.length
      var pages = tempCategories[sortedIndex].pages
      for (var index=0; index<pageCount; index+=3) {
        var temp = []
        for (var innerIndex=index; innerIndex<Math.min(index+3, pageCount); innerIndex++) {
          temp.push(pages[innerIndex])
        }
        all.push(
          <View key={'r' + sortedIndex + '-' + index}>
            <View key={index} style={{flexDirection:'row'}}>
              {temp}
            </View>
          </View>
        )
      }
      all.push(<View key={'e' + sortedIndex} style={{padding:5,backgroundColor:'#CCC'}}></View>)
    }



    return (
      <View style={{flex:1,
        paddingTop: (Platform.OS === 'ios') ? 23 : 0
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={()=>{
                  this.loadCategories()
                  this.loadShops()
                }}
              />
        }>

      <View style={{flexDirection:'column',justifyContent:'space-around'}}>
        {all}
      </View>

      </ScrollView>
      </View>
    )
  }
}


MainScreen.navigationOptions = {
  header: null,
};

MainScreen.propTypes = {
  promotions: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  lastReadId: state.news.lastReadId,
  configs: state.news.configs,
});
const mapDispatchToProps = dispatch => ({
  navigate: (page, id, n) => dispatch({ type: page, value:id, name:n }),
  promotions: (id, n) => {
    dispatch({ type: 'promotions', value:id, name:n })
  },
  initLastReadCategories: (lastRead) => dispatch({ type: 'initLastReadCategories', value:lastRead }),
  initLikes: (likes) => dispatch({ type: 'init-likes', value:likes }),
  initConfig: (conf) => dispatch({ type: 'init-configs', value:conf }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
