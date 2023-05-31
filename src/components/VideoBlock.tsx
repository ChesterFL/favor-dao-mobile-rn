import * as React from "react";
import {Text, StyleSheet, View, Image, TouchableOpacity} from "react-native";
import { FontSize, FontFamily, Color, Padding, Border } from "../GlobalStyles";
import OperationBlock from "./OperationBlock";
import { PostInfo } from "../declare/api/DAOApi";
import VideoBlockItem from "./VideoBlockItem";

type Props = {
  postInfo: PostInfo,
  isReTransfer?: boolean
};

const VideoBlock: React.FC<Props> = (props) => {
  const { postInfo, isReTransfer } = props;
  return (
    <View style={styles.rowUserParent}>
      <VideoBlockItem postInfo={postInfo} isReTransfer={isReTransfer} showOperate={true} />
      <OperationBlock postInfo={postInfo} type={1}/>
      <View style={[styles.frameChild, styles.likeSpaceBlock]} />
    </View>
  );
};

const styles = StyleSheet.create({
  likeSpaceBlock: {
    marginTop: 14,
    alignSelf: "stretch",
  },
  frameChild: {
    borderStyle: "solid",
    borderColor: "#e6e5eb",
    borderTopWidth: 1,
    height: 1,
  },
  rowUserParent: {
    paddingHorizontal: 0,
    paddingTop: Padding.p_3xs,
    // marginTop: 10,
    backgroundColor: Color.color1,
    alignSelf: "stretch",
  },
});

export default VideoBlock;
