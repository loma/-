import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Platform,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  FlatList,
  AsyncStorage,
  Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image'

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
    flex:1,
    flexDirection:'column',
    borderBottomWidth:15,
    borderColor:'#CCC',
    backgroundColor:'white'
  },
  innerContainer: {
    flex:0.25,
    width:isIpad() ? 350 : 150,
    borderWidth:1,
    borderColor:'white'
  },
  image: {
    flex:1,
    height:isIpad() ? 350 : 150,
  },
  text: {
    fontSize: isIpad() ? 16 : 12,
    lineHeight: isIpad() ? 28 : 20,
    fontFamily:'Saysettha ot',
    color:'#222',
  },
  newIcon: {
    width: 20,
    height: 20,
    marginRight:5
  },
  fbIcon: {
    margin:5,
    width:30,
    height:30
  },
  singleImage: {
    width:200,
    height:200
  }
});

const serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
const uniqueId = require('react-native-device-info').getUniqueID();

class News extends React.PureComponent {
  timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " ປີ\n";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " ເດືອນ\n";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " ມື້\n";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " ຊົ່ວໂມງ\n";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " ນາທີ\n";
    }
    return Math.floor(seconds) + " ວິນາທີ";
  }

  render() {
    const toggleLike = this.props.toggleLike
    var data = this.props.data
    var lastId = this.props.lastId
    imagesData = data.images.split(',').filter((a) => a!=='')
    var newIcon = data.id > lastId ? <Image resizeMode={'contain'} source={require('../img/fire.png')} style={styles.newIcon} /> : null

    var heartImg = data.like ? require('../img/heart.png') : require('../img/heart_unselected.png')

    var images = null
    if (imagesData.length === 1) {
      images = <View style={{alignItems:'center'}}>
        <Image resizeMode={'contain'} source={{uri:imagesData[0]}} style={styles.singleImage} />
      </View>
    } else {
      images = <FlatList
          initialNumToRender={3}
          style={{height:200,backgroundColor:'white',flex:1}}
          data={imagesData}
          keyExtractor = {(item, index) => index}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item,index}) =>
            <FastImage
              resizeMode={ FastImage.resizeMode.cover }
              source={{
                uri:item,
                priority: FastImage.priority.normal,
              }}
              style={{width:200,height:200,marginLeft:0.5,marginRight:0.5}} />
        }/>
    }

    return (
      <View style={styles.container}>
        <View style={{paddingLeft:10,marginTop:5,flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
          {newIcon}
          <Image resizeMode={'contain'} source={require('../img/time.png')} style={styles.newIcon} />
          <Text style={{fontFamily:'Saysettha OT',color:'#999',fontSize:10,textAlign: "center",paddingTop:5}}>{this.timeSince(new Date(data.created_time))}</Text>
        </View>
        <View>
          {images}
        </View>
        <Text style={[styles.text, {marginLeft: 10,marginTop:5,marginRight:10,marginBottom:5}]} numberOfLines={9}>
          {data.description}
        </Text>
        <View style={{flexDirection:'row',justifyContent:'space-around',borderTopWidth:1,borderColor:'#CCC'}}>
            <TouchableOpacity onPress={toggleLike.bind(this, this.props.data)}>
              <Image resizeMode={'contain'} source={heartImg} style={[styles.fbIcon]} />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{
              var log = {'uId':uniqueId,'page':'fb_link','value':data.link}
              fetch(serverHost + '/activities.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(log)
              })
              Linking.openURL(data.link).catch(err => console.error('An error occurred', err));
            }}>
              <Image resizeMode={'contain'} source={require('../img/fb-icon.png')} style={styles.fbIcon} />
            </TouchableOpacity>
        </View>

      </View>
    )
  }
}

News.propTypes = {
  data: PropTypes.object.isRequired,
  lastId: PropTypes.number.isRequired,
};

export default News
