import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

export default function MapSelector() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required to use the map.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  const handleMapPress = (e: MapPressEvent) => {
    setMarker(e.nativeEvent.coordinate);
  };

  const handleConfirm = () => {
    if (!marker) {
      Alert.alert('No Location', 'Please long-press on the map to select your delivery location.');
      return;
    }

    router.back({
      params: {
        latitude: marker.latitude.toString(),
        longitude: marker.longitude.toString(),
      },
    });
  };

  if (loading || !location) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        className="flex-1"
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onLongPress={handleMapPress}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <View className="absolute bottom-6 left-4 right-4">
        <Text
          onPress={handleConfirm}
          className="bg-green-600 text-white text-center py-3 rounded-xl text-lg font-semibold"
        >
          Confirm Location
        </Text>
      </View>
    </View>
  );
}
