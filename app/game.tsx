import SettingsModal from '@/components/SettingsModal';
import { Colors } from '@/constants/Colors';
import { allWords } from '@/utils/allWords';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import OnScreenKeyboard, {
  BACKSPACE,
  ENTER,
} from '../components/OnScreenKeyboard';

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
      shakeRow();
      return;
    }

    if (!allWords.includes(currentWord)) {
      console.log('Not a word');
      shakeRow();
      // return;
    }

    flipRow();

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
    }, 1500);

    setCurrentRow(currentRow + 1);
    setCurrentColumn(0);
  };

  // const getCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
  //   if (currentRow > rowIndex) {
  //     if (wordLetters[cellIndex] === cell) {
  //       return Colors.light.green;
  //     } else if (yellowLetters.includes(cell)) {
  //       return Colors.light.yellow;
  //     } else if (grayLetters.includes(cell)) {
  //       return grayColor;
  //     }
  //   }
  //   return 'transparent';
  // };
  // const getBorderColor = (
  //   cell: string,
  //   rowIndex: number,
  //   cellIndex: number
  // ) => {
  //   if (currentRow > rowIndex && cell !== '') {
  //     return getCellColor(cell, rowIndex, cellIndex);
  //   }
  //   return Colors.light.gray;
  // };

  // Animations
  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0));
  const rowStyles = Array.from({ length: ROWS }, (_, index) =>
    useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: offsetShakes[index].value,
          },
        ],
      };
    })
  );

  const shakeRow = () => {
    const TIME = 80;
    const OFFSET = 10;

    offsetShakes[currentRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    );
  };

  // FLIP
  const tileRotates = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(0))
  );

  const cellBackgrounds = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue('transparent'))
  );

  const cellBorders = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(Colors.light.gray))
  );

  const tileStyles = Array.from({ length: ROWS }, (_, index) => {
    return Array.from({ length: 5 }, (_, tileIndex) =>
      useAnimatedStyle(() => {
        return {
          transform: [{ rotateX: `${tileRotates[index][tileIndex].value}deg` }],
          borderColor: cellBorders[index][tileIndex].value,
          backgroundColor: cellBackgrounds[index][tileIndex].value,
        };
      })
    );
  });

  const flipRow = () => {
    const TIME = 300;
    const OFFSET = 90;

    tileRotates[currentRow].forEach((value, index) => {
      value.value = withDelay(
        index * 100,
        withSequence(
          withTiming(OFFSET, { duration: TIME }, () => {}),
          withTiming(0, { duration: TIME })
        )
      );
    });
  };

  useEffect(() => {
    if (currentRow === 0) {
      return;
    }

    rows[currentRow - 1].forEach((value, index) => {
      setCellColor(value, currentRow - 1, index);
      setBorderColor(value, currentRow - 1, index);
    });
  }, [currentRow]);

  const setCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (currentRow >= rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(grayColor)
        );
      }
    } else {
      cellBackgrounds[rowIndex][cellIndex].value = withTiming('transparent', {
        duration: 100,
      });
    }
  };
  const setBorderColor = (
    cell: string,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (currentRow > rowIndex && cell !== '') {
      if (wordLetters[cellIndex] === cell) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(grayColor)
        );
      }
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
          <Animated.View
            key={`row-${rowIndex}`}
            style={[styles.gameFieldRow, rowStyles[rowIndex]]}
          >
            {row.map((cell, cellIndex) => (
              <Animated.View
                entering={ZoomIn.delay(50 * cellIndex)}
                key={`cell-${rowIndex}-${cellIndex}`}
                style={[
                  styles.cell,
                  // {
                  //   backgroundColor: getCellColor(cell, rowIndex, cellIndex),
                  //   borderColor: getBorderColor(cell, rowIndex, cellIndex),
                  // },
                  tileStyles[rowIndex][cellIndex],
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
              </Animated.View>
            ))}
          </Animated.View>
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
