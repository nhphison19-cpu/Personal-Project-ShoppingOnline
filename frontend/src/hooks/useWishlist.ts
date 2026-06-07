import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "../api/wishlistApi";
import { useWishlistStore } from "../stores/wishlistStore";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";

export function useWishlist() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const { items: localItems, setItems } = useWishlistStore();

  const { data: wishlistData, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getWishlist,
    enabled: !!token,
  });

  useEffect(() => {
    if (wishlistData?.status === "OK" && wishlistData?.data) {
      setItems(wishlistData.data);
    }
  }, [wishlistData, setItems]);

  const toggleWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const inWishlist = localItems.some((item) => item.productId === productId);
      if (inWishlist) {
        const match = localItems.find((item) => item.productId === productId);
        return wishlistApi.deleteFromWishlist(match ? match.id : productId);
      } else {
        return wishlistApi.addToWishlist(productId);
      }
    },
    onSuccess: (res) => {
      if (res.status === "OK" && res.data) {
        setItems(res.data);
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      }
    }
  });

  const checkInWishlist = (productId: string) => {
    return localItems.some((item) => item.productId === productId);
  };

  return {
    items: localItems,
    isLoading,
    toggleWishlist: toggleWishlistMutation.mutate,
    isToggling: toggleWishlistMutation.isPending,
    checkInWishlist,
  };
}
export default useWishlist;
