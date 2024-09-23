import { StyleSheet, Text, View } from 'react-native';
import Icon from '@/assets/images/wordle-icon.svg';

export default function Index() {
  return (
    <View style={styles.container}>
      <Icon width={100} height={100} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
