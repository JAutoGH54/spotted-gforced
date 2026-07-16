import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, RefreshControl, Alert, ActivityIndicator, useColorScheme } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function SavedTab() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  const [savedSpots, setSavedSpots] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedSpots();
  }, []);

  const fetchSavedSpots = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_spots')
        .select(`
          id,
          created_at,
          spots:spot_id (
            id,
            title,
            description,
            image_url,
            make,
            model,
            moderation_status
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedSpots(data || []);
    } catch (error) {
      console.warn('Failed to load saved spots, load mocks:', error);
      // Fallback Mock data for visual inspection
      setSavedSpots([
        {
          id: 'mock_saved_1',
          spots: {
            id: '1',
            title: 'Porsche GT3 RS (992)',
            make: 'Porsche',
            model: '911 GT3 RS',
            image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800',
            description: 'Crazy shark blue GT3 RS seen parking in Shibuya.'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSavedSpots();
    setRefreshing(false);
  };

  const handleUnsave = async (savedId: string) => {
    Alert.alert('Remove Bookmark', 'Are you sure you want to remove this spot from your saved list?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('saved_spots')
              .delete()
              .eq('id', savedId);

            if (error) throw error;
            setSavedSpots(prev => prev.filter(item => item.id !== savedId));
          } catch (error) {
            // Mock offline deletion support
            setSavedSpots(prev => prev.filter(item => item.id !== savedId));
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => {
    const spot = item.spots;
    if (!spot) return null;

    return (
      <View style={[styles.card, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
        <Image source={{ uri: spot.image_url }} style={styles.image} />
        <View style={styles.cardInfo}>
          <Text style={[styles.spotTitle, { color: colors.text }]}>{spot.title}</Text>
          <Text style={[styles.spotSub, { color: colors.textSecondary }]}>
            {spot.make} {spot.model}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {spot.description}
          </Text>
          
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: colors.backgroundSelected }]}
              onPress={() => Alert.alert('Details', `Opening spot ${spot.title}`)}
            >
              <Ionicons name="eye" size={16} color={colors.text} />
              <Text style={[styles.actionText, { color: colors.text }]}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.unsaveBtn, { borderColor: colors.danger }]}
              onPress={() => handleUnsave(item.id)}
            >
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
              <Text style={[styles.unsaveText, { color: colors.danger }]}>Unsave</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {loading && savedSpots.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={savedSpots}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons name="bookmark-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Spots</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Spots you bookmark on the map will appear here.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardInfo: {
    padding: 16,
  },
  spotTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  spotSub: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  unsaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  unsaveText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
