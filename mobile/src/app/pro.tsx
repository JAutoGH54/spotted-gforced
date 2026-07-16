import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchOfferings, purchaseSubscription, restorePurchases } from '@/lib/revenuecat';
import { Colors } from '@/constants/theme';

export default function ProModal() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  const [loading, setLoading] = useState(false);
  const [offerings, setOfferings] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    setLoading(true);
    const available = await fetchOfferings();
    setOfferings(available);
    if (available.length > 0) {
      setSelectedOffer(available[0]);
    }
    setLoading(false);
  };

  const handlePurchase = async () => {
    if (!selectedOffer) return;
    setLoading(true);
    const success = await purchaseSubscription(selectedOffer);
    setLoading(false);

    if (success) {
      Alert.alert('Congratulations!', 'You are now a Spotted Pro member!', [
        { text: 'Awesome', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Purchase Failed', 'Subscription purchase could not be completed.');
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    const success = await restorePurchases();
    setLoading(false);

    if (success) {
      Alert.alert('Restored', 'Your Pro entitlements have been restored successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('No Entitlements Found', 'We could not find any active subscriptions for your account.');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      {/* Close button */}
      <View style={styles.header}>
        <Text style={[styles.modalTitle, { color: colors.text }]}>Spotted Pro</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Hero Badge */}
      <View style={styles.heroSection}>
        <View style={[styles.proIconCircle, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="sparkles" size={54} color={colors.primary} />
        </View>
        <Text style={[styles.heroHeadline, { color: colors.text }]}>Unlock Premium Access</Text>
        <Text style={[styles.heroText, { color: colors.textSecondary }]}>
          Take your car spotting journey to the track level with exclusive features.
        </Text>
      </View>

      {/* Perks List */}
      <View style={styles.perksContainer}>
        <View style={styles.perkRow}>
          <Ionicons name="infinite" size={20} color={colors.primary} />
          <View style={styles.perkTextContainer}>
            <Text style={[styles.perkTitle, { color: colors.text }]}>Unlimited Car Spots</Text>
            <Text style={[styles.perkDesc, { color: colors.textSecondary }]}>Upload without boundaries and share your spots in high resolution.</Text>
          </View>
        </View>

        <View style={styles.perkRow}>
          <Ionicons name="funnel" size={20} color={colors.primary} />
          <View style={styles.perkTextContainer}>
            <Text style={[styles.perkTitle, { color: colors.text }]}>Advanced Map Filters</Text>
            <Text style={[styles.perkDesc, { color: colors.textSecondary }]}>Filter spots by Make, Model, and specific engine specs (V8, V10, V12).</Text>
          </View>
        </View>

        <View style={styles.perkRow}>
          <Ionicons name="trophy" size={20} color={colors.primary} />
          <View style={styles.perkTextContainer}>
            <Text style={[styles.perkTitle, { color: colors.text }]}>Enthusiast Meet Access</Text>
            <Text style={[styles.perkDesc, { color: colors.textSecondary }]}>Gain access to verified private supercar meets and RSVP lists.</Text>
          </View>
        </View>
      </View>

      {/* Subscription Tier Packages */}
      <View style={styles.packagesContainer}>
        {loading && offerings.length === 0 ? (
          <ActivityIndicator color={colors.primary} size="large" />
        ) : (
          offerings.map((pkg) => {
            const isSelected = selectedOffer?.identifier === pkg.identifier;
            return (
              <TouchableOpacity
                key={pkg.identifier}
                style={[
                  styles.packageCard,
                  {
                    backgroundColor: colors.backgroundElement,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  }
                ]}
                onPress={() => setSelectedOffer(pkg)}
              >
                <View style={styles.packageCardLeft}>
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  <View style={styles.packageNameContainer}>
                    <Text style={[styles.packageName, { color: colors.text }]}>
                      {pkg.product.title.replace(' (Spotted)', '')}
                    </Text>
                    <Text style={[styles.packageDesc, { color: colors.textSecondary }]}>
                      {pkg.product.description}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.packagePrice, { color: colors.text }]}>
                  {pkg.product.priceString}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Buy & Restore Controls */}
      <TouchableOpacity
        style={[styles.subscribeBtn, { backgroundColor: colors.primary }]}
        onPress={handlePurchase}
        disabled={loading || !selectedOffer}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.subscribeBtnText}>Upgrade Now</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
        <Text style={[styles.restoreBtnText, { color: colors.textSecondary }]}>Restore Purchases</Text>
      </TouchableOpacity>

      {/* StoreKit Billing Terms (Apple Requirement) */}
      <View style={styles.legalContainer}>
        <Text style={[styles.legalText, { color: colors.textSecondary }]}>
          A $4.99/monthly or $39.99/yearly purchase will be applied to your iTunes account on confirmation. Subscriptions will automatically renew unless canceled within 24-hours before the end of the current period. You can manage or cancel auto-renew anytime in your iTunes Account Settings. Any unused portion of a free trial will be forfeited if you purchase a subscription.
        </Text>
        <View style={styles.legalLinkRow}>
          <TouchableOpacity onPress={() => Alert.alert('Terms of Use', 'Link to Apple Standard EULA...')}>
            <Text style={[styles.legalLink, { color: colors.textSecondary }]}>Terms of Use (EULA)</Text>
          </TouchableOpacity>
          <Text style={[styles.legalLinkDot, { color: colors.textSecondary }]}>•</Text>
          <TouchableOpacity onPress={() => Alert.alert('Privacy Policy', 'Link to Privacy Policy...')}>
            <Text style={[styles.legalLink, { color: colors.textSecondary }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 6,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  proIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroHeadline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  perksContainer: {
    marginBottom: 32,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  perkTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  perkTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  perkDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  packagesContainer: {
    marginBottom: 24,
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  packageCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  packageNameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  packageName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  packageDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 8,
  },
  subscribeBtn: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 20,
  },
  restoreBtnText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    paddingTop: 16,
  },
  legalText: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
  legalLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  legalLink: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  legalLinkDot: {
    fontSize: 11,
    marginHorizontal: 8,
  },
});
