import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Padding, Color, FontFamily, Border, FontSize } from "../GlobalStyles";
import TextInputBlock from "./TextInputBlock";
import {useEffect, useState} from "react";
import UploadImage from "./UploadImage";
import {DaoInfo} from "../declare/api/DAOApi";
import {useResourceUrl} from "../utils/hook";

type Props = {
  daoInfo: DaoInfo;
  daoDescription: string;
  setDaoDescription: () => void;
  setDaoAvatar: () => void;
  setBanner: () => void;
};
const DAODescriptionSection: React.FC<Props> = (props) => {

  const {
    daoInfo,
    daoDescription,
    setDaoDescription,
    setDaoAvatar,
    setBanner,
  } = props;

  const avatarsResUrl = useResourceUrl('avatars');
  const imagesResUrl = useResourceUrl('images');

  return (
    <View style={[styles.daoinfoParent, styles.content1SpaceBlock]}>

      <View style={styles.daoinfo}>
        <Image
          style={styles.userImageIcon}
          resizeMode="cover"
          source={{uri: `${imagesResUrl}/${daoInfo.avatar}`}}
        />
        <View style={styles.daoname}>
          <Text style={styles.title}>{daoInfo.name}</Text>
          <Text style={[styles.subtitle, styles.subtitleTypo]}>
            { daoInfo.follow_count } members
          </Text>
        </View>
      </View>

      {/*<View style={[styles.uploadimage, styles.uploadimageSpaceBlock]}>*/}
      {/*  <View style={styles.content}>*/}
      {/*    <Image*/}
      {/*      style={styles.uploadCloudIcon}*/}
      {/*      resizeMode="cover"*/}
      {/*      source={require("../assets/uploadcloud2.png")}*/}
      {/*    />*/}
      {/*    <Text style={[styles.description, styles.subtitleTypo]}>*/}
      {/*      Upload Avatar*/}
      {/*    </Text>*/}
      {/*  </View>*/}
      {/*</View>*/}


      <UploadImage imageType={'avatar'} isShowSelector={false} setUpImage={setDaoAvatar} multiple={false}/>

      <UploadImage imageType={'banner'} isShowSelector={false} setUpImage={setBanner} multiple={false}/>

      <TextInputBlock
        title={'DAO description'}
        value={daoDescription}
        setValue={setDaoDescription}
        multiline={true}
        // parsed={true}
        placeholder={'Your description...'}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  content1SpaceBlock: {
    paddingHorizontal: Padding.p_base,
    alignSelf: "stretch",
  },
  subtitleTypo: {
    color: Color.color93,
    fontFamily: FontFamily.paragraphP313,
  },
  uploadimageSpaceBlock: {
    marginTop: 15,
    alignSelf: "stretch",
  },
  titleLayout: {
    lineHeight: 23,
    textAlign: "left",
    letterSpacing: 0,
  },
  content1Bg: {
    backgroundColor: Color.color1,
    borderRadius: Border.br_3xs,
  },
  userImageIcon: {
    width: 32,
    height: 32,
    borderRadius: 32,
  },
  title: {
    lineHeight: 22,
    textAlign: "left",
    color: Color.iOSSystemLabelsLightPrimary,
    fontFamily: FontFamily.capsCaps310SemiBold,
    fontWeight: "600",
    letterSpacing: 0,
    fontSize: FontSize.size_mini,
  },
  subtitle: {
    fontSize: FontSize.size_xs,
    lineHeight: 16,
    opacity: 0.8,
    marginTop: 2,
  },
  daoname: {
    marginLeft: 4,
    flex: 1,
  },
  daoinfo: {
    width: 156,
    alignItems: "center",
    flexDirection: "row",
  },
  uploadCloudIcon: {
    width: 31,
    height: 29,
    overflow: "hidden",
  },
  description: {
    lineHeight: 20,
    height: 20,
    letterSpacing: 0,
    fontSize: FontSize.size_mini,
    textAlign: "center",
    alignSelf: "stretch",
  },
  content: {
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "stretch",
  },
  uploadimage: {
    borderStyle: "dashed",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    height: 77,
    paddingHorizontal: 0,
    paddingVertical: Padding.p_xs,
    justifyContent: "center",
    backgroundColor: Color.color1,
    borderRadius: Border.br_3xs,
    alignItems: "center",
  },
  title1: {
    fontSize: FontSize.size_mid,
    lineHeight: 23,
    color: Color.iOSSystemLabelsLightPrimary,
    fontFamily: FontFamily.capsCaps310SemiBold,
    fontWeight: "600",
    alignSelf: "stretch",
  },
  title2: {
    color: Color.color3,
    fontFamily: FontFamily.paragraphP313,
    lineHeight: 23,
    fontSize: FontSize.size_mini,
    flex: 1,
  },
  content1: {
    height: 112,
    paddingVertical: Padding.p_3xs,
    marginTop: 10,
    flexDirection: "row",
    paddingHorizontal: Padding.p_base,
    alignSelf: "stretch",
  },
  daoinfoParent: {
    backgroundColor: '#f8f8f8',
    paddingVertical: Padding.p_xl,
  },
});

export default DAODescriptionSection;
