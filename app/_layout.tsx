import {
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_900Black,
  useFonts,
} from '@expo-google-fonts/frank-ruhl-libre';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  Appearance,
  Touchable,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@/utils/cache';
import Logo from '@/assets/images/nyt-logo.svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useMMKVBoolean } from 'react-native-mmkv';
import { storage } from '@/utils/storage';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Missing publishable key');
}

// Load the fonts first before hiding the splash screen
SplashScreen.preventAutoHideAsync;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dark] = useMMKVBoolean('dark-mode', storage);

  useEffect(() => {
    Appearance.setColorScheme(dark ? 'dark' : 'light');
  }, [dark]);

  let [fontsLoaded] = useFonts({
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen name='index' options={{ headerShown: false }} />
                <Stack.Screen
                  name='login'
                  options={{
                    presentation: 'modal',
                    headerShadowVisible: false,
                    headerTitle: () => <Logo height={40} width={150} />,
                    headerTitleAlign: 'center',
                  }}
                />
                <Stack.Screen
                  name='game'
                  options={{
                    headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                    title: '',
                  }}
                />
                <Stack.Screen
                  name='end'
                  options={{
                    presentation: 'fullScreenModal',
                    headerShown: false,
                    headerShadowVisible: false,
                  }}
                />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
