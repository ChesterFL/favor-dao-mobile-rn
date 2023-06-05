import React, {useCallback, useState} from 'react';
import {Notify, NotifyGroup, Page} from "../declare/api/DAOApi";
import BackgroundSafeAreaView from "../components/BackgroundSafeAreaView";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import FavorDaoNavBar from "../components/FavorDaoNavBar";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import NotifyApi from "../services/DAOApi/Notify";
import {useResourceUrl, useUrl} from "../utils/hook";
import SvgIcon from "../components/SvgIcon";
import DeleteSvg from "../assets/svg/deleteIcon.svg";
import {Color} from "../GlobalStyles";
import {getTime} from "../utils/util";
import Toast from "react-native-toast-message";
import {StackNavigationProp} from "@react-navigation/stack";
import {useDispatch, useSelector} from "react-redux";
import Models from "../declare/storeTypes";
import {updateState as globalUpdateState} from "../store/notify";

const NotificationsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const url = useUrl();
  const {id, avatar, name, isSystem} = route.params as NotifyGroup['fromInfo'] & { isSystem?: boolean }
  const [notifyList, setNotifyList] = useState<Notify[]>();
  const resourceUrl = useResourceUrl('avatars');
  const { delFromId } = useSelector((state: Models) => state.notify);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading,setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageInfo, setPageInfo] = useState<Page>({
    page: 1,
    page_size: 10,
  });

  const getNotify = async (refresh?: boolean) => {
    const pageData = await refresh ? {page: 1, page_size: pageInfo.page_size} : pageInfo;
    try {
      const { data } = isSystem
        ? await NotifyApi.getNotifySys(url, id, pageData)
        : await NotifyApi.getNotifyFromId(url, id, pageData);
      if(refresh) {
        setNotifyList(data.data.list)
      } else {
        if(notifyList) setNotifyList([...notifyList,data.data.list])
      }
      setIsLoadingMore(data.data.pager.total_rows > pageData.page * pageData.page_size,);
      setPageInfo({ ...pageInfo, page: ++pageData.page });

    } catch (e) {
      if(e instanceof Error) {
        Toast.show({
          type: 'error',
          text1: e.message
        })
      }
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore && !loading) {
      setLoading(true);
      await getNotify();
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getNotify(true);
    setRefreshing(false);
  };

  const readNotify = async () => {
    try {
      await NotifyApi.readNotifyFromId(url, id);
      dispatch(globalUpdateState({
        readFromId: id,
      }));
    } catch (e) {
      if(e instanceof Error) {
        Toast.show({
          type: 'error',
          text1: e.message
        })
      }
    }
  }

  const delNotify = async () => {
    try {
     const {data} = await NotifyApi.delNotifyAll(url, id);
      if(data.data) {
        setNotifyList([]);
        navigation.goBack();
        dispatch(globalUpdateState({
          delFromId: id,
        }));
      }
    } catch (e) {
      if(e instanceof Error) {
        Toast.show({
          type: 'error',
          text1: e.message
        })
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      getNotify(true);
      readNotify()
    }, [])
  )

  return <BackgroundSafeAreaView headerStyle={{backgroundColor: Color.color2}}>
    <View style={styles.container}>
      <View style={styles.header}>
        <FavorDaoNavBar title={'Andrew parker'} rightComponent={
          <TouchableOpacity style={styles.right} onPress={delNotify}>
            <SvgIcon svg={<DeleteSvg/>}/>
          </TouchableOpacity>
        }/>
      </View>
      <FlatList
        data={notifyList}
        renderItem={({item}) => (
          <View>
            <Text style={styles.time}>
              {getTime(Number(item.createdAt))}
            </Text>
            <View style={styles.notifyRow}>
              <Image
                style={styles.avatar}
                source={{
                  uri: `${resourceUrl}/${avatar}`
                }}
              />
              <TouchableOpacity style={styles.notifyContent} onPress={() => {
                if(item.links) {
                  const link = JSON.parse(item.links);
                  // @ts-ignore
                  navigation.navigate(link.route,{ postId: link.id });
                }
              }}>
                <Text style={styles.text}>{item.content}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item: Notify) => item.id}
        style={styles.flatList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListFooterComponent={() => (
          <>
            {
              loading &&
                <View style={styles.footer}>
                    <ActivityIndicator size="large" />
                </View>
            }
          </>
        )}
      />
    </View>
  </BackgroundSafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.color1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Color.color2
  },
  right: {
    width: 38,
    height: 38,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.color1,
  },
  flatList: {
    paddingHorizontal: 7,
    paddingVertical: 20,
  },
  time: {
    textAlign: 'center',
    marginVertical: 13,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  notifyRow: {
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems: 'center',
  },
  notifyContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f4f4f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 16,
  },
  text: {
    fontWeight: '400',
    fontSize: 16,
    color: '#000000',
  },
  footer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default NotificationsScreen;
