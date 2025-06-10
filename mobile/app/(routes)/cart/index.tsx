import CartScreen from "@/screens/cart/cart.screen";
import { Platform } from "react-native";
import { loadStripe } from "@stripe/stripe-js";

export default function index() {
  if (Platform.OS === 'web') {
    const { Elements } = require('@stripe/stripe-js');
    return (
      <Elements stripe={loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!)}>
        <CartScreen />
      </Elements>
    );
  }

  const { StripeProvider } = require('@stripe/stripe-react-native');
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
    >
      <CartScreen />
    </StripeProvider>
  );
}
