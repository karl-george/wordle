import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '@/assets/images/wordle-icon.svg';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon width={100} height={70} />
        <Text style={styles.title}>Wordle</Text>
        <Text style={styles.text}>Get 6 chances to guess a 5-letter word</Text>
      </View>
      {/* Menu Buttons */}
      <View style={styles.menu}>
        <Link
          href='/game'
          asChild
          style={[styles.button, { backgroundColor: '#000' }]}
        >
          <TouchableOpacity>
            <Text style={[styles.btnText, styles.primaryText]}>Play</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.btnText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.btnText}>Subscribe</Text>
        </TouchableOpacity>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.text}>Made by Karl</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 50,
    gap: 40,
  },
  header: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
  },
  text: {
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_500Medium',
  },
  menu: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderColor: '#000',
    borderWidth: 1,
    width: '60%',
    maxWidth: 200,
  },
  btnText: {
    padding: 14,
    fontSize: 16,
    fontWeight: 'semibold',
    color: '#333',
  },
  primaryText: {
    color: '#fff',
  },
  footer: {},
});
