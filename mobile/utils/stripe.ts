import { Platform } from 'react-native';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe for web
const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

// Platform-specific payment handler
export const handlePayment = async (
  amount: number,
  onSuccess: (response: any) => void,
  onError: (error: any) => void
) => {
  if (Platform.OS === 'web') {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Create payment intent on your server
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URI}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const { client_secret } = await response.json();

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
    // Only import native Stripe on mobile platforms
    const { useStripe } = require('@stripe/stripe-react-native');
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URI}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const { client_secret } = await response.json();

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