import { Platform } from 'react-native';

let Purchases: any = null;
if (Platform.OS !== 'web') {
  try {
    Purchases = require('react-native-purchases').default;
  } catch (error) {
    console.warn('RevenueCat SDK failed to load natively:', error);
  }
}

const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || 'placeholder_ios';
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || 'placeholder_android';

export const ENTITLEMENT_ID = 'pro'; // entitlement key in RevenueCat dashboard

export const initRevenueCat = async (userId?: string) => {
  if (!Purchases) {
    console.log('[RevenueCat] Mock Init: Native SDK not active (Web/Sim fallback).');
    return;
  }

  try {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    if (Platform.OS === 'ios') {
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY_IOS, appUserID: userId });
    } else if (Platform.OS === 'android') {
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY_ANDROID, appUserID: userId });
    }
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
  }
};

export const getSubscriptionStatus = async (): Promise<boolean> => {
  if (!Purchases) return false;
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return false;
  }
};

export const fetchOfferings = async (): Promise<any[]> => {
  if (!Purchases) {
    // Return mock offering for web/testing compatibility
    return [
      {
        identifier: 'spotted_pro_monthly',
        packageType: 'MONTHLY',
        product: {
          title: 'Spotted Pro Monthly',
          description: 'Unlock unlimited car spots, premium map filters, and ad-free browsing.',
          priceString: '$4.99',
        },
      }
    ];
  }
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (error) {
    console.error('Error fetching RevenueCat offerings:', error);
    return [];
  }
};

export const purchaseSubscription = async (rcPackage: any): Promise<boolean> => {
  if (!Purchases) {
    console.log('[RevenueCat] Mock Purchase Successful for package:', rcPackage.identifier);
    return true;
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(rcPackage);
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (error) {
    console.warn('Subscription purchase failed or was cancelled:', error);
    return false;
  }
};

export const restorePurchases = async (): Promise<boolean> => {
  if (!Purchases) return false;
  try {
    const customerInfo = await Purchases.restorePurchases();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return false;
  }
};
