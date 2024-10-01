import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';

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
  const keyWidth = width - 60 / keys[0].length;
  const keyHeight = 60;

  const isSpecialKey = (key: string) => ['ENTER', 'BACKSPACE'].includes(key);

  const isInLetters = (key: string) =>
    [...greenLetters, ...yellowLetters, ...grayLetters].includes(key);

  return (
    <View>
      <Text>OnScreenKeyboard</Text>
    </View>
  );
};

export default OnScreenKeyboard;

const styles = StyleSheet.create({});
