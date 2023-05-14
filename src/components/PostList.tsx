import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import { FontSize, Color, Border, FontFamily, Padding } from "../GlobalStyles";
import { Page, PostInfo } from "../declare/api/DAOApi";
import PostApi from '../services/DAOApi/Post';
import { useUrl } from '../utils/hook';
import { sleep } from '../utils/util';
import NewsCard from "./NewsCard";
import DaoCardList from "./DaoCardList";
import QuoteNews from "./QuoteNews";
import VideoBlock from "./VideoBlock";
import ReTransfer from "./ReTransfer";
import {useSelector} from "react-redux";
import Models from "../declare/storeTypes";

export type Props = {
  type?: number | string;
  daoId?: string;
  focus?: boolean;
  query?: string;
  isHome?: boolean;
};

const PostList: React.FC<Props> = (props) => {
  const { type, daoId, focus = false, query, isHome = false } = props;
  const url = useUrl();

  const [pageData, setPageData] = useState<Page>({
    page: 1,
    page_size: 5,
    type,
    query,
  });
  const [postListArr,setPostListArr] = useState<PostInfo[] | any>([])
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading,setLoading] = useState(false);

  const loadMore = async () => {
    try {
      const request = focus ? (params: Page) => PostApi.getFollow(url, params)
        : daoId
        ? (params: Page) => PostApi.getPostListByDaoId(url, daoId, params)
        : (params: Page) => PostApi.getPostListByType(url, params);
      const { data } = await request(pageData);
      const listArr: PostInfo[] = data.data.list;
      setPostListArr(() => [...postListArr,...listArr]);

      setIsLoadingMore(
        data.data.pager.total_rows > pageData.page * pageData.page_size,
      );
      setPageData((pageData) => ({ ...pageData, page: ++pageData.page }));
    } catch (e) {
      if (e instanceof Error) console.error(e)
    }
  };

  const refreshPage = async () => {
    try {
      const pageInfo = { page: 1, page_size: 5, type, query };
      const request = focus
        ? (params: Page) => PostApi.getFollow(url, params)
        : daoId
          ? (params: Page) => PostApi.getPostListByDaoId(url, daoId, params)
          : (params: Page) => PostApi.getPostListByType(url, params);
      const { data } = await request(pageInfo);
      const listArr: PostInfo[] = data.data.list;
      setPostListArr(() => [...listArr]);
      setIsLoadingMore(
        data.data.pager.total_rows > pageInfo.page * pageInfo.page_size,
      );
      setPageData((pageData) => ({ ...pageData, page: 2 }));
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  };

  const renderItem = (item:PostInfo)=>{
    if(item.type === -1){
      // return <DaoCardList />;
    } else if(item.type === 0) {
      return <NewsCard postInfo={item}/>
    } else if(item.type === 1) {
      return <VideoBlock postInfo={item}/>
    } else if(item.type === 2) {
      return <ReTransfer postInfo={item}/>
    } else if(item.type === 3) {
      return <QuoteNews postInfo={item}/>
    }

  }

  const renderFooter = () => {
    return (
      loading &&
      <View style={styles.footer}>
          <ActivityIndicator size="large" />
          <Text style={styles.footerText}>Loading...</Text>
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await sleep(2000);
    setRefreshing(false);
    await refreshPage();
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
    loadMore();
  },[])



  return (
      <View>
        <FlatList
          style={styles.postList}
          data={postListArr}
          // @ts-ignore
          renderItem={({item, index}) => {
            if(index === 1 && isHome) {
              return (
                <>
                  <DaoCardList/>
                  {renderItem(item)}
                </>
              )
            }
            else {
              return renderItem(item)
            }
          }}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          // @ts-ignore
          ListFooterComponent={renderFooter}
        />
      </View>
  )
}

const styles = StyleSheet.create({
  postList: {},
  footer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerText: {
    fontSize: 16
  }
})

export default PostList