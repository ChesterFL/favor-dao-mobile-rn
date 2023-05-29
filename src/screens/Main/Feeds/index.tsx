import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import {FeedsTopTabNavigator} from '../../../navigation/TopTabBar';
import {FontSize, Color, Border, FontFamily, Padding} from "../../../GlobalStyles";
// @ts-ignore
import ActionSheet from 'react-native-actionsheet';
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import Screens from "../../../navigation/RouteNames";
import {getDebounce} from "../../../utils/util";
import {useIsLogin} from "../../../utils/hook";
import {useDispatch, useSelector} from "react-redux";
import Models from "../../../declare/storeTypes";
import {updateState as searchUpdateState} from "../../../store/search"
import BackgroundSafeAreaView from "../../../components/BackgroundSafeAreaView";

export type Props = {};
const FeedsScreen: React.FC<Props> = (props) => {
  const dispatch = useDispatch()
  const navigation = useNavigation<StackNavigationProp<any>>();
  const actionSheetRef = useRef<ActionSheet>(null);
  const screens = [Screens.CreateVideo, Screens.CreateNews];
  const [isLogin, gotoLogin] = useIsLogin();
  const { dao } = useSelector((state: Models) => state.global);

  const showActionSheet = (e: { preventDefault: () => void; }) => {
    if(isLogin) {
      if(dao) {
        actionSheetRef.current?.show();
      } else {
        navigation.navigate(Screens.CreateDAO);
        e.preventDefault()
      }
    } else {
      gotoLogin();
      e.preventDefault()
    }
  }

  const [searchValue, setSearchValue] = useState<string>('');

  const getSearch = () => {
    dispatch(searchUpdateState({
      feedsSearch: searchValue
    }))
  }

  return (
    // <BackgroundSafeAreaView >
      <View style={styles.container}>
      <View style={styles.frameParent}>
        <View style={[styles.titleParent, styles.selectionBg]}>
          <Text style={styles.title}>News Feed</Text>
          <View style={styles.frameGroup}>
            <View style={[styles.groupWrapper, styles.wrapperBg]}>
              <View style={styles.searchParent}>
                <TextInput
                  style={styles.searchInput}
                  placeholder={'Search'}
                  value={searchValue}
                  onChangeText={text => setSearchValue(text)}
                  onBlur={getDebounce(getSearch)}
                />
              </View>
            </View>
            <TouchableOpacity onPress={showActionSheet}>
              <View style={[styles.frameWrapper, styles.wrapperBg]}>
                <Image
                  style={styles.frameChild}
                  resizeMode="cover"
                  source={require("../../../assets/frame-50.png")}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <FeedsTopTabNavigator/>
      </View>
      <ActionSheet
        ref={actionSheetRef}
        title={'Create post now!'}
        options={['Video Post', 'News Post', 'Cancel']}
        cancelButtonIndex={2}
        onPress={(index: number) => {
          if (index < screens.length) navigation.navigate(screens[index]);
        }}
      />
    </View>
    // </BackgroundSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    flex: 1,
  },
  selectionBg: {
    backgroundColor: Color.whitesmoke_300,
    alignSelf: "stretch",
  },
  wrapperBg: {
    backgroundColor: Color.iOSSystemFillsLightTertiary,
    borderRadius: Border.br_3xs,
  },
  parentPosition: {
    left: 0,
    position: "absolute",
  },
  descriptionTypo: {
    fontWeight: '400',
    textAlign: "left",
    letterSpacing: 0,
  },
  title: {
    fontSize: FontSize.size_15xl,
    lineHeight: 41,
    fontWeight: '700',
    display: "flex",
    width: 343,
    alignItems: "center",
    color: Color.iOSSystemLabelsLightPrimary,
    letterSpacing: -1,
    textAlign: "left",
  },
  searchIcon: {
    width: 24,
    overflow: "hidden",
    top: 0,
    height: 24,
  },
  searchParent: {
    width: 267,
    height: 24,
  },
  groupWrapper: {
    paddingLeft: Padding.p_5xs,
    paddingTop: Padding.p_7xs,
    paddingRight: Padding.p_lgi,
    paddingBottom: Padding.p_7xs,
    flex: 1,
  },
  frameChild: {
    height: 22,
    width: 22,
  },
  frameWrapper: {
    padding: Padding.p_5xs,
    marginLeft: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  frameGroup: {
    marginTop: 5,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  titleParent: {
    paddingBottom: Padding.p_3xs,
    justifyContent: "flex-end",
    paddingHorizontal: Padding.p_base,
  },
  frameParent: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: Color.whitesmoke_300,
  },
});

export default FeedsScreen;
