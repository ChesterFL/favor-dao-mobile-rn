import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native';
import {Border, Color, FontSize, Padding} from "../GlobalStyles";
import {getDebounce} from "../utils/util";
import Screens from "../navigation/RouteNames";
// @ts-ignore
import ActionSheet from 'react-native-actionsheet';
import {useIsLogin} from "../utils/hook";
import {useSelector} from "react-redux";
import Models from "../declare/storeTypes";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
export type Props = {
    tittle:string;
    getSearchBlur: () => void;
    searchValue:string;
    setSearchValue: (a: string) => void;
    unFrameStatus?:boolean
};

const SearchHead:React.FC<Props>=(props)=>{
    const screens = [Screens.CreateVideo, Screens.CreateNews];
    const navigation = useNavigation<StackNavigationProp<any>>();
    const actionSheetRef = useRef<ActionSheet>(null);
    const [isLogin, gotoLogin] = useIsLogin();
    const {tittle,getSearchBlur,searchValue,setSearchValue,unFrameStatus} = props;
    const {dao} = useSelector((state: Models) => state.global);
    const showActionSheet = (e: { preventDefault: () => void; }) => {
        if (isLogin) {
            if (dao) {
                actionSheetRef.current?.show();
            } else {
                // @ts-ignore
                navigation.navigate(Screens.CreateDAO);
                e.preventDefault()
            }
        } else {
            gotoLogin();
            e.preventDefault()
        }
    }

    return(
                    <View style={[styles.titleParent, styles.selectionBg]}>
                        <Text style={styles.title}>{tittle}</Text>
                        <View style={styles.frameGroup}>
                            <View style={[styles.groupWrapper, styles.wrapperBg]}>
                                <View style={styles.searchParent}>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder={'Search'}
                                        value={searchValue}
                                        onChangeText={text => setSearchValue(text)}
                                        onBlur={getDebounce(getSearchBlur)}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity onPress={showActionSheet} >
                                <View style={[styles.frameWrapper, styles.wrapperBg,{display:unFrameStatus?'none':'flex'}]}>
                                    <Image
                                        style={styles.frameChild}
                                        resizeMode="cover"
                                        source={require("../assets/frame-50.png")}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <ActionSheet
                            ref={actionSheetRef}
                            title={'Create post now!'}
                            options={['Video Post', 'News Post', 'Cancel']}
                            cancelButtonIndex={2}
                            onPress={(index: number) => {
                                if (index < screens.length) { // @ts-ignore
                                    navigation.navigate(screens[index]);
                                }
                            }}
                        />
                    </View>
            )
}
const styles = StyleSheet.create({

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
        fontWeight: "700",
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
    placeholderLabel: {
        marginTop: -11,
        top: "50%",
        width: 241,
        color: Color.iOSSystemLabelsLightSecondary,
        left: 26,
        lineHeight: 22,
        position: "absolute",
        fontSize: FontSize.bodyBody17_size,
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
    }
});

export default SearchHead;