import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import OnScreenKeyboard, {
  BACKSPACE,
  ENTER,
} from '../components/OnScreenKeyboard';
import { allWords } from '@/utils/allWords';
import { words } from '@/utils/targetWords';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import SettingsModal from '@/components/SettingsModal';

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

  // Settings Modal
  const settingsModalRef = useRef<BottomSheetModal>(null);
  const handlePresentSettingsModal = () => settingsModalRef.current?.present();

  const router = useRouter();

  const addKey = (key: string) => {
    const newRows = [...rows.map((row) => [...row])];

    if (key === ENTER) {
      checkWord();
    } else if (key === BACKSPACE) {
      if (colStateRef.current === 0) {
        newRows[currentRow][0] = '';
        setRows(newRows);
        return;
      }

      newRows[currentRow][colStateRef.current - 1] = '';
      setCurrentColumn(colStateRef.current - 1);
      setRows(newRows);
      return;
    } else if (colStateRef.current >= newRows[currentRow].length) {
      // EOL dont add key
      return;
    } else {
      newRows[currentRow][colStateRef.current] = key;
      setRows(newRows);
      setCurrentColumn(colStateRef.current + 1);
    }
  };

  const checkWord = () => {
    const currentWord = rows[currentRow].join('');

    if (currentWord.length < word.length) {
      console.log('Not enough letters');
      // Todo show error
      return;
    }

    if (!allWords.includes(currentWord)) {
      console.log('Not a word');
      // todo show error
      // return
    }

    const newGreenLetters: string[] = [];
    const newYellowLetters: string[] = [];
    const newGrayLetters: string[] = [];

    currentWord.split('').forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newGreenLetters.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellowLetters.push(letter);
      } else {
        newGrayLetters.push(letter);
      }
    });

    setGreenLetters([...greenLetters, ...newGreenLetters]);
    setYellowLetters([...yellowLetters, ...newYellowLetters]);
    setGrayLetters([...grayLetters, ...newGrayLetters]);

    setTimeout(() => {
      if (currentWord === word) {
        console.log('word found');
        router.push(
          `/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`
        );
      } else if (currentRow + 1 >= rows.length) {
        console.log('game over');
        router.push(
          `/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`
        );
      }
    }, 0);

    setCurrentRow(currentRow + 1);
    setCurrentColumn(0);
  };

  const getCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (currentRow > rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        return Colors.light.green;
      } else if (yellowLetters.includes(cell)) {
        return Colors.light.yellow;
      } else if (grayLetters.includes(cell)) {
        return grayColor;
      }
    }
    return 'transparent';
  };
  const getBorderColor = (
    cell: string,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (currentRow > rowIndex && cell !== '') {
      return getCellColor(cell, rowIndex, cellIndex);
    }
    return Colors.light.gray;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SettingsModal ref={settingsModalRef} />
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
              <TouchableOpacity onPress={handlePresentSettingsModal}>
                <Ionicons name='settings-sharp' size={28} color={textColor} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.gameFieldRow}>
            {row.map((cell, cellIndex) => (
              <View
                key={`cell-${rowIndex}-${cellIndex}`}
                style={[
                  styles.cell,
                  {
                    backgroundColor: getCellColor(cell, rowIndex, cellIndex),
                    borderColor: getBorderColor(cell, rowIndex, cellIndex),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cellText,
                    { color: currentRow > rowIndex ? '#fff' : textColor },
                  ]}
                >
                  {cell}
                </Text>
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
