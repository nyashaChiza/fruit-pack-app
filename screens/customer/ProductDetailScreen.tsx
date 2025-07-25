import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
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
      if (!token || !SelectedProduct?.id) return;

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
    <SafeAreaView className="flex-1 bg-green-50">
      {/* Scrollable Image */}
      <ScrollView className="space-y-4">
        {loadingImage ? (
          <ActivityIndicator size="large" color="#ebf0ebff" />
        ) : localImageUri ? (
          <Image
            source={{ uri: localImageUri }}
            className="mx-3 my-2 h-72 rounded-2xl object-cover"
          />
        ) : (
          <View className="h-72 justify-center items-center bg-gray-200 rounded-2xl mx-3 my-2">
            <Text className="text-gray-500">Image not available</Text>
          </View>
        )}
      </ScrollView>

      {/* Product Details fixed near bottom */}


      <View className="absolute bottom-40 left-4 right-4">
        <View className="bg-white p-5 rounded-2xl shadow-md space-y-2">
          {/* Product Name */}
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-green-800">{product.name}</Text>
            <MaterialIcons name="local-grocery-store" size={22} color="green" />
          </View>

          {/* Price & Unit */}
          <Text className="text-lg text-gray-700 flex-row items-center">
            <Feather name="tag" size={16} color="gray" /> R{Number(product.price).toFixed(2)} / {product.unit}
          </Text>

          {/* Discount */}
          {product.discount && (
            <Text className="text-sm text-red-500 font-semibold flex-row items-center">
              <MaterialIcons name="discount" size={16} color="red" /> {Number(product.discount) * 100}% OFF
            </Text>
          )}

          {/* Description */}
          <Text className="text-sm text-gray-700">
            <Feather name="info" size={14} color="gray" /> {product.description}
          </Text>

          {/* Category */}
          <Text className="text-sm text-gray-500 italic flex-row items-center">
            <Feather name="tag" size={14} color="gray" /> Category: {product.category_name}
          </Text>

          {/* Add to Cart */}
          <TouchableOpacity
            className="bg-green-600 p-3 rounded-xl items-center mt-4 flex-row justify-center"
            onPress={handleAddToCart}
          >
            <Feather name="shopping-cart" size={18} color="white" style={{ marginRight: 6 }} />
            <Text className="text-white font-semibold text-base">Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Nav */}
      <BottomNavigation />
    </SafeAreaView>

  );
}
