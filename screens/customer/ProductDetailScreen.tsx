import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";;
import * as FileSystem from "expo-file-system";
import { useCart } from "../../hooks/useCart";
import { getToken } from "../../services/authServices";
import api from "../../services/api";
import { Product } from "../../types";
import BottomNavigation from "../../components/common/BottomNavigation";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailScreen() {


const route = useRoute();
const { SelectedProduct } = route.params;


  const [product, setProduct] = useState<Product | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const savedToken = await getToken();
        setToken(savedToken);
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token || !id) return;
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await api.get(`/products/${SelectedProduct.id}`);
        setProduct(res.data);
      } catch (err: any) {
        console.error(`Error fetching product with ID ${SelectedProduct.id}:`, err);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [token, SelectedProduct.id]);

  useEffect(() => {
    const fetchImage = async () => {
      if (!token || !product?.image) return;
      try {
        const imageUrl = `${api.defaults.baseURL}products/images/${product.image}`;
        const localUri = `${FileSystem.cacheDirectory}${product.image}`;
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (!fileInfo.exists) {
          const { uri } = await FileSystem.downloadAsync(imageUrl, localUri, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "image/*",
            },
          });
          setLocalImageUri(uri);
        } else {
          setLocalImageUri(localUri);
        }
      } catch (err: any) {
        console.error("Error downloading image:", err);
        setLocalImageUri(null);
      } finally {
        setLoadingImage(false);
      }
    };
    fetchImage();
  }, [token, product?.image]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_name: product.image,
    });
    Alert.alert(`${product.name} added to cart!`);
  };

  if (loadingProduct) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-800">Product not found.</Text>
        <TouchableOpacity onPress={() => route.back()} className="mt-4">
          <Text className="text-green-700 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      
        <ScrollView className="space-y-4">
          {loadingImage ? (
            <ActivityIndicator size="large" color="#ebf0ebff" />
          ) : localImageUri ? (
            <Image
              source={{ uri: localImageUri }}
              className="w-full h-72 rounded-2xl object-cover"
            />
          ) : (
            <View className="h-72 justify-center items-center bg-gray-200 rounded-2xl">
              <Text className="text-gray-500">Image not available</Text>
            </View>
          )}

          <View className="bg-white p-5 rounded-2xl shadow-md space-y-2">
            <Text className="text-xl font-bold text-green-800">{product.name}</Text>
            <Text className="text-lg text-gray-700">
              R{Number(product.price).toFixed(2)} / {product.unit}
            </Text>
            {product.discount && (
              <Text className="text-sm text-red-500 font-semibold">
                {Number(product.discount) * 100}% OFF
              </Text>
            )}
            <Text className="text-sm text-gray-700">{product.description}</Text>
            <Text className="text-sm text-gray-500 italic">
              Category: {product.category_name}
            </Text>

            <TouchableOpacity
              className="bg-green-600 p-3 rounded-xl items-center mt-4"
              onPress={handleAddToCart}
            >
              <Text className="text-white font-semibold text-base">🛒 Add to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 items-center"
              onPress={() => route.back()}
            >
              <Text className="text-green-700 font-semibold">Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Nav */}
        <BottomNavigation />
      
    </SafeAreaView>
  );
}
