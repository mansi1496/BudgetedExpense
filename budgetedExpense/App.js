import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GoogleTakeoutDownload from './components/GoogleTakeoutDownload';

export default function App() {
  return (
    <View style={styles.container}>
      <GoogleTakeoutDownload />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
