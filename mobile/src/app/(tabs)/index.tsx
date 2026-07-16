import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, useColorScheme, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

// Mapbox safe loading wrapper
let MapboxGL: any = null;
if (Platform.OS !== 'web') {
  try {
    MapboxGL = require('@rnmapbox/maps').default;
    MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || 'placeholder_token');
  } catch (e) {
    console.warn('Mapbox GL failed to load natively:', e);
  }
}

// Preset locations for manual search fallback (when location permission is denied)
interface CityPreset {
  name: string;
  coords: [number, number]; // [longitude, latitude]
}

const CITY_PRESETS: CityPreset[] = [
  { name: 'Tokyo (Daikoku Futo)', coords: [139.6917, 35.6895] },
  { name: 'Munich (BMW Welt)', coords: [11.5820, 48.1351] },
  { name: 'Los Angeles (Angeles Crest)', coords: [-118.2437, 34.0522] },
  { name: 'London (Mayfair)', coords: [-0.1276, 51.5074] },
];

export default function MapTab() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null);

  useEffect(() => {
    checkLocationPermission();
    fetchSpots();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentCoords([location.coords.longitude, location.coords.latitude]);
      } else {
        // Fallback to default (Tokyo) if permission denied
        setCurrentCoords([139.6917, 35.6895]);
      }
    } catch (error) {
      console.warn('Error fetching location:', error);
      setHasPermission(false);
      setCurrentCoords([139.6917, 35.6895]);
    }
  };

  const fetchSpots = async () => {
    setLoading(true);
    try {
      // Query spots from Supabase
      const { data, error } = await supabase
        .from('spots')
        .select(`
          *,
          profiles:user_id (username, is_pro)
        `)
        .eq('moderation_status', 'approved') // Only load approved content (UGC guidelines)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSpots(data || []);
    } catch (error) {
      console.warn('Error loading spots from Supabase, loading mock data:', error);
      // Fallback Mock Spots for sports cars
      setSpots([
        {
          id: '1',
          title: 'Porsche GT3 RS (992)',
          make: 'Porsche',
          model: '911 GT3 RS',
          latitude: 35.6895,
          longitude: 139.6917,
          image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800',
          profiles: { username: 'shuto_racer', is_pro: true }
        },
        {
          id: '2',
          title: 'Ferrari SF90 Stradale',
          make: 'Ferrari',
          model: 'SF90',
          latitude: 48.1351,
          longitude: 11.5820,
          image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
          profiles: { username: 'bimmer_boy', is_pro: false }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city: CityPreset) => {
    setCurrentCoords(city.coords);
    setShowSearchModal(false);
    Alert.alert('Centered Map', `Moved map focus to ${city.name}`);
  };

  const triggerManualPermissionRequest = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentCoords([location.coords.longitude, location.coords.latitude]);
    }
  };

  // Mock Map Rendering for Web / Simulator where Mapbox native isn't supported
  const renderMockMap = () => {
    const centerLong = currentCoords ? currentCoords[0] : 139.6917;
    const centerLat = currentCoords ? currentCoords[1] : 35.6895;

    // Helper to project lat/long coordinates onto our simulated visual grid relative to the current focused coordinate
    const getPinCoords = (spotLong: number, spotLat: number) => {
      const dLong = spotLong - centerLong;
      const dLat = spotLat - centerLat;

      // Adjust scale to keep them visible but separated on screen
      const scale = 400; 
      const x = 50 + dLong * scale;
      const y = 50 - dLat * scale; // Invert Y for screen coordinates

      return {
        left: `${Math.max(10, Math.min(90, x))}%` as any,
        top: `${Math.max(10, Math.min(85, y))}%` as any,
      };
    };

    return (
      <View style={[styles.mockMapContainer, { backgroundColor: '#070b13' }]}>
        {/* Background Grid Lines */}
        <View style={styles.gridOverlay}>
          {/* Vertical grid lines */}
          <View style={[styles.gridLineV, { left: '16.6%' }]} />
          <View style={[styles.gridLineV, { left: '33.3%' }]} />
          <View style={[styles.gridLineV, { left: '50.0%' }]} />
          <View style={[styles.gridLineV, { left: '66.6%' }]} />
          <View style={[styles.gridLineV, { left: '83.3%' }]} />

          {/* Horizontal grid lines */}
          <View style={[styles.gridLineH, { top: '16.6%' }]} />
          <View style={[styles.gridLineH, { top: '33.3%' }]} />
          <View style={[styles.gridLineH, { top: '50.0%' }]} />
          <View style={[styles.gridLineH, { top: '66.6%' }]} />
          <View style={[styles.gridLineH, { top: '83.3%' }]} />
        </View>

        {/* Stylized River (slanting blue bar) */}
        <View style={styles.mockRiver} />

        {/* Stylized Parks */}
        <View style={[styles.mockPark, { left: '8%', top: '38%', width: 80, height: 60 }]} />
        <View style={[styles.mockPark, { right: '12%', bottom: '22%', width: 70, height: 70, borderRadius: 35 }]} />

        {/* Stylized Streets */}
        <View style={[styles.mockStreet, { left: 0, top: '25%', width: '100%', height: 3 }]} />
        <View style={[styles.mockStreet, { left: 0, top: '70%', width: '100%', height: 3 }]} />
        <View style={[styles.mockStreet, { left: '30%', top: 0, width: 3, height: '100%' }]} />
        <View style={[styles.mockStreet, { left: '75%', top: 0, width: 3, height: '100%' }]} />
        
        {/* Highway */}
        <View style={[styles.mockHighway, { left: 0, top: '48%', width: '100%', height: 8 }]} />

        {/* Search location focus radar indicator */}
        <View style={[styles.centerRadar, { left: '50%', top: '50%', marginLeft: -24, marginTop: -24 }]} />
        <View style={[styles.centerDot, { left: '50%', top: '50%', marginLeft: -4, marginTop: -4 }]} />

        {/* Map Markers for Spots */}
        {spots.map((spot) => {
          const pinStyle = getPinCoords(spot.longitude, spot.latitude);
          const isSelected = selectedSpot?.id === spot.id;

          return (
            <TouchableOpacity
              key={spot.id}
              style={[
                styles.mockPinContainer,
                pinStyle,
                isSelected && styles.mockPinSelected
              ]}
              onPress={() => setSelectedSpot(spot)}
            >
              {isSelected && <View style={styles.selectedPinPulse} />}
              <View style={[styles.mockCustomPin, { backgroundColor: isSelected ? colors.primary : '#3a93ff' }]}>
                <Ionicons name="car-sport" size={14} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Floating instruction card */}
        <View style={[styles.floatingInfoCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
          <Text style={[styles.floatingInfoTitle, { color: colors.text }]}>Car Spots Map Preview</Text>
          <Text style={[styles.floatingInfoSubtitle, { color: colors.textSecondary }]}>
            {Platform.OS === 'web' ? 'Web interactive simulation' : 'Simulator preview (Mapbox bypassed)'}
          </Text>
        </View>

        {/* Floating List toggle button */}
        <TouchableOpacity 
          style={[styles.floatingListToggle, { backgroundColor: colors.primary }]}
          onPress={() => {
            const spotList = spots.map(s => `• ${s.title} (${s.make} ${s.model})`).join('\n');
            Alert.alert('All Car Spots', spotList);
          }}
        >
          <Ionicons name="list" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Warning header when location permission is denied */}
      {hasPermission === false && (
        <View style={[styles.warningBanner, { backgroundColor: colors.danger + '22' }]}>
          <Ionicons name="location-outline" size={18} color={colors.danger} />
          <Text style={[styles.warningText, { color: colors.danger }]}>
            GPS Location Denied.
          </Text>
          <TouchableOpacity onPress={triggerManualPermissionRequest}>
            <Text style={[styles.warningAction, { color: colors.primary }]}>Enable</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Map Control Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search car spots or cities..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setShowSearchModal(true)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Map View Rendering */}
      <View style={styles.mapViewport}>
        {Platform.OS === 'web' || !MapboxGL ? (
          renderMockMap()
        ) : (
          <MapboxGL.MapView style={styles.nativeMap} styleURL={MapboxGL.StyleURL.Dark}>
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={currentCoords || [139.6917, 35.6895]}
            />
            {spots.map((spot) => (
              <MapboxGL.PointAnnotation
                key={spot.id}
                id={spot.id}
                coordinate={[spot.longitude, spot.latitude]}
                onSelected={() => setSelectedSpot(spot)}
              >
                <View style={[styles.customPin, { backgroundColor: colors.primary }]}>
                  <Ionicons name="car-sport" size={14} color="#FFFFFF" />
                </View>
              </MapboxGL.PointAnnotation>
            ))}
          </MapboxGL.MapView>
        )}
      </View>

      {/* Manual Location Selection Modal */}
      {showSearchModal && (
        <View style={[styles.modalOverlay, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Manual Location Search</Text>
            <TouchableOpacity onPress={() => setShowSearchModal(false)}>
              <Ionicons name="close-circle" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
            Select a supercar capital below to browse spots:
          </Text>
          <ScrollView>
            {CITY_PRESETS.map((city) => (
              <TouchableOpacity
                key={city.name}
                style={[styles.cityRow, { borderBottomColor: colors.border }]}
                onPress={() => handleCitySelect(city)}
              >
                <Ionicons name="pin" size={18} color={colors.primary} />
                <Text style={[styles.cityName, { color: colors.text }]}>{city.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Details drawer for selected Spot */}
      {selectedSpot && (
        <View style={[styles.spotDetailsDrawer, { backgroundColor: colors.backgroundElement, borderTopColor: colors.border }]}>
          <View style={styles.drawerHeader}>
            <Text style={[styles.drawerTitle, { color: colors.text }]}>{selectedSpot.title}</Text>
            <TouchableOpacity onPress={() => setSelectedSpot(null)}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.drawerSubtitle, { color: colors.textSecondary }]}>
            {selectedSpot.make} {selectedSpot.model} • spotted by @{selectedSpot.profiles?.username}
          </Text>
          <TouchableOpacity 
            style={[styles.viewSpotBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              Alert.alert('Spot Details', `Navigate to details page for ${selectedSpot.title}`);
            }}
          >
            <Text style={styles.viewSpotBtnText}>View Spot Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  warningText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  warningAction: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },
  mapViewport: {
    flex: 1,
  },
  nativeMap: {
    flex: 1,
  },
  customPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mockMapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.12,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#5ab2ff',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#5ab2ff',
  },
  mockRiver: {
    position: 'absolute',
    left: '-20%',
    top: '30%',
    width: '140%',
    height: 35,
    backgroundColor: '#5ab2ff',
    opacity: 0.12,
    transform: [{ rotate: '-35deg' }],
  },
  mockPark: {
    position: 'absolute',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 1.5,
    borderRadius: 8,
  },
  mockStreet: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  mockHighway: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(90, 178, 255, 0.2)',
  },
  centerRadar: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(90, 178, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(90, 178, 255, 0.25)',
  },
  centerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5ab2ff',
  },
  mockPinContainer: {
    position: 'absolute',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  mockPinSelected: {
    transform: [{ scale: 1.2 }],
    zIndex: 20,
  },
  selectedPinPulse: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(90, 178, 255, 0.3)',
  },
  mockCustomPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  floatingInfoCard: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    opacity: 0.9,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  floatingInfoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  floatingInfoSubtitle: {
    fontSize: 9,
    marginTop: 2,
  },
  floatingListToggle: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 80,
    zIndex: 100,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  spotDetailsDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -4 },
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerSubtitle: {
    fontSize: 13,
    marginVertical: 8,
  },
  viewSpotBtn: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  viewSpotBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
