import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from 'hooks/useAuth';
import { CartProvider } from 'hooks/useCart';
import './global.css';
import AppNavigator from './navigation';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <AuthProvider>
        <CartProvider>
          <AppNavigator />
          <Toast />
        </CartProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}