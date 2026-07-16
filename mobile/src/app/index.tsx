import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#5AB2FF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F10',
  },
});
