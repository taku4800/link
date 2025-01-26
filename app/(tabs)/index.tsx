import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TitleScreen from '../screens/TitleScreen';
import HomeScreen from '../screens/HomeScreen';
import SleepScreen from '../screens/SleepScreen';
import ExerciseScreen from '../screens/ExerciseScreen';
import AdviceScreen from '../screens/AdviceScreen';
import RecordScreen from '../screens/RecordScreen';

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Title"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#265366',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Title" component={TitleScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Sleep" component={SleepScreen} />
      <Stack.Screen name="Exercise" component={ExerciseScreen} />
      <Stack.Screen name="Advice" component={AdviceScreen} />
      <Stack.Screen name="Record" component={RecordScreen} />
    </Stack.Navigator>
  );
};

export default RootStack;