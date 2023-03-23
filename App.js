// Import necessary libraries and modules.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import {
  NavigationContainer,
  StackActions,
  DefaultTheme
} from '@react-navigation/native';

// Import screen components and global variables.
import MainScreen from './src/screens/MainScreen';
import NoteScreen from './src/screens/NoteScreen';
import './src/utils/constants/Globals';

// Define the navigation's theme color.
const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: global.backgroundColor
  },
};

const Stack = createNativeStackNavigator();
export default function App() {
  // Render navigation container and stack navigator.
  return (
    <NavigationContainer theme={NavigationTheme}>
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerTitle: global.appName,
          headerTintColor:
            route.name == 'MainScreen'
              ? global.tintColor
              : global.deepShadeColor,
          headerTitleStyle: {
            fontSize: global.windowWidth / 20,
          },
          headerStyle: {
            backgroundColor: global.backgroundColor,
          },
          headerLeft: () => route.name != 'MainScreen' && (
            <TouchableOpacity
              style={{ marginRight: global.windowWidth / 20 }}
              onPress={() => {
                navigation.popToTop();
                navigation.dispatch(StackActions.replace("MainScreen"));
              }}>
              <Icon
                name='chevron-left'
                color={global.shadeColor}
                size={global.windowWidth / 16}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.dispatch(StackActions.replace(route.name))
              }>
              <Icon
                color={global.deepShadeColor}
                name={route.name != 'MainScreen' ? 'backspace' : 'cached'}
                size={route.name != 'MainScreen' ? global.windowWidth / 20 : global.windowWidth / 18}
              />
            </TouchableOpacity>
          )
        })}>
        <Stack.Screen name='MainScreen' component={MainScreen} />
        <Stack.Screen name='NoteScreen' component={NoteScreen} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}
