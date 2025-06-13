import { Platform } from 'react-native';
import { loadStripe } from '@stripe/stripe-js';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Stripe for web
const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Platform-specific payment handler
export const handlePayment = async (
  amount: number,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  stripeMethods?: { initPaymentSheet: any; presentPaymentSheet: any }
) => {
  // Use the correct payment endpoint for your backend
  const PAYMENT_URL =
    Platform.OS === 'web'
      ? `${process.env.EXPO_PUBLIC_SERVER_URI}/payment`
      : `${process.env.EXPO_PUBLIC_API_URL}/order/payment`;

  if (Platform.OS === 'web') {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Create payment intent on your server
      const response = await fetch(PAYMENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const contentType = response.headers.get('content-type');
      let client_secret: string;

      if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        client_secret = json.client_secret;
      } else {
        const text = await response.text();
        throw new Error('Unexpected response: ' + text);
      }

      // Confirm the payment
      const result = await stripe.confirmCardPayment(client_secret);

      if (result.error) {
        onError(result.error);
      } else {
        onSuccess(result.paymentIntent);
      }
    } catch (error) {
      onError(error);
    }
  } else {
    // Use the passed-in stripeMethods from the component
    if (!stripeMethods) {
      onError(new Error('Stripe methods not provided'));
      return;
    }
    const { initPaymentSheet, presentPaymentSheet } = stripeMethods;

    try {
      // Get the access token from AsyncStorage
      const accessToken = await AsyncStorage.getItem("access_token");

      const response = await fetch(PAYMENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // <-- ADD THIS LINE
        },
        body: JSON.stringify({ amount }),
      });

      const contentType = response.headers.get('content-type');
      let client_secret: string;

      if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        client_secret = json.client_secret;
      } else {
        const text = await response.text();
        throw new Error('Unexpected response: ' + text);
      }

      const initResponse = await initPaymentSheet({
        merchantDisplayName: "Becodemy Private Ltd.",
        paymentIntentClientSecret: client_secret,
      });

      if (initResponse.error) {
        onError(initResponse.error);
        return;
      }

      const paymentResponse = await presentPaymentSheet();

      if (paymentResponse.error) {
        onError(paymentResponse.error);
      } else {
        onSuccess(paymentResponse);
      }
    } catch (error) {
      onError(error);
    }
  }
};

// Platform-specific Stripe hook
export const useStripe = () => {
  if (Platform.OS === 'web') {
    return {
      initPaymentSheet: async () => {
        const stripe = await stripePromise;
        return { error: null, stripe };
      },
      presentPaymentSheet: async () => {
        const stripe = await stripePromise;
        return { error: null, stripe };
      }
    };
  }

  // Only import native Stripe on mobile platforms
  const { useStripe: useStripeNative } = require('@stripe/stripe-react-native');
  return useStripeNative();
};