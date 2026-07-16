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
    return (
      <View style={[styles.mockMapContainer, { backgroundColor: colors.backgroundElement }]}>
        <View style={styles.mockHeader}>
          <Text style={[styles.mockMapTitle, { color: colors.text }]}>Car Spots Map View</Text>
          <Text style={[styles.mockMapSubtitle, { color: colors.textSecondary }]}>
            (Simulator/Web Interactive Preview)
          </Text>
        </View>
        
        {/* Car markers simulator list */}
        <ScrollView style={styles.markerList}>
          {spots.map((spot) => (
            <TouchableOpacity 
              key={spot.id} 
              style={[styles.mockMarkerCard, { borderColor: colors.border, backgroundColor: colors.background }]}
              onPress={() => setSelectedSpot(spot)}
            >
              <Ionicons name="car-sport" size={24} color={colors.primary} />
              <View style={styles.mockMarkerText}>
                <Text style={[styles.mockMarkerName, { color: colors.text }]}>{spot.title}</Text>
                <Text style={[styles.mockMarkerInfo, { color: colors.textSecondary }]}>
                  {spot.make} {spot.model} • spotted by @{spot.profiles?.username}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    padding: 16,
  },
  mockHeader: {
    marginBottom: 16,
  },
  mockMapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mockMapSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  markerList: {
    flex: 1,
  },
  mockMarkerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  mockMarkerText: {
    flex: 1,
    marginLeft: 12,
  },
  mockMarkerName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  mockMarkerInfo: {
    fontSize: 12,
    marginTop: 2,
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
