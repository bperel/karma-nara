import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import FoodListScreen from '../screens/FoodListScreen';
import AboutScreen from '../screens/AboutScreen';

const FoodListStack = createStackNavigator({
  Links: FoodListScreen,
});

FoodListStack.navigationOptions = {
  tabBarLabel: 'Nearby food',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-restaurant' : 'md-restaurant'}
    />
  ),
};

const AboutStack = createStackNavigator({
  About: AboutScreen,
});

AboutStack.navigationOptions = {
  tabBarLabel: 'About',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-help' : 'md-help'}
    />
  ),
};

export default createBottomTabNavigator({
  FoodListStack,
  AboutStack,
});
