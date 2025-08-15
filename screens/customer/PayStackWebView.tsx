import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export default function PaystackCheckout() {
  const route = useRoute();
  const navigation = useNavigation();
  const { url: rawUrl } = route.params as { url: string };

  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (rawUrl?.startsWith('http')) {
      setUrl(rawUrl);
    } else {
      console.warn('Invalid Paystack URL');
    }
  }, [rawUrl]);

  const handleNavChange = (navState: any) => {
    const currentUrl = navState.url;

    // ✅ Detect app deep link
    if (currentUrl.startsWith('fruitpack://')) {
      if (currentUrl.includes('payment-success')) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'OrderList' }],
        });
      } else if (currentUrl.includes('payment-cancel')) {
        navigation.goBack();
      }
      return false;
    }

    // ✅ Detect hosted redirect pages
    if (currentUrl.includes('payment-success')) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'OrderList' }],
      });
      return false;
    }
    if (currentUrl.includes('payment-cancel')) {
      navigation.goBack();
      return false;
    }

    return true;
  };

  if (!url) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00C851" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onShouldStartLoadWithRequest={handleNavChange}
      />
      {/* Floating Return Button */}
  <View style={{
  position: 'absolute',
  bottom: 20,
  left: 0,
  right: 0,
  alignItems: 'center',
}}>
  <TouchableOpacity
    onPress={() => navigation.reset({
      index: 0,
      routes: [{ name: 'OrderList' }],
    })}
    style={{
      backgroundColor: '#00C851',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 28,
      elevation: 4,
      minWidth: 180,
      marginBottom:25,
      alignItems: 'center',
    }}
  >
    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
      Return to App
    </Text>
  </TouchableOpacity>
</View>

    </SafeAreaView>
  );
}
