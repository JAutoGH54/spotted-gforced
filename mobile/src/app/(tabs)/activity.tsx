import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Alert, RefreshControl, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import ReportBlockModal from '@/components/ReportBlockModal';

interface ActivityItem {
  id: string;
  type: 'like' | 'comment' | 'spot';
  username: string;
  userAvatar: string;
  targetCar: string;
  content?: string;
  time: string;
  unread: boolean;
}

export default function ActivityTab() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  const [refreshing, setRefreshing] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [activeReportUser, setActiveReportUser] = useState<string>('');

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'act_1',
      type: 'comment',
      username: 'shuto_racer',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      targetCar: 'Porsche GT3 RS',
      content: 'That shark blue wrap is insane in person! Caught it yesterday too.',
      time: '2 mins ago',
      unread: true,
    },
    {
      id: 'act_2',
      type: 'like',
      username: 'apex_collector',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      targetCar: 'Ferrari SF90',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 'act_3',
      type: 'spot',
      username: 'jdm_legends',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      targetCar: 'Nissan Skyline GT-R R34',
      content: 'Mint condition Bayside Blue Skyline spotted cruising Mayfair.',
      time: '5 hours ago',
      unread: false,
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refreshing feed
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleReportPress = (item: ActivityItem) => {
    setActiveReportId(item.id);
    setActiveReportUser(item.username);
    setReportModalVisible(true);
  };

  const markAllAsRead = () => {
    setActivities(prev => prev.map(item => ({ ...item, unread: false })));
  };

  const renderItem = ({ item }: { item: ActivityItem }) => {
    const getIcon = () => {
      switch (item.type) {
        case 'like':
          return <Ionicons name="heart" size={18} color={colors.danger} />;
        case 'comment':
          return <Ionicons name="chatbubble" size={18} color={colors.primary} />;
        case 'spot':
          return <Ionicons name="car-sport" size={18} color={colors.accent} />;
      }
    };

    return (
      <View style={[
        styles.activityCard, 
        { 
          backgroundColor: colors.backgroundElement, 
          borderColor: colors.border,
          borderLeftColor: item.unread ? colors.primary : colors.border,
          borderLeftWidth: item.unread ? 4 : 1
        }
      ]}>
        <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
        
        <View style={styles.contentArea}>
          <Text style={[styles.cardText, { color: colors.text }]}>
            <Text style={styles.boldText}>@{item.username}</Text>{' '}
            {item.type === 'like' && 'liked your spot of '}
            {item.type === 'comment' && 'commented on your '}
            {item.type === 'spot' && 'posted a new spot of '}
            <Text style={styles.boldText}>{item.targetCar}</Text>
          </Text>

          {item.content && (
            <Text style={[styles.commentBubble, { color: colors.textSecondary, backgroundColor: colors.backgroundSelected }]} numberOfLines={3}>
              "{item.content}"
            </Text>
          )}

          <View style={styles.cardFooter}>
            <View style={styles.iconRow}>
              {getIcon()}
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>{item.time}</Text>
            </View>
            
            {/* Safety Options: Flag content (App Review compliance) */}
            <TouchableOpacity onPress={() => handleReportPress(item)} style={styles.flagButton}>
              <Ionicons name="flag-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.flagText, { color: colors.textSecondary }]}>Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Activity Toolbar */}
      <View style={[styles.toolbar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.toolbarTitle, { color: colors.text }]}>Updates</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={[styles.markReadText, { color: colors.primary }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      />

      {/* Standard Safety Reporting & Blocking Modal */}
      {reportModalVisible && (
        <ReportBlockModal
          visible={reportModalVisible}
          targetType={activeReportId?.startsWith('act_') ? 'comment' : 'user'}
          targetId={activeReportId || ''}
          targetUsername={activeReportUser}
          onClose={() => setReportModalVisible(false)}
          onSuccess={() => {
            setReportModalVisible(false);
            Alert.alert('Report Filed', 'Thank you. The reported content has been hidden and sent to moderators.');
            // Hide the reported item from user's view
            if (activeReportId) {
              setActivities(prev => prev.filter(item => item.id !== activeReportId));
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  toolbarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  markReadText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  activityCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  contentArea: {
    flex: 1,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  commentBubble: {
    fontSize: 13,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginLeft: 6,
  },
  flagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  flagText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
