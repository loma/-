import React, { Component }  from 'react';
import {
  BackHandler,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from 'react-native-fcm';


import MainScreen from '../components/MainScreen';
import PromotionsScreen from '../components/PromotionsScreen';
import LikesScreen from '../components/LikesScreen';

export const AppNavigator = StackNavigator({
  Main: { screen: MainScreen },
  Promotions: { screen: PromotionsScreen },
  Likes: { screen: LikesScreen },
});

var serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
const uniqueId = require('react-native-device-info').getUniqueID();
class AppWithNavigationState extends Component {
    shouldCloseApp(nav) {
      return nav.index === 0;
    }
    componentDidMount() {
      FCM.requestPermissions(); // for iOS
      FCM.getFCMToken().then(token => {
          // store fcm token in your server
          //console.log('FCMToken: ' + token)
          var data = {'token':token,'uId':uniqueId}
          fetch(serverHost + '/users.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(data)
          })
      });
      this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
          // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
          if(notif.local_notification){
            //this is a local notification
          }
          if(notif.opened_from_tray){
            //app is open/resumed because user clicked banner
          }
          //await someAsyncCall()

          if(Platform.OS ==='ios'){
            //optional
            //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
            //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
            //notif._notificationType is available for iOS platfrom
            switch(notif._notificationType){
              case NotificationType.Remote:
                notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                break;
              case NotificationType.NotificationResponse:
                notif.finish();
                break;
              case NotificationType.WillPresent:
                notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
                break;
            }
          }
      });
      this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
          //console.log(token)
          // fcm token may not be available on first load, catch it here
      });

      BackHandler.addEventListener('backPress', () => {
        const {dispatch, nav} = this.props
        if (this.shouldCloseApp(nav)) return false
        dispatch({
          type: 'Navigation/BACK'
        })
        return true
      })
    }

    componentWillUnmount() {
      BackHandler.removeEventListener('backPress')
      // stop listening for events
      this.notificationListener.remove();
      this.refreshTokenListener.remove();
    }
    render() {
      return (
        <AppNavigator navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })} />
        );
    }
  }

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
