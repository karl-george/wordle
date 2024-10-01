import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import OnScreenKeyboard from '../components/OnScreenKeyboard';
import { allWords } from '@/utils/allWords';
import { words } from '@/utils/targetWords';

const ROWS = 6;
const COLUMNS = 5;

const Page = () => {
  // State for board
  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(COLUMNS).fill(''))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, _setCurrentColumn] = useState(0);

  const colStateRef = useRef(currentColumn);
  const setCurrentColumn = (col: number) => {
    colStateRef.current = col;
    _setCurrentColumn(col);
  };

  // State for coloured letters
  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  // State for target word
  // const [word, setWord] = useState<string>(
  //   words[Math.floor(Math.random() * words.length)]
  // );

  const [word, setWord] = useState<string>('hello');
  const wordLetters = word.split('');

  // Theme colour scheme
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const grayColor = Colors[colorScheme ?? 'light'].gray;

  const router = useRouter();

  const addKey = (key: string) => {
    console.log('addKey', key);
    // todo
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerIcon}>
              <Ionicons
                name='help-circle-outline'
                size={28}
                color={textColor}
              />
              <Ionicons name='podium-outline' size={28} color={textColor} />
              <Ionicons name='settings-sharp' size={28} color={textColor} />
            </View>
          ),
        }}
      />
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.gameFieldRow}>
            {row.map((cell, cellIndex) => (
              <View key={`cell-${rowIndex}-${cellIndex}`} style={styles.cell}>
                <Text style={styles.cellText}>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <OnScreenKeyboard
        onKeyPressed={addKey}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        grayLetters={grayLetters}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
  },
  headerIcon: {
    flexDirection: 'row',
    gap: 10,
  },
  gameField: {
    alignItems: 'center',
    gap: 8,
  },
  gameFieldRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    width: 62,
    height: 62,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});
