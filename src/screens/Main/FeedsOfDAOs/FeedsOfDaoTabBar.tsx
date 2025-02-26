import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
const TopTab = createMaterialTopTabNavigator();
import { FontSize, Color } from "../../../GlobalStyles";
import Mixed from './Mixed';
import News from "./News";
import Videos from "./Viedos";
import {strings} from "../../../locales/i18n";

export const TopBarOptions = {
  header: () => null,
  tabBarIndicatorStyle: { backgroundColor: '#eaeaea', display: 'none' },
  tabBarLabel: ({ focused, color, children }: { focused: boolean, color: string, children: string }) => {
    return (
      <View style={[styles.option,focused && styles.active]}>
        <Text style={[styles.optionText,focused && styles.activeText]}>{children}</Text>
      </View>
    )
  },
  tabBarStyle: {
    backgroundColor: '#EAEAEA',
    justifyContent: 'flex-start',
  },
}

type FeedsOfDaoProps = {
  type: string;
}
export function FeedsOfDaoNavigator(props: FeedsOfDaoProps) {
  const { type } = props;

  return (
    // @ts-ignore
    <TopTab.Navigator screenOptions={TopBarOptions} initialRouteName={type}>
      <TopTab.Screen name={strings('FeedsOfDaoTabBar.Mixed')} component={Mixed}/>
      <TopTab.Screen name={strings('FeedsOfDaoTabBar.News')} component={News}/>
      <TopTab.Screen name={strings('FeedsOfDaoTabBar.Videos')} component={Videos}/>
    </TopTab.Navigator>
  );
}

const styles = StyleSheet.create({
  option: {
    height: 30,
    paddingHorizontal: 11,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionText: {
    fontWeight: '500',
    color: '#939393',
    fontSize: FontSize.size_sm
  },
  active: {
    backgroundColor: '#FF8D1A',
    borderRadius: 14,
  },
  activeText: {
    color: Color.color1
  },
})
