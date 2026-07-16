import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { Stack, router, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { initRevenueCat } from '@/lib/revenuecat';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];
  
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // Check onboarding status
    const checkOnboarding = async () => {
      try {
        const completed = await AsyncStorage.getItem('has_completed_onboarding');
        setHasCompletedOnboarding(completed === 'true');
      } catch (err) {
        console.warn('Error reading onboarding state:', err);
        setHasCompletedOnboarding(false);
      }
    };

    // Check current auth session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session?.user?.id) {
          await initRevenueCat(session.user.id);
        }
      } catch (err) {
        console.warn('Error fetching Supabase session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession?.user?.id) {
        await initRevenueCat(newSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Control routing flow based on auth and onboarding status
  useEffect(() => {
    if (isLoading || hasCompletedOnboarding === null) return;

    // Bypass auth/login checks to view app directly
    router.replace('/(tabs)');
  }, [session, isLoading, hasCompletedOnboarding]);

  if (isLoading || hasCompletedOnboarding === null) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const baseTheme = scheme === 'dark' || scheme === 'unspecified' ? DarkTheme : DefaultTheme;

  const currentTheme = {
    ...baseTheme,
    dark: scheme === 'dark' || scheme === 'unspecified',
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.backgroundElement,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <ThemeProvider value={currentTheme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(auth)/login" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="pro" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
