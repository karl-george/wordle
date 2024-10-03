import { Colors } from '@/constants/Colors';
import { storage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useMMKVBoolean } from 'react-native-mmkv';

export type Ref = BottomSheetModal;

const SettingsModal = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ['50%'], []);
  const { dismiss } = useBottomSheetModal();

  const [hardMode, setHardMode] = useMMKVBoolean('hard-mode', storage);
  const [darkMode, setDarkMode] = useMMKVBoolean('dark-mode', storage);
  const [contrastMode, setContrastMode] = useMMKVBoolean(
    'contrast-mode',
    storage
  );

  const toggleDarkMode = () => setDarkMode((previousState) => !!!previousState);

  const toggleContrast = () =>
    setContrastMode((previousState) => !!!previousState);

  const toggleHardMode = () => setHardMode((previousState) => !!!previousState);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={dismiss}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      ref={ref}
      backdropComponent={renderBackdrop}
      index={0}
      handleComponent={() => null}
    >
      <View style={[styles.contentContainer]}>
        <View style={styles.modalBtns}>
          <Text style={styles.containerHeadline}>Settings</Text>
          <TouchableOpacity onPress={() => dismiss()}>
            <Ionicons name='close' size={28} color={Colors.light.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTextBig}>Hard Mode</Text>
            <Text style={styles.rowTextSmall}>Words are longer and harder</Text>
          </View>
          <Switch
            trackColor={{ true: '#000' }}
            ios_backgroundColor='#9a9a9a'
            onValueChange={toggleHardMode}
            value={hardMode}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTextBig}>Dark Mode</Text>
            <Text style={styles.rowTextSmall}>Change the app's theme</Text>
          </View>
          <Switch
            trackColor={{ true: '#000' }}
            ios_backgroundColor='#9a9a9a'
            onValueChange={toggleDarkMode}
            value={darkMode}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTextBig}>High Contrast Mode</Text>
            <Text style={styles.rowTextSmall}>Increase the contrast</Text>
          </View>
          <Switch
            trackColor={{ true: '#000' }}
            ios_backgroundColor='#9a9a9a'
            onValueChange={toggleContrast}
            value={contrastMode}
          />
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default SettingsModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  containerHeadline: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_900Black',
    fontWeight: 'bold',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#888',
  },
  rowText: {
    flex: 1,
  },
  rowTextBig: {
    fontSize: 18,
  },
  rowTextSmall: {
    fontSize: 14,
    color: '#5e5e5e',
  },
});
