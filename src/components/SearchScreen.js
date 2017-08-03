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

import Search from 'react-native-search-box';
import { connect } from 'react-redux';
import News from './News';
import AdMob from './AdMob';
import Config from './Config';
const conf = new Config();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontWeight:'100',
    lineHeight:conf.isIpad()?34:28,
    fontSize:conf.isIpad()?22:18,
    fontFamily:'Saysettha OT'
  }
});

class SearchScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      refreshing:false,
      minId:Number.MAX_SAFE_INTEGER,
      query:'',
    }
  }

  loadNews() {
    var q = this.state.query
    if (q === '') return
    this.setState({ refreshing:true })
    fetch(conf.getApiEndPoint() + '/posts.json?q=' + q)
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

  handleLoadMore() {
    var q = this.state.query
    if (q === '') return
    if (this.state.refreshing) return
    this.setState({ refreshing:true })
    var q = this.state.query
    fetch(conf.getApiEndPoint() + '/posts.json?field=more&minId='+this.state.minId+'&q=' + q)
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

  search(t) {
    this.setState({query:t})
    this.loadNews()
    if (this.props.configs.log_activity === 'true') {
      var q = this.state.query
      var data = {'uId':conf.getUniqueID(),'page':'search','value':q}
      fetch(conf.getApiEndPoint() + '/activities.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data)
      })
    }
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var posts = this.state.posts
    var likes = this.props.likes

    var lastReadId = this.props.lastReadId
    var lastId = lastReadId[0];
    if (lastId === undefined) lastId = 0

    for (var index in posts) {
      posts[index]['like'] = likes[posts[index].id] ? true : false
    }

    var list = null
    if (this.state.posts.length === 0 && this.state.query !== '' && this.state.refreshing === false) {
      list = <View style={{flex:1,padding:30}}>
          <Text style={{textAlign:'center',lineHeight:28,color:'#777',fontSize:16,fontFamily:'Saysettha OT'}}>ບໍ່ມີສິນຄ້າທີ່ມີຄຳວ່າ {this.state.query}</Text>
        </View>
    } else {
      list = <ListView
        dataSource={ds.cloneWithRows(posts)}
        renderRow={(rowData, sectionID, rowID, highlightRow) => {
            if (rowID % 3 === 0)
              return (<View><News data={rowData} lastId={lastId} {...this.props}/><AdMob /></View>)
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
    }
    return (
      <View style={{flex:1, paddingTop: (Platform.OS === 'ios') ? 23 : 0 }}>
          <Search
            backgroundColor={'#e77d1f'}
            placeholder={'ຊອກຫາ'}
            onSearch={(t) => {this.search(t)}}
          />
        {list}
      </View>
    )
  }
}

SearchScreen.navigationOptions =
  ({ navigation }) => ({
    header: null
  });

SearchScreen.propTypes = {
};

const mapStateToProps = state => ({
  likes: state.news.likes,
  lastReadId: state.news.lastReadId,
  configs: state.news.configs
});
const mapDispatchToProps = dispatch => ({
  initLastReadCategories: (lastRead) => dispatch({ type: 'initLastReadCategories', value:lastRead }),
  setReadVersion: (version) => dispatch({ type: 'setReadVersion', value:version }),
  navigate: (page, id, n) => dispatch({ type: page }),
  toggleLike: (post) => {
    dispatch({ type: 'toggleLike', value:post })
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
