import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ListView,
  Modal,
  Alert,
  TouchableHighlight,
  Image,
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
} from 'react-native-admob'
import DialogBox from 'react-native-dialogbox';

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

const serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
const uniqueId = require('react-native-device-info').getUniqueID();
class HotScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      modalVisible:true,
      refreshing:true,
      minId:Number.MAX_SAFE_INTEGER,
    }
  }

  loadNews() {
    this.setState({ refreshing:true })
    var pageId = 0
    fetch(serverHost + '/posts.json?pageId=' + pageId)
      .then((response) => response.json())
      .then((posts) => {
        if (posts.length > 0) var minId = posts[posts.length - 1].id
        this.setState({
          refreshing:false,
          posts:posts,
          minId:minId
        })
      })
      .catch((error) => {
        this.setState({ refreshing:false })
       });
  }

  componentDidMount() {
    this.loadNews()
    var data = {'uId':uniqueId,'page':'hot','pageId':0}
    fetch(serverHost + '/activities.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(data)
    })
  }

  componentWillUnmount() {
    const initLastReadCategories = this.props.initLastReadCategories
    var lastReadId = this.props.lastReadId
    if (this.state.posts.length > 0) {
      lastReadId[0] = this.state.posts[0].id
      AsyncStorage.setItem('@LASTREADID:key', JSON.stringify(lastReadId))
        .then(()=>{
          initLastReadCategories(lastReadId)
        })
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  handleLoadMore() {
    if (this.state.refreshing) return
    this.setState({ refreshing:true })
    var pageId = 0
    fetch(serverHost + '/posts.json?field=more&minId='+this.state.minId+'&pageId=' + pageId)
      .then((response) => response.json())
      .then((posts) => {
        var minId = this.state.minId
        var oldNews = this.state.posts
        for(var n of posts) {
          if (n.id < minId) {
            oldNews.push(n)
            minId = n.id
          }
        }
        this.setState({
          refreshing:false,
          posts:oldNews,
          minId:minId
        })
      })
      .catch((error) => {
        this.setState({ refreshing:false })
      });
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var posts = this.state.posts
    var likes = this.props.likes
    var adv = __DEV__ ? null : <View style={{
      flexDirection:'row',justifyContent:'center',
      borderColor:'#CCC',backgroundColor:'#CCC',
      borderBottomWidth:5
    }}>
          <AdMobBanner
            style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
            bannerSize="banner"
            adUnitID="ca-app-pub-5604817964718511/5290589982"
            testDeviceID="EMULATOR" />
        </View>

    var lastReadId = this.props.lastReadId
    var lastId = lastReadId[0];
    if (lastId === undefined) lastId = 0

    for (var index in posts) {
      posts[index]['like'] = likes[posts[index].id] ? true : false
    }
    return (
      <View style={{flex:1}}>
        <View style={{
            backgroundColor:'#e77d1f',
            alignItems:'center',
            paddingTop: (Platform.OS === 'ios') ? 23 : 0
          }}
          elevation={2}>
            <Text style={{
              fontSize:16,
              lineHeight:25,
              margin:8,
              color:'white',
              fontFamily:'Saysettha OT'
            }}>ສິນຄ້າມາໃຫ່ມ</Text>
          </View>
        <ListView
          dataSource={ds.cloneWithRows(posts)}
          renderRow={(rowData, sectionID, rowID, highlightRow) => {
              if (rowID % 5 === 0)
                return (<View><News data={rowData} lastId={lastId} {...this.props}/>{adv}</View>)
              else
                return (<News data={rowData} lastId={lastId} {...this.props}/>)
            }
          }
          refreshing={this.state.refreshing}
          onRefresh={()=>{
            this.handleLoadMore()
          }}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {this.handleLoadMore()}}
          onEndReachedThreshold={500}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {this.handleLoadMore()}}
            />
          }
        />
      </View>
    )
  }
}

HotScreen.navigationOptions =
  ({ navigation }) => ({
    header: null
  });

HotScreen.propTypes = {
};

const mapStateToProps = state => ({
  likes: state.news.likes,
  lastReadId: state.news.lastReadId,
});
const mapDispatchToProps = dispatch => ({
  initLastReadCategories: (lastRead) => dispatch({ type: 'initLastReadCategories', value:lastRead }),
  setReadVersion: (version) => dispatch({ type: 'setReadVersion', value:version }),
  navigate: (page, id, n) => dispatch({ type: page }),
  toggleLike: (post) => {
    dispatch({ type: 'toggleLike', value:post })
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HotScreen);
