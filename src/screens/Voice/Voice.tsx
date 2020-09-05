import React, {useState, useEffect, useCallback} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import {useLogOut} from '../../AuthContext';
import Modal from 'react-native-modal';
import ModalAlert from '../../components/ModalAlert';
import ModalSelector from '../../components/ModalSelector';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import getEnvVars, {AGORA_APP_ID} from '../../enviroments';
import AsyncStorage from '@react-native-community/async-storage';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  ChannelProfile,
} from 'react-native-agora';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import {toast} from '../../tools';
import {PermissionsAndroid, StyleSheet} from 'react-native';
import constants from '../../constants';

const View = styled.View``;
const Container = styled.View``;
const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;
const VoiceRowTouchable = styled.TouchableOpacity`
  padding: 16px 8px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  margin: 8px 16px;
  border-color: ${(props: any) => props.theme.darkGreyColor};
`;
const VoiceRowText = styled.Text`
  font-size: 16px;
`;
const VoiceCategoryText = styled.Text`
  font-size: 15px;
  padding: 16px;
`;

interface IProp {}

const styleSheets = StyleSheet.create({
  max: {
    flex: 1,
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: constants.width,
    height: constants.height - 100,
  },
  remoteContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
});

const Voice: React.FunctionComponent<IProp> = () => {
  const [uid, setUid] = useState<number>(0);
  const [initialized, setInitialized] = useState<string>();
  const [engine, setEngine] = useState<RtcEngine>();
  const [channelName, setChannelName] = useState<string>('test');
  const [joinSucceed, setJoinSucceed] = useState<boolean>();
  const [peerIds, setPeerIds] = useState<number[]>([]);

  const renderVideos = () => {
    return joinSucceed ? (
      <View style={styleSheets.fullView}>
        <RtcLocalView.SurfaceView
          style={{flex: 1}}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        {renderRemoteVideos()}
      </View>
    ) : null;
  };

  const renderRemoteVideos = () => {
    return (
      <ScrollView
        style={styleSheets.remoteContainer}
        contentContainerStyle={{paddingHorizontal: 2.5}}
        horizontal={true}>
        {peerIds.map((value, index, array) => {
          return (
            <RtcRemoteView.SurfaceView
              style={styleSheets.remote}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  };

  useEffect(() => {
    const init = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        ]);
        if (
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.CALL_PHONE'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('You can use the cameras & mic');
        } else {
          console.log('Permission denied');
        }
      } catch (err) {
        console.warn(err);
      }

      // Pass in the App ID to initialize the RtcEngine object.
      const engine = await RtcEngine.create(AGORA_APP_ID);
      await engine.enableAudio();
      await engine.setDefaultMuteAllRemoteAudioStreams(false);
      // Listen for the JoinChannelSuccess callback.
      // This callback occurs when the local user successfully joins the channel.
      engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log('success', channel);
      });
      // Listen for the UserJoined callback.
      // This callback occurs when the remote user successfully joins the channel.
      engine.addListener('UserJoined', (uid, elapsed) => {
        console.log('userjoined', uid);
        // If new user
        if (peerIds.indexOf(uid) === -1) {
          setPeerIds([...peerIds, uid]);
        }
      });
      // Listen for the UserOffline callback.
      // This callback occurs when the remote user leaves the channel or drops offline.
      engine.addListener('UserOffline', (uid, reason) => {
        console.log('UserOffline', uid, reason);
        setPeerIds(peerIds.filter(id => id !== uid));
      });

      //engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
      setEngine(engine);
    };

    // check(PERMISSIONS.ANDROID.RECORD_AUDIO)
    //   .then(result => {
    //     switch (result) {
    //       case RESULTS.UNAVAILABLE:
    //         console.log(
    //           'This feature is not available (on this device / in this context)',
    //         );
    //         break;
    //       case RESULTS.DENIED:
    //         console.log(
    //           'The permission has not been requested / is denied but requestable',
    //         );
    //         break;
    //       case RESULTS.GRANTED:
    //         console.log('The permission is granted');
    //         init();
    //         break;
    //       case RESULTS.BLOCKED:
    //         console.log('The permission is denied and not requestable anymore');
    //         break;
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    init();
  }, []);

  const join = useCallback(async () => {
    if (!engine) {
      console.log('not engine');
      return;
    }
    toast('시작');
    const jwt = await AsyncStorage.getItem('jwt');
    const {key} = await axios
      .get(getEnvVars().apiUrl + 'generateRtcToken', {
        params: {uid: uid, channelName: channelName},
        headers: {'X-JWT': jwt},
      })
      .then(e => {
        return e.data;
      })
      .catch(e => {
        console.log(e);
      });
    console.log(key);
    await engine.enableAudio();
    await engine.enableLocalAudio(true);
    await engine.joinChannel(key, channelName, null, uid);
  }, [uid, channelName, engine]);

  const close = () => {
    if (!engine) return;
    toast('종료');
    console.log('close');
    engine.leaveChannel();
  };

  return (
    <View style={styleSheets.max}>
      <View style={styleSheets.max}>
        <View style={styleSheets.buttonHolder}>
          <Touchable onPress={() => join()} style={styleSheets.button}>
            <Text style={styleSheets.buttonText}> Start Call </Text>
          </Touchable>
          <Touchable onPress={() => close()} style={styleSheets.button}>
            <Text style={styleSheets.buttonText}> End Call </Text>
          </Touchable>
        </View>
        {renderVideos()}
      </View>
    </View>
  );
};

export default Voice;
