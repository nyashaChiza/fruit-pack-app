import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from "expo-file-system";
import { useCart } from "../../hooks/useCart";
import { getToken } from "../../services/authServices";
import api from "../../services/api";
import { Product } from "../../types";
import BottomNavigation from "../../components/common/BottomNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToast } from "services/toastService";

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { SelectedProduct } = route.params as { SelectedProduct: Product };

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
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
        showToast("error",'Error','Error fetching token');
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
        setRelatedProducts(res.data.related_products || []);
      } catch (err: any) {
        showToast("error",'Error',`Error fetching product with ID ${SelectedProduct.id}`);

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
        showToast("error",'Error','Error downloading image');
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
    showToast('success', 'Added to Cart', `${product.name} has been added to your cart.`);
  };

  const handleSelectRelatedProduct = (item: Product) => {
    navigation.navigate("ProductDetail", { SelectedProduct: item });
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
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4">
          <Text className="text-green-700 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <ScrollView className="space-y-4">
        {/* Product Image */}
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

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <View className="px-4 py-4 mb-4">
            <Text className="text-lg font-bold text-green-800 mb-2">Related Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedProducts.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectRelatedProduct(item)}
                  className="mr-3 w-36 bg-white rounded-xl shadow-sm"
                >
                  <Image
                    source={{ uri: `${api.defaults.baseURL}products/images/${item.image}` }}
                    className="h-24 w-full rounded-t-xl"
                    resizeMode="cover"
                  />
                  <View className="p-2 space-y-1">
                    <Text className="text-sm font-medium text-gray-700" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text className="text-sm text-green-700 font-bold">
                      R{Number(item.price).toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Product Details Fixed Card */}
      <View className="absolute bottom-40 left-4 right-4">
        <View className="bg-white p-5 rounded-2xl shadow-md space-y-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-green-800">{product.name}</Text>
            <MaterialIcons name="local-grocery-store" size={22} color="green" />
          </View>

          <Text className="text-lg text-gray-700 flex-row items-center">
            <Feather name="tag" size={16} color="gray" /> R{Number(product.price).toFixed(2)} / {product.unit}
          </Text>

          {product.discount && (
            <Text className="text-sm text-red-500 font-semibold flex-row items-center">
              <MaterialIcons name="discount" size={16} color="red" /> {Number(product.discount) * 100}% OFF
            </Text>
          )}

          <Text className="text-sm text-gray-700">
            <Feather name="info" size={14} color="gray" /> {product.description}
          </Text>

          <Text className="text-sm text-gray-500 italic flex-row items-center">
            <Feather name="tag" size={14} color="gray" /> Category: {product.category_name}
          </Text>

          <TouchableOpacity
            className="bg-green-600 p-3 rounded-xl items-center mt-4 flex-row justify-center"
            onPress={handleAddToCart}
          >
            <Feather name="shopping-cart" size={18} color="white" style={{ marginRight: 6 }} />
            <Text className="text-white font-semibold text-base">Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomNavigation />
    </SafeAreaView>
  );
}
