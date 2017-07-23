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
    borderBottomWidth:5,
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
    color:'#222'
  },
  newIcon: {
    width: (Platform.OS === 'ios') ? 20 : 50,
    height: (Platform.OS === 'ios') ? 20 : 50,
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

class News extends React.PureComponent {
  render() {
    const toggleLike = this.props.toggleLike
    var data = this.props.data
    var lastId = this.props.lastId
    imagesData = data.images.split(',').filter((a) => a!=='')
    var newIcon = data.id <= lastId ? <Text><Image resizeMode={'contain'} source={require('../img/star.png')} style={styles.newIcon} /> </Text> : null

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
        {images}
        <Text style={[styles.text, {marginLeft: 10,marginTop:5,marginRight:10,marginBottom:5}]} numberOfLines={8}>
          {newIcon}{data.description}
        </Text>
        <View style={{flexDirection:'row',justifyContent:'space-around',borderTopWidth:1,borderColor:'#CCC'}}>
            <TouchableOpacity onPress={toggleLike.bind(this, this.props.data)}>
              <Image resizeMode={'contain'} source={require('../img/heart.png')} style={[styles.fbIcon, {opacity:data.like?1:0.4}]} />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{
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
