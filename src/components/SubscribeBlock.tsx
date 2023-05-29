import * as React from "react";
import {Text, StyleSheet, View, TouchableOpacity, Pressable} from "react-native";
import {Color, Border, Padding, FontFamily, FontSize} from "../GlobalStyles";
import FavorDaoButton from "./FavorDaoButton";
import DaoCommunityCard from "./DaoCommunityCard";
import {useIsLogin, useUrl} from "../utils/hook";
import UserApi from '../services/DAOApi/User'
import {useEffect, useState} from "react";
import {addDecimal, compareNumber} from "../utils/balance";
import Toast from "react-native-toast-message";

type Props = React.ComponentProps<typeof DaoCommunityCard> & {
    subFn?: Function
    loading?: boolean
}
const SubscribeBlock = ({daoCardInfo, subFn, loading}: Props) => {
    const url = useUrl();
    const [balance, setBalance] = useState<string>('0');
    const [isLogin, gotoLogin] = useIsLogin()

    useEffect(() => {
        getBalance()
    }, [])
    const getBalance = async () => {
        const {data} = await UserApi.getAccounts(url);
        console.log(data.data)
        setBalance(data.data[0].balance)
    }
    const subscribe = () => {
        if (!isLogin) {
            gotoLogin();
            return;
        }

        if (compareNumber(daoCardInfo.dao.price, balance)) {
            Toast.show({
                type: 'info',
                text1: 'Insufficient balance!'
            })
            return;
        }

        subFn?.();
    }

    return (
      <View style={styles.titleParent}>
          <Text style={[styles.title, styles.titleFlexBox]}>
              Please subscribe first
          </Text>
          <View style={{
              width: '100%',
              marginTop: 20,
          }}>
              <DaoCommunityCard
                daoCardInfo={daoCardInfo}
              />
          </View>

          <View style={[styles.frameWrapper, styles.frameWrapperSpaceBlock]}>
              <View style={styles.frameGroup}>
                  <View style={styles.descriptionParent}>
                      <Text style={[styles.description1, styles.descriptionTypo]}>
                          Balance
                      </Text>
                      <Text style={[styles.description2, styles.descriptionTypo]}>
                          {addDecimal(balance)} FavT
                      </Text>
                  </View>
                  <View style={styles.frameItem}/>
                  <View style={styles.descriptionGroup}>
                      <Text style={[styles.description1, styles.descriptionTypo]}>
                          Price
                      </Text>
                      <Text style={[styles.description2, styles.descriptionTypo]}>
                          {addDecimal(daoCardInfo.dao.price)} FavT
                      </Text>
                  </View>
              </View>
          </View>
          <Pressable disabled={loading}  onPress={subscribe} style={styles.button} >
              <FavorDaoButton
                isLoading={loading}
                textValue="Subscribe"
                frame1171275771BackgroundColor="#ff8d1a"
                cancelColor="#fff"
              />
          </Pressable>
      </View>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
    },
    titleFlexBox: {
        textAlign: "left",
        color: Color.iOSSystemLabelsLightPrimary,
    },
    frameWrapperBg: {
        backgroundColor: Color.color1,
        borderRadius: Border.br_3xs,
    },
    previewIconFlexBox: {
        overflow: "hidden",
        alignSelf: "stretch",
    },
    frameWrapperSpaceBlock: {
        paddingHorizontal: Padding.p_base,
        alignSelf: "stretch",
    },
    descriptionTypo: {
        fontWeight: '400',
        fontSize: FontSize.size_mini,
        letterSpacing: 0,
    },
    title1Typo: {
        lineHeight: 23,
        fontSize: FontSize.bodyBody17_size,
        fontWeight: '600',
    },
    label1FlexBox: {
        textAlign: "center",
        letterSpacing: 0,
    },
    title: {
        fontSize: FontSize.size_xl,
        lineHeight: 22,
        fontWeight: '600',
        letterSpacing: 0,
        textAlign: "left",
        alignSelf: "stretch",
    },
    previewIcon: {
        borderTopLeftRadius: Border.br_3xs,
        borderTopRightRadius: Border.br_3xs,
        maxWidth: "100%",
        height: 72,
        width: "100%",
    },
    previewWrapper: {
        alignSelf: "stretch",
    },
    frameChild: {
        width: 64,
        height: 64,
    },
    subtitle: {
        top: 26,
        color: Color.iOSSystemLabelsLightSecondary,
        lineHeight: 20,
        fontWeight: '400',
        fontSize: FontSize.size_mini,
        left: 0,
        position: "absolute",
        width: 114,
        textAlign: "left",
    },
    title1: {
        top: 0,
        left: 0,
        position: "absolute",
        width: 114,
        textAlign: "left",
        color: Color.iOSSystemLabelsLightPrimary,
        lineHeight: 23,
        fontSize: FontSize.bodyBody17_size,
        letterSpacing: 0,
    },
    subtitleParent: {
        height: 46,
        width: 114,
    },
    label1: {
        fontSize: FontSize.paragraphP313_size,
        lineHeight: 18,
        fontWeight: "500",
        color: Color.color,
    },
    label: {
        borderRadius: Border.br_base,
        backgroundColor: Color.darkorange_100,
        paddingHorizontal: Padding.p_2xs,
        paddingVertical: Padding.p_8xs,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    labelWrapper: {
        alignItems: "flex-end",
        marginLeft: 119,
        flex: 1,
        justifyContent: "center",
    },
    groupParent: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "stretch",
    },
    description: {
        lineHeight: 21,
        flex: 1,
        fontWeight: '400',
        fontSize: FontSize.size_mini,
        textAlign: "left",
        color: Color.iOSSystemLabelsLightPrimary,
    },
    ellipseParent: {
        paddingBottom: Padding.p_base,
        marginTop: -36,
        justifyContent: "center",
    },
    frameParent: {
        marginTop: 20,
        alignSelf: "stretch",
    },
    description1: {
        // width: 213,
        lineHeight: 20,
        fontWeight: '400',
        fontSize: FontSize.size_mini,
        textAlign: "left",
        color: Color.iOSSystemLabelsLightPrimary,
    },
    description2: {
        color: Color.color4,
        textAlign: "right",
        marginLeft: 15,
        flex: 1,
        lineHeight: 20,
        fontWeight: '400',
        fontSize: FontSize.size_mini,
    },
    descriptionParent: {
        flexDirection: "row",
        alignSelf: "stretch",
    },
    frameItem: {
        borderStyle: "solid",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderTopWidth: 0.5,
        width: 312,
        height: 1,
        marginTop: 10,
    },
    descriptionGroup: {
        marginTop: 10,
        flexDirection: "row",
        alignSelf: "stretch",
    },
    frameGroup: {
        alignSelf: "stretch",
    },
    frameWrapper: {
        height: 80,
        paddingVertical: Padding.p_3xs,
        justifyContent: "space-between",
        backgroundColor: Color.color1,
        borderRadius: Border.br_3xs,
        marginTop: 20,
    },
    create: {
        color: Color.color1,
        lineHeight: 23,
        fontSize: FontSize.bodyBody17_size,
        fontWeight: '600',
    },
    createWrapper: {
        borderRadius: Border.br_29xl,
        backgroundColor: Color.color,
        paddingHorizontal: Padding.p_124xl_5,
        paddingVertical: Padding.p_sm,
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    titleParent: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
    },
});

export default SubscribeBlock;
