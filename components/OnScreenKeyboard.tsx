import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onKeyPressed: (key: string) => void;
  greenLetters: string[];
  yellowLetters: string[];
  grayLetters: string[];
};

export const ENTER = 'ENTER';
export const BACKSPACE = 'BACKSPACE';

const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  [ENTER, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', BACKSPACE],
];

const OnScreenKeyboard = ({
  onKeyPressed,
  greenLetters,
  yellowLetters,
  grayLetters,
}: Props) => {
  const { width } = useWindowDimensions();
  const keyWidth = (width - 60) / keys[0].length;
  const keyHeight = 60;

  const isSpecialKey = (key: string) => ['ENTER', 'BACKSPACE'].includes(key);

  const isInLetters = (key: string) =>
    [...greenLetters, ...yellowLetters, ...grayLetters].includes(key);

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key, keyIndex) => (
            <Pressable
              key={`key-${key}`}
              onPress={() => onKeyPressed(key)}
              style={[
                styles.key,
                { width: keyWidth, height: keyHeight, backgroundColor: '#ddd' },
                isSpecialKey(key) && { width: keyWidth * 1.5 },
              ]}
            >
              <Text
                style={[
                  styles.keyText,
                  key === ENTER && { fontSize: 12 },
                  isInLetters(key) && { color: '#fff' },
                ]}
              >
                {isSpecialKey(key) ? (
                  key === ENTER ? (
                    'ENTER'
                  ) : (
                    <Ionicons name='backspace-outline' size={24} />
                  )
                ) : (
                  key
                )}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

export default OnScreenKeyboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    gap: 4,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  key: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  keyText: {
    fontWeight: 'bold',
    fontSize: 20,
    textTransform: 'uppercase',
  },
});
