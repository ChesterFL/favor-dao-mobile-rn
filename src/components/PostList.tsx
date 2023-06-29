import React, { useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Animated} from 'react-native';
import {FontSize, Color, Border, FontFamily, Padding} from "../GlobalStyles";
import {Page, PostInfo} from "../declare/api/DAOApi";
import PostApi from '../services/DAOApi/Post';
import {useIsLogin, useUrl} from '../utils/hook';
import NewsCard from "./NewsCard";
import DaoCardList from "./DaoCardList";
import VideoBlock from "./VideoBlock";
import NoDataShow from "./NoDataShow";
import ToolDaoList from "./ToolDaoList";
import Toast from "react-native-toast-message";

export type Props = {
  type?: number | string;
  daoId?: string;
  focus?: boolean;
  query?: string;
  isHome?: boolean;
  isNewsFocus?: boolean;
  setIsNewsFocus?: (b: boolean) => void;
};

const PostList: React.FC<Props> = (props) => {
  const {type, daoId, focus = false, query, isHome = false, isNewsFocus, setIsNewsFocus} = props;
  const url = useUrl();
  const [isLogin, gotoLogin] = useIsLogin();
  const [pageData, setPageData] = useState<Page>({
    page: 1,
    page_size: 5,
    type,
    query,
  });
  const [postListArr, setPostListArr] = useState<PostInfo[]>([])
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    try {
      const request = focus ? (params: Page) => PostApi.getFollow(url, params)
        : daoId
          ? (params: Page) => PostApi.getPostListByDaoId(url, daoId, params)
          : (params: Page) => PostApi.getPostListByType(url, params);
      const {data} = await request(pageData);
      // @ts-ignore
      const listArr: PostInfo[] = data.data.list;
      await setPostListArr(() => [...postListArr, ...listArr]);
      await setIsLoadingMore(
        data.data.pager.total_rows > pageData.page * pageData.page_size,
      );
      await setPageData((pageData) => ({...pageData, page: ++pageData.page}));
    } catch (e) {
      if (e instanceof Error)
        Toast.show({
          type: 'error',
          // @ts-ignore
          text1: e.message,
        });
    }
  };

  const refreshPage = async () => {
    try {
      const pageInfo = {page: 1, page_size: 5, type, query};
      const request = focus
        ? (params: Page) => PostApi.getFollow(url, params)
        : daoId
          ? (params: Page) => PostApi.getPostListByDaoId(url, daoId, params)
          : (params: Page) => PostApi.getPostListByType(url, params);
      const {data} = await request(pageInfo);
      // @ts-ignore
      const listArr: PostInfo[] = data.data.list;
      await setPostListArr(() => [...listArr]);
      await setIsLoadingMore(
        data.data.pager.total_rows > pageInfo.page * pageInfo.page_size,
      );
      await setPageData((pageData) => ({...pageData, page: 2}));
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  };

  const renderItem = (item: PostInfo) => {
    if (item.type === -1) {
      // return <DaoCardList />;
    } else if (item.type === 0) {
      return <NewsCard postInfo={item}/>
    } else if (item.type === 1) {
      return <VideoBlock postInfo={item}/>
    } else if (item.type === 2) {
      // return <ReTransfer postInfo={item}/>
      return <NewsCard postInfo={item}/>
    } else if (item.type === 3) {
      // return <QuoteNews postInfo={item}/>
      return <NewsCard postInfo={item}/>
    }

  }

  const onRefresh = async () => {
    setRefreshing(true);
    // await sleep(2000);
    await refreshPage();
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore && !loading) {
      setLoading(true);
      // await sleep(2000);
      await loadMore();
      setLoading(false);
    }
  };

  useEffect(() => {
    onRefresh();
    if (isNewsFocus) setIsNewsFocus?.(false);
  }, [query, isNewsFocus, daoId, isLogin])


  return (
    <View style={styles.container}>
      <FlatList
        style={styles.postList}
        data={postListArr}
        // @ts-ignore
        renderItem={({item, index}) => {
          if (index === 0 && isHome) {
            return (
              <>
                <ToolDaoList refreshing={refreshing}/>
                {renderItem(item)}
              </>
            )
          } else if (index === 1 && isHome) {
            return (
              <>
                <DaoCardList refreshing={refreshing}/>
                {renderItem(item)}
              </>
            )
          } else {
            return renderItem(item)
          }
        }}
        keyExtractor={(item,index) => item.id+`${index}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() => (
          <>
            {
              loading &&
                <View style={styles.footer}>
                    <ActivityIndicator size="large"/>
                </View>
            }
          </>
        )}
        ListEmptyComponent={!postListArr.length && !refreshing ?
          <View style={styles.noData}>
            <NoDataShow
              title={'No results found'}
              image={require('../assets/postlistNoData.png')}
              description={`Please join some DAO communities first`}
            />
          </View>
          : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postList: {
    flex: 1,
  },
  noData: {
    flex: 1,
    marginTop: '40%',
  },
  footer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default PostList