import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AdviceScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Advice Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go to Sleep" onPress={() => navigation.navigate('Sleep')} />
      <Button title="Go to Exercise" onPress={() => navigation.navigate('Exercise')} />
      <Button title="Go to Record" onPress={() => navigation.navigate('Record')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});