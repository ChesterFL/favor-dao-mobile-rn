import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import FavorDaoNavBar from "../components/FavorDaoNavBar";
import FavorDaoButton from '../components/FavorDaoButton';
import UploadImage from '../components/UploadImage';
import {useUrl} from "../utils/hook";
import {Post} from "../declare/api/DAOApi";
import {CreatePost} from "../declare/api/DAOApi";
import PostApi from "../services/DAOApi/Post";
import TextInputParsedBlock from "../components/TextInputParsedBlock";
import SwitchButton from "../components/SwitchButton";
import {useDispatch, useSelector} from "react-redux";
import Models from "../declare/storeTypes";
import {useNavigation} from "@react-navigation/native";
import {getMatchedStrings} from "../utils/util";
import {RegExps} from "../components/TextInputParsed";
import {updateState as globalUpdateState} from "../store/global";
import BackgroundSafeAreaView from "../components/BackgroundSafeAreaView";
import analytics from "@react-native-firebase/analytics";
import Favor from "../libs/favor";
import {strings} from "../locales/i18n";

const CreateNewsScreen = () => {
  const url = useUrl();
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const [description, setDescription] = useState<string>('');
  const [imageList, setImageList] = useState([]);
  const [daoMode, setDaoMode] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const {dao} = useSelector((state: Models) => state.global);

  const createDisable = useMemo(() => {
    return !(
      description && imageLoading
    )
  }, [description, imageLoading]);

  const createHandle = async () => {
    if (postLoading) return;
    if (createDisable) {
      return Toast.show({
        type: 'info',
        text1: `${strings('CreateNewsScreen.Toast.optionsError')}`,
      })
    }

    try {
      setPostLoading(true);
      const contents: Post[] = [];
      contents.push({content: description.trim(), type: 2, sort: 0});
      imageList.forEach((item, index) => {
        contents.push({content: item, type: 3, sort: index});
      });
      const postData: CreatePost = {
        contents: contents,
        dao_id: dao?.id as string,
        tags,
        type: 0,
        users: [],
        visibility: daoMode ? 2 : 1,
      };
      console.log(postData, 'postData')
      const {data} = await PostApi.createPost(url, postData);
      if (data.data) {
        Toast.show({
          type: 'info',
          text1: `${strings('CreateNewsScreen.Toast.postSuccess')}`
        });
        dispatch(globalUpdateState({
          joinStatus: true,
          newsJoinStatus: true
        }));
        await analytics().logEvent('create_post', {
          platform: Platform.OS,
          networkId: Favor.networkId,
          region: Favor.bucket?.Settings.Region,
          id: data.data.id
        });
        navigation.goBack();
      }
    } catch (e) {
      if (e instanceof Error) {
        Toast.show({
          type: 'error',
          text1: e.message
        });
      }
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    if (dao) {
      setDaoMode(dao.visibility);
    }
  }, [dao]);

  useEffect(() => {
    setTags(getMatchedStrings(description, RegExps.tag));
  }, [description]);


  return (
    <BackgroundSafeAreaView>
      <View style={styles.container}>
        <FavorDaoNavBar title={strings('CreateNewsScreen.title')}/>
        <ScrollView style={styles.scrollWrap}>
          <TextInputParsedBlock
            title={strings('CreateNewsScreen.newsTitle')}
            value={description}
            setValue={setDescription}
            multiline={true}
            placeholder={strings('CreateNewsScreen.newsPlaceholder')}
          />
          <UploadImage imageType={'image'} isShowSelector={false} setUpImage={setImageList} multiple={true}
                       setImageLoading={setImageLoading}/>
          <SwitchButton mode={daoMode} setMode={setDaoMode}/>
        </ScrollView>

        <View style={[styles.instanceParent, createDisable && {opacity: 0.5}]}>
          <TouchableOpacity onPress={createHandle}>
            <FavorDaoButton
              textValue={!imageLoading ? strings('CreateNewsScreen.UpLoadingButton') : strings('CreateNewsScreen.PostButton') }
              frame1171275771BackgroundColor="#ff8d1a"
              cancelColor="#fff"
              isLoading={postLoading}
            />
          </TouchableOpacity>
        </View>
      </View>
    </BackgroundSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15
  },
  scrollWrap: {
    flex: 1,
  },
  background: {
    height: "100%",
    top: "0%",
    right: "0%",
    bottom: "0%",
    left: "0%",
    position: "absolute",
    width: "100%",
  },
  instanceParent: {
    alignSelf: "stretch",
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
});

export default CreateNewsScreen;
