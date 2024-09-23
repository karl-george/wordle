import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export type Ref = BottomSheetModal;

const SubscribeModal = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ['90%'], []);
  const { dismiss } = useBottomSheetModal();
  const { bottom } = useSafeAreaInsets();

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
          <Link href='/login' asChild>
            <TouchableOpacity>
              <Text style={styles.btnText}>LOG IN</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity onPress={() => dismiss()}>
            <Ionicons name='close' size={28} color={Colors.light.gray} />
          </TouchableOpacity>
        </View>

        <BottomSheetScrollView>
          <Text style={styles.containerHeadline}>
            Unlimited Play. {'\n'} Try free for 7 days
          </Text>
          <Image
            source={require('../assets/images/games.png')}
            style={styles.image}
          />
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
});

export default SubscribeModal;

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
  btnText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  containerHeadline: {
    fontSize: 34,
    padding: 20,
    textAlign: 'center',
    fontFamily: 'FrankRuhlLibre_900Black',
  },
  image: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
  },
});
