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

import { connect } from 'react-redux';
import News from './News';
import AdMob from './AdMob';

import Config from './Config';
const conf = new Config();

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#e77d1f',
    alignItems:'center',
    paddingTop: (Platform.OS === 'ios') ? 23 : 0
  },
  header: {
    fontSize:16,
    lineHeight:25,
    margin:8,
    color:'white',
    fontFamily:'Saysettha OT'
  }
});

class PromotionsScreen extends Component {
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
    var pageId = this.props.pageId
    fetch(conf.getApiEndPoint() + '/posts.json?pageId=' + pageId)
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
    if (this.props.configs.log_activity === 'true') {
      var data = {'uId':conf.getUniqueID(),'page':'promotions','pageId':this.props.pageId}
      fetch(conf.getApiEndPoint() + '/activities.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data)
      })
    }
  }

  componentWillUnmount() {
    const initLastReadCategories = this.props.initLastReadCategories
    var lastReadId = this.props.lastReadId
    if (this.state.posts.length > 0) {
      lastReadId[this.props.pageId] = this.state.posts[0].id
      AsyncStorage.setItem('@LASTREADID:key', JSON.stringify(lastReadId))
        .then(()=>{
          initLastReadCategories(lastReadId)
        })
    }
  }

  handleLoadMore() {
    if (this.state.refreshing) return
    this.setState({ refreshing:true })
    var pageId = this.props.pageId
    fetch(conf.getApiEndPoint() + '/posts.json?field=more&minId='+this.state.minId+'&pageId=' + pageId)
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

  renderRow(rowData, sectionID, rowID, highlightRow) {
    var lastReadId = this.props.lastReadId
    var lastId = lastReadId[this.props.pageId] || 0;
    if (rowID % 3 === 0)
      return (<View><News data={rowData} lastId={lastId} /><AdMob /></View>)
    else
      return (<News data={rowData} lastId={lastId} />)
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var posts = this.state.posts
    var likes = this.props.likes

    for (var index in posts) {
      posts[index]['like'] = likes[posts[index].id] ? true : false
    }
    return (
      <View>
        <View style={styles.container} elevation={2}>
            <Text style={styles.header}>{this.props.navigation.state.params.name}</Text>
        </View>
        <ListView
            dataSource={ds.cloneWithRows(posts)}
            renderRow={this.renderRow.bind(this)}
            refreshing={this.state.refreshing}
            onRefresh={this.handleLoadMore.bind(this)}
            enableEmptySections={true}
            showsVerticalScrollIndicator={false}
            onEndReached={this.handleLoadMore.bind(this)}
            onEndReachedThreshold={500}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleLoadMore.bind(this)}
              />
            }
        />
      </View>
    )
  }
}

PromotionsScreen.navigationOptions = ({ navigation }) => ({
  header:null
});

PromotionsScreen.propTypes = {
  pageId: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  pageId: state.news.pageId,
  likes: state.news.likes,
  lastReadId: state.news.lastReadId,
  configs: state.news.configs
});
const mapDispatchToProps = dispatch => ({
  initLastReadCategories: (lastRead) => dispatch({ type: 'initLastReadCategories', value:lastRead }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionsScreen);
