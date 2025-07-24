import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from 'hooks/useAuth';
import { StripeProvider } from '@stripe/stripe-react-native';
import { CartProvider } from './context/CartContext';
import './global.css'; // Tailwind / NativeWind config
import AppNavigator from './navigation';

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <StripeProvider publishableKey="pk_test_51RdCtN3kUzyeaRBl78k621VUBkmeaOl8yqzwpTaKdNWkTP4RoKfc5X07fSrV9fnESdxR67nAnZ3KmEMCq3k3oH7e00YyRLb5VV"> 
        <AuthProvider>
          <CartProvider>
            <AppNavigator />
          </CartProvider>
        </AuthProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
