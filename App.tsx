import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation';
import { AuthProvider } from "hooks/useAuth";
import './global.css';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
