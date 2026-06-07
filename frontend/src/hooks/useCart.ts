import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../api/cartApi";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";

export function useCart() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const { items: localItems, setItems, isOpen, setIsOpen, clearCart: clearLocalCart } = useCartStore();

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    enabled: !!token,
  });

  useEffect(() => {
    if (cartData?.status === "OK" && cartData?.data) {
      setItems(cartData.data.items || []);
    }
  }, [cartData, setItems]);

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.addToCart(productId, quantity),
    onSuccess: (res) => {
      if (res.status === "OK" && res.data) {
        setItems(res.data.items || []);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    }
  });

  const removeCartItemMutation = useMutation({
    mutationFn: (itemId: string) => cartApi.deleteCartItem(itemId),
    onSuccess: (res) => {
      if (res.status === "OK" && res.data) {
        setItems(res.data.items || []);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: (res) => {
      if (res.status === "OK") {
        clearLocalCart();
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    }
  });

  const totalAmount = localItems.reduce((acc, item) => {
    const price = item.product.discountPrice !== undefined ? item.product.discountPrice : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const itemCount = localItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    items: localItems,
    isLoading,
    isOpen,
    setIsOpen,
    itemCount,
    totalAmount,
    addToCart: addToCartMutation.mutateAsync,
    isAdding: addToCartMutation.isPending,
    removeFromCart: removeCartItemMutation.mutateAsync,
    isRemoving: removeCartItemMutation.isPending,
    clearCart: clearCartMutation.mutateAsync,
    isClearing: clearCartMutation.isPending,
  };
}
export default useCart;
