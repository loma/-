import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';
var Lightbox = require('react-native-lightbox');
const News = ({ data }) => {
return (
  <View style={{flex:1,flexDirection:'column',borderBottomWidth:5,borderColor:'#777',backgroundColor:'white'}} elevation={5}>

    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <View style={{flex:0.25,borderWidth:1,borderColor:'white'}}>
        <Lightbox>
            <Image
            resizeMode="contain"
            source={{uri:data.images[0]}}
            style={{height:100,flex:1, width: null}} />
            </Lightbox>
      </View>
      <View style={{flex:0.25,borderWidth:1,borderColor:'white'}}>
        <Lightbox>
          <Image
          resizeMode="contain"
          source={{uri:data.images[1]}}
          style={{height:100,flex:1, width: null}} />
        </Lightbox>
      </View>
      <View style={{flex:0.25,borderWidth:1,borderColor:'white'}}>
        <Lightbox>
          <Image
          resizeMode="contain"
          source={{uri:data.images[2]}}
          style={{height:100,flex:1, width: null}} />
        </Lightbox>
      </View>
      <View style={{flex:0.25,borderWidth:1,borderColor:'white'}}>
        <Lightbox>
          <Image
          resizeMode="contain"
          source={{uri:data.images[3]}}
          style={{height:100,flex:1, width: null}} />
        </Lightbox>
      </View>
    </View>

    <View style={{flex:1,flexDirection:'column',marginRight:5,marginLeft:5}}>

      <Text numberOfLines={5} ellipsizeMode={'tail'}
        style={{fontSize:12,fontFamily: 'Saysettha OT',marginTop:5,marginLeft:5,padding:5}}>
        {data.title}
      </Text>

      <View style={{flexDirection:'row',alignItems:'center' }}>
        <TouchableOpacity onPress={()=>{Linking.openURL(data.fb_url).catch(err => console.error('An error occurred', err));}}>
          <Image source={require('../img/fb.png')} style={{margin:2, width:20,height:20}} />
        </TouchableOpacity>
        <Image source={require('../img/discount.png')} style={{margin:2, width:20,height:20}} />
        <Text style={{fontSize:12,lineHeight:20,fontFamily:'Saysettha ot'}}>{data.price}</Text>
      </View>
    </View>
  </View>
)
}

News.propTypes = {
  data: PropTypes.object.isRequired,
};

export default News
