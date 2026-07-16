import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function Onboarding() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];
  
  const [step, setStep] = useState(0);
  const [locationStatus, setLocationStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [mediaStatus, setMediaStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationStatus(status);
      if (status === 'granted') {
        Alert.alert('Success', 'Location permission granted! Nearby sports cars will be loaded on the map.');
      } else {
        Alert.alert('Location Denied', 'GPS is disabled. You can still search for car meets manually.');
      }
    } catch (error) {
      console.warn('Error requesting location:', error);
      setLocationStatus('denied');
    }
  };

  const requestMediaPermissions = async () => {
    try {
      const cameraReq = await ImagePicker.requestCameraPermissionsAsync();
      const libraryReq = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraReq.status === 'granted' && libraryReq.status === 'granted') {
        setMediaStatus('granted');
        Alert.alert('Success', 'Camera and photo library permissions granted!');
      } else {
        setMediaStatus('denied');
        Alert.alert('Permissions Denied', 'You will not be able to take or upload new spots from your phone.');
      }
    } catch (error) {
      console.warn('Error requesting media permissions:', error);
      setMediaStatus('denied');
    }
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('has_completed_onboarding', 'true');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: colors.backgroundSelected }]}>
              <Ionicons name="car-sport" size={60} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Welcome to Spotted</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              The premium car spotting and auto enthusiast platform. Track exotic supercars, discover local meets, and share your automotive passion.
            </Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: colors.backgroundSelected }]}>
              <Ionicons name="map" size={60} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Enable Location Access</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Spotted uses your location to display exotic spots around you and locate car meets. If you deny access, you can still type in manual addresses.
            </Text>
            <TouchableOpacity 
              style={[styles.permissionBtn, { backgroundColor: colors.primary }]}
              onPress={requestLocationPermission}
            >
              <Text style={styles.permissionBtnText}>
                {locationStatus === 'granted' ? 'Location Enabled ✓' : 'Grant Location Access'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: colors.backgroundSelected }]}>
              <Ionicons name="camera" size={60} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Camera & Photos Access</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Snap supercars on the street or upload from your library. We need camera and library permissions to process uploads.
            </Text>
            <TouchableOpacity 
              style={[styles.permissionBtn, { backgroundColor: colors.primary }]}
              onPress={requestMediaPermissions}
            >
              <Text style={styles.permissionBtnText}>
                {mediaStatus === 'granted' ? 'Media Access Enabled ✓' : 'Grant Media Access'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: colors.backgroundSelected }]}>
              <Ionicons name="checkmark-circle" size={60} color={colors.success} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Ready to Spot?</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              You are all set. Create your account to start checking in spots, commenting, and networking with other spotters!
            </Text>
            <TouchableOpacity 
              style={[styles.completeBtn, { backgroundColor: colors.success }]}
              onPress={handleComplete}
            >
              <Text style={styles.completeBtnText}>Enter Spotted</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header indicator */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          {[0, 1, 2, 3].map((idx) => (
            <View 
              key={idx}
              style={[
                styles.progressDot, 
                { 
                  backgroundColor: idx <= step ? colors.primary : colors.backgroundSelected,
                  flex: 1,
                  marginHorizontal: 3
                }
              ]} 
            />
          ))}
        </View>
      </View>

      <View style={styles.body}>
        {renderStepContent()}
      </View>

      {/* Navigation buttons */}
      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity 
            style={[styles.navBtn, { borderColor: colors.border, borderWidth: 1 }]}
            onPress={() => setStep(prev => prev - 1)}
          >
            <Text style={[styles.navBtnText, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }} />
        {step < 3 ? (
          <TouchableOpacity 
            style={[styles.navBtn, { backgroundColor: colors.backgroundSelected }]}
            onPress={() => setStep(prev => prev + 1)}
          >
            <Text style={[styles.navBtnText, { color: colors.text }]}>Next</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  progressBar: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
  },
  progressDot: {
    height: 4,
    borderRadius: 2,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  completeBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  navBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  navBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
