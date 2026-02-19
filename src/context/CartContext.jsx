import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import cartService from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  // Load cart from localStorage (for guests) or backend (for authenticated users)
  const loadCart = useCallback(async () => {
    if (isAuthenticated()) {
      // Fetch from backend
      setIsLoading(true);
      setError(null);
      try {
        // First get local cart for price reference (backend might not return prices)
        const savedCart = localStorage.getItem('artCart');
        const localCart = savedCart ? JSON.parse(savedCart) : [];

        const result = await cartService.getCart();
        console.log('Cart API Response:', result); // Debug log

        if (result.success && result.data) {
          // Handle both direct items array and nested items property
          const rawItems = result.data.items || result.data.cartItems || (Array.isArray(result.data) ? result.data : []);

          // Transform backend cart to frontend format
          const items = rawItems.map(item => {
            console.log('Cart Item from backend:', item); // Debug log each item

            // Robust ID and Type extraction
            // Backend: item.id = cart item ID (unique per cart entry), item.itemId = product ID
            const productId = item.itemId || item.productId || item.id;
            const cartItemId = item.id; // This is the unique cart item ID for updates/deletes
            const variantId = item.itemVariantId || item.variantId;
            const itemType = item.itemType || item.productType;
            
            // Create a unique frontend ID that includes variant to distinguish variants
            // Use cartItemId as primary unique identifier since backend guarantees uniqueness
            const uniqueId = cartItemId || (variantId ? `${productId}-${variantId}` : productId);

            // Find matching local item to get price if backend doesn't have it
            const localItem = localCart.find(li =>
              String(li.id) === String(uniqueId) ||
              String(li.cartItemId) === String(cartItemId)
            );

            // Get price from backend first (unitPrice is the correct field from backend)
            const backendPrice = item.unitPrice || item.price || item.itemPrice || item.productPrice || 0;
            const finalPrice = backendPrice > 0 ? backendPrice : (localItem?.price || 0);

            return {
              id: uniqueId, // Use unique ID (cartItemId or product-variant combo)
              cartItemId: cartItemId, // Backend cart item ID for updates/deletes
              productId: productId, // Original product ID (for reference)
              variantId: variantId, // Variant ID if applicable
              name: item.itemName || item.productName || item.name || item.title || localItem?.name || 'Unknown Item',
              price: finalPrice,
              quantity: item.quantity || 1,
              image: item.imageUrl || item.image || item.productImage || localItem?.image || '',
              type: (itemType === 'ART_WORK' || itemType === 'ARTWORK') ? 'artwork' : 'material',
              productType: itemType, // Keep original for API calls
              artist: item.artist || item.artistName || localItem?.artist || '',
              brand: item.brand || item.brandName || localItem?.brand || '',
              size: item.itemVariantName || item.variantName || item.size || localItem?.size || '',
            };
          });

          setCartItems(items);
          // Also save to localStorage as backup
          localStorage.setItem('artCart', JSON.stringify(items));
        } else {
          // If backend fails, fallback to localStorage
          if (localCart.length > 0) {
            setCartItems(localCart);
          }
        }

      } catch (err) {
        console.error('Error loading cart:', err);
        // Fallback to localStorage

        const savedCart = localStorage.getItem('artCart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Load from localStorage for guests
      const savedCart = localStorage.getItem('artCart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    }
  }, [isAuthenticated]);

  // Load cart on mount and when auth changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Update totals when cart changes
  useEffect(() => {
    // Always save to localStorage as backup
    localStorage.setItem('artCart', JSON.stringify(cartItems));
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    setCartTotal(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
  }, [cartItems]);

  const addToCart = useCallback(async (product) => {
    setError(null);
    console.log('addToCart called with:', product); // Debug

    // Extract the real product ID (remove any suffix like "-default")
    const realProductId = product.productId || (product.id ? String(product.id).split('-')[0] : product.id);

    // Determine product type for backend (Backend Enum: ARTWORK, MATERIAL)
    let productType = product.productType || (product.type === 'artwork' ? 'ARTWORK' : 'MATERIAL');

    // Normalize legacy frontend types to backend enum
    if (productType === 'ART_WORK') productType = 'ARTWORK';
    if (productType === 'ART_MATERIAL') productType = 'MATERIAL';

    // ARTWORK UNIQUENESS: Artworks are unique pieces - only quantity of 1 allowed
    // Check if this artwork is already in cart
    const isArtwork = productType === 'ARTWORK';
    if (isArtwork) {
      const existingArtwork = cartItems.find(item => 
        String(item.productId || item.id).split('-')[0] === String(realProductId) &&
        (item.type === 'artwork' || item.productType === 'ARTWORK')
      );
      if (existingArtwork) {
        setError('This artwork is already in your cart. Artworks are unique pieces.');
        return; // Don't add duplicate artwork
      }
    }

    // Get variant ID for materials (required by backend)
    const variantId = product.variantId || null;

    // Store product price for later use (backend may not return price)
    const productPrice = product.price || 0;

    // For artworks, always set quantity to 1 (unique pieces)
    const quantity = isArtwork ? 1 : (product.quantity || 1);

    // Sync with backend FIRST if authenticated
    if (isAuthenticated()) {
      try {
        // Pass variant ID to cart service (4th parameter)
        const result = await cartService.addItem(realProductId, productType, quantity, variantId);
        console.log('Add to cart API result:', result); // Debug

        if (result.success && result.data) {
          // Backend returned updated cart - use it but merge with local prices
          const savedCart = localStorage.getItem('artCart');
          const localCart = savedCart ? JSON.parse(savedCart) : [];

          // Map backend items but preserve local prices
          const rawItems = result.data.items || result.data.cartItems || [];
          const items = rawItems.map(item => {
            // Robust ID and Type extraction
            const productId = item.itemId || item.productId;
            const cartItemId = item.id; // Backend's unique cart item ID
            const itemVariantId = item.itemVariantId || item.variantId;
            const itemType = item.productType || item.itemType;
            
            // Create unique frontend ID - use cartItemId as it's unique per cart entry
            const uniqueId = cartItemId || (itemVariantId ? `${productId}-${itemVariantId}` : productId);

            // Find matching local item using unique ID or cartItemId
            const localItem = localCart.find(li =>
              String(li.id) === String(uniqueId) ||
              String(li.cartItemId) === String(cartItemId)
            );

            // Match found?
            const isMatch = !!localItem;

            // Use backend price if available, otherwise local or the product price we just added
            const backendPrice = item.price || item.unitPrice || 0;
            let finalPrice = backendPrice > 0 ? backendPrice : (isMatch ? localItem?.price : 0);

            // If this is the item we just added and price is still 0, use the product price
            if (finalPrice <= 0 && String(productId) === String(realProductId)) {
              finalPrice = productPrice;
            }

            // Start of Price Logic Debug
            const source = backendPrice > 0 ? 'BACKEND' : 'FRONTEND_FALLBACK';
            console.log(`💰 Price Check [${item.name}]: Backend=${backendPrice}, Local=${isMatch ? localItem?.price : 'N/A'}, Final=${finalPrice} (${source})`);
            // End of Price Logic Debug

            return {
              id: uniqueId, // Use unique ID (cartItemId or product-variant combo)
              cartItemId: cartItemId, // Backend cart item ID for updates/deletes
              productId: productId, // Original product ID
              variantId: itemVariantId, // Variant ID if applicable
              name: item.productName || item.name || item.itemName || localItem?.name || product.name || 'Unknown Item',
              price: finalPrice || 0,
              quantity: item.quantity || 1,
              image: item.imageUrl || item.image || localItem?.image || product.image || '',
              type: (itemType === 'ART_WORK' || itemType === 'ARTWORK') ? 'artwork' : 'material',
              productType: itemType,
              artist: item.artist || localItem?.artist || '',
              brand: item.brand || localItem?.brand || '',
              size: item.itemVariantName || item.variantName || localItem?.size || '',
            };
          });


          console.log('Updated cart items from backend:', items); // Debug

          // CRITICAL FIX: Merge backend items with local items instead of replacing
          // This handles cases where backend returns only the added item or fails to persist previous items
          setCartItems(prevItems => {
            const merged = [...prevItems];

            items.forEach(newItem => {
              // Check if item exists (by Product ID or Variant ID)
              const existingIndex = merged.findIndex(existing =>
                String(existing.id) === String(newItem.id) ||
                (existing.cartItemId && String(existing.cartItemId) === String(newItem.cartItemId))
              );

              if (existingIndex >= 0) {
                // Update existing item info from backend (e.g. real ID) but preserve local price if verified
                merged[existingIndex] = { ...merged[existingIndex], ...newItem };
              } else {
                // Add new item
                merged.push(newItem);
              }
            });

            // Persist to local storage immediately
            localStorage.setItem('artCart', JSON.stringify(merged));
            return merged;
          });

          return; // Successfully synced with backend
        } else {
          console.error('Failed to add to cart:', result.error);
          // Still add locally as fallback
        }
      } catch (err) {
        console.error('Error adding to cart:', err);
        // Still add locally as fallback
      }
    }

    // Fallback: Update local state only (for guests or if backend failed)
    setCartItems(prevItems => {
      // Create unique ID for this item (include variant if present)
      const uniqueId = variantId ? `${realProductId}-${variantId}` : realProductId;
      
      // Find existing item by exact unique ID
      const existingItem = prevItems.find(item => String(item.id) === String(uniqueId));
      
      if (existingItem) {
        // For artworks: Don't update quantity, they're unique pieces
        if (isArtwork) {
          return prevItems; // Already in cart, don't add again
        }
        // For materials: Update quantity of existing item
        return prevItems.map(item => 
          String(item.id) === String(uniqueId)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // Add new item with all product data including price and variant info
      const newItem = {
        id: uniqueId, // Use unique ID that includes variant
        productId: realProductId,
        variantId: variantId,  // Store variant ID for materials
        name: product.name || product.title,
        price: product.price || 0,
        quantity: quantity, // Use enforced quantity (1 for artworks)
        image: product.image,
        type: product.type,
        productType: productType,
        artist: product.artist,
        brand: product.brand,
        size: product.size,
      };
      console.log('Adding new item to cart (local fallback):', newItem); // Debug
      return [...prevItems, newItem];
    });
  }, [isAuthenticated, cartItems]);


  const removeFromCart = useCallback(async (itemId) => {
    setError(null);

    // Find the exact cart item by full ID (including variant suffix)
    // This ensures we only remove the specific variant, not all variants of same product
    const item = cartItems.find(item => String(item.id) === String(itemId));

    if (!item) {
      console.warn('Item not found in cart:', itemId);
      return;
    }

    // Optimistic update - use exact match to remove only the specific item/variant
    setCartItems(prevItems => prevItems.filter(cartItem => 
      String(cartItem.id) !== String(itemId)
    ));

    // Sync with backend if authenticated
    if (isAuthenticated() && item?.cartItemId) {
      try {
        const result = await cartService.removeItem(item.cartItemId);

        if (!result.success) {
          console.error('Failed to remove from cart:', result.error);
          setError(result.error);
          // Reload cart on error to restore state
          loadCart();
        }
      } catch (err) {
        console.error('Error removing from cart:', err);
        loadCart();
      }
    }
  }, [isAuthenticated, cartItems, loadCart]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    setError(null);

    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    // Find the exact cart item by full ID
    const item = cartItems.find(item => String(item.id) === String(itemId));

    if (!item) {
      console.warn('Item not found in cart:', itemId);
      return;
    }

    // ARTWORK UNIQUENESS: Don't allow quantity changes for artworks
    const isArtwork = item.type === 'artwork' || item.productType === 'ARTWORK';
    if (isArtwork) {
      console.warn('Cannot update quantity for artworks - they are unique pieces');
      return;
    }

    // Optimistic update - use exact match to update only the specific item/variant
    setCartItems(prevItems =>
      prevItems.map(cartItem => 
        String(cartItem.id) === String(itemId) ? { ...cartItem, quantity } : cartItem
      )
    );

    // Sync with backend if authenticated
    if (isAuthenticated() && item?.cartItemId) {
      try {
        const result = await cartService.updateItemQuantity(item.cartItemId, quantity);

        if (!result.success) {
          console.error('Failed to update quantity:', result.error);
          setError(result.error);
          // Reload cart on error to restore state
          loadCart();
        }
      } catch (err) {
        console.error('Error updating quantity:', err);
        loadCart();
      }
    }
  }, [isAuthenticated, cartItems, removeFromCart, loadCart]);

  const clearCart = useCallback(async () => {
    setError(null);

    // Optimistic update
    setCartItems([]);

    // Sync with backend if authenticated
    if (isAuthenticated()) {
      try {
        const result = await cartService.clearCart();

        if (!result.success) {
          console.error('Failed to clear cart:', result.error);
          setError(result.error);
          // Reload cart on error to restore state
          loadCart();
        }
      } catch (err) {
        console.error('Error clearing cart:', err);
        loadCart();
      }
    }
  }, [isAuthenticated, loadCart]);

  const getItemQuantity = useCallback((itemId, variantId = null) => {
    // If variantId is provided, look for exact product+variant combination
    if (variantId) {
      const fullId = `${itemId}-${variantId}`;
      const item = cartItems.find(item => String(item.id) === fullId);
      return item ? item.quantity : 0;
    }
    
    // Check for exact match first (for items without variants)
    const exactMatch = cartItems.find(item => String(item.id) === String(itemId));
    if (exactMatch) {
      return exactMatch.quantity;
    }
    
    // Fallback: sum all variants of this product (useful for showing total count badges)
    const matchingItems = cartItems.filter(item => {
      const itemRealId = String(item.id).split('-')[0];
      return itemRealId === String(itemId).split('-')[0];
    });
    return matchingItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Refresh cart from backend
  const refreshCart = useCallback(() => {
    loadCart();
  }, [loadCart]);

  const value = useMemo(() => ({
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    refreshCart,
  }), [cartItems, cartCount, cartTotal, isLoading, error, addToCart, removeFromCart, updateQuantity, clearCart, getItemQuantity, refreshCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
