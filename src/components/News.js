import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
var Lightbox = require('react-native-lightbox');

const News = ({ data, like, dislike, myActions }) => {
  var likeBGColor = myActions[data.id] === 1 ? '#7c8ec4' : 'white'
  var dislikeBGColor = myActions[data.id] === -1 ? '#c65e68' : 'white'
  var till = new Date(data.valid_till)
return (
  <View style={{flex:1,flexDirection:'column',borderBottomWidth:5,borderColor:'#777',backgroundColor:'white'}} elevation={5}>

    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <View style={{flex:0.25,borderWidth:1,borderColor:'white'}}>
      <Lightbox>
        <Image
        resizeMode="contain"
        source={{uri:'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/19059595_1974631992767857_2051369670273566565_n.jpg?oh=d72be7b9f123f67144d971d4b1408c1d&oe=5A104A8B'}}
        style={{height:100,flex:1, width: null}} />
        </Lightbox>
      </View>
      <View style={{flex:0.25,borderWidth:1,borderColor:'white'}}>
      <Lightbox>
        <Image
        resizeMode="contain"
        source={{uri:'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/19260564_1274334862684277_2960324026440460439_n.jpg?oh=ebf194410ea695b69b1226621c4c459a&oe=59DA4025'}}
        style={{height:100,flex:1, width: null}} />
        </Lightbox>
      </View>
      <View style={{flex:0.25,borderWidth:1,borderColor:'white'}}>
      <Lightbox>
        <Image
        resizeMode="contain"
        source={{uri:'https://scontent-hkg3-1.xx.fbcdn.net/v/t31.0-8/p960x960/19054999_1396745570413227_4416911429725949705_o.jpg?oh=bb1fdd0ceb4749bfec73ad9cc20e573b&oe=59CFAED3'}}
        style={{height:100,flex:1, width: null}} />
        </Lightbox>
      </View>
      <View style={{flex:0.25,borderWidth:1,borderColor:'white'}}>
      <Lightbox>
        <Image
        resizeMode="contain"
        source={{uri:'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/18893208_824627067702989_5330442418014991375_n.jpg?oh=8c665d77c2ac024f6e6ba539a4d460e9&oe=59D35D46'}}
        style={{height:100,flex:1, width: null}} />
        </Lightbox>
      </View>
    </View>
    <View style={{flex:1,flexDirection:'column',marginRight:5,marginLeft:5}}>

      <Text numberOfLines={5} ellipsizeMode={'tail'}
        style={{fontSize:12,fontFamily: 'Saysettha OT',marginTop:5,marginLeft:5,padding:5}}
        testID={'title_test'}>{data.title}</Text>

      <View style={{flexDirection:'row',alignItems:'center' }}>
        <Image source={require('../img/discount.png')} style={{margin:2, width:20,height:20}} />
        <Text style={{fontSize:12,textDecorationLine:'line-through'}} testID={'location_test'}>Kip 50,000</Text>
        <Text style={{fontSize:12}} testID={'location_test'}> Kip 20,000</Text>
        <Text style={{fontSize:12, color:'red'}} testID={'location_test'}> -60%</Text>
      </View>
      <View style={{flexDirection:'row',alignItems:'center' }}>
        <Image source={require('../img/gps.png')} style={{margin:2, width:20,height:20}} />
        <Text style={{fontSize:12}} testID={'location_test'}>{data.location}</Text>
      </View>
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <Image source={require('../img/calendar.png')} style={{margin:2, width:20,height:20}} />
        <Text style={{fontSize:12}} testID={'valid_till_test'}>Unitll {till.toISOString().substring(0,10)}</Text>
      </View>
      <View style={{flexDirection:'row',alignItems:'center' }}>
        <Image source={require('../img/phone.png')} style={{margin:2, width:20,height:20}} />
        <Text style={{fontSize:12}} testID={'location_test'}>+85620 1234 5678</Text>
      </View>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:-8 }}>
        <View style={{flexDirection:'row',alignItems:'center' }}>
          <Image source={require('../img/fb.png')} style={{margin:2, width:20,height:20}} />
          <Text style={{fontSize:12}} testID={'location_test'}>facebook link</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'flex-end',}}>
            <View elevation={2} style={{borderRadius:3,margin:5,paddingLeft:5,paddingRight:5,backgroundColor:likeBGColor,alignItems:'center'}}>
              <TouchableOpacity style={{alignItems:'center',flexDirection:'row'}} testID={'like_button_test'} onPress={()=>{like(data.id)}}>
                <Image source={require('../img/like.png')} style={{margin:5, width:20,height:20}} />
                <Text style={{fontSize:10}} testID={'like_test'}>{data.like}</Text>
              </TouchableOpacity>
            </View>
          <TouchableOpacity testID={'dislike_button_test'} onPress={()=>{dislike(data.id)}}>
            <View elevation={2} style={{borderRadius:3,margin:5,paddingLeft:5,paddingRight:5,backgroundColor:dislikeBGColor,alignItems:'center'}}>
              <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} testID={'like_button_test'} onPress={()=>{dislike(data.id)}}>
                <Image source={require('../img/dislike.png')} style={{margin:5,width:20,height:20}} />
                <Text style={{fontSize:10}} testID={'dislike_test'}>{data.dislike}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
)
}

News.propTypes = {
  data: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  dislike: PropTypes.func.isRequired,
};

export default News
