'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../store/useStore';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import BoutiqueCard from '../ui/BoutiqueCard';
import Modal from '../ui/Modal';
import { ShoppingCart, Sparkles, MapPin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductCard({ product }) {
  const { 
    title, 
    price, 
    actual_price, 
    unit, 
    category, 
    location, 
    images, 
    description,
    rating = 4.9, 
    reviews = 128, 
    tags = ['Hand-woven', 'Pure'] 
  } = product;

  const pathname = usePathname();
  const displayImage = images && images.length > 0 ? images[0] : null;
  const { user, isAdmin, profile } = useAuth();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { wishlist, toggleWishlist, setSelectedProduct } = useStore();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const isInWishlist = wishlist?.some(p => p.id === product.id);
  const cartItem = cart?.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  // 🛡️ ACTION GATE: Only allow buyers to interact with cart/wishlist INSIDE the portal
  const isInsidePortal = pathname?.startsWith('/buyer');
  const isAuthorizedBuyer = user && !isAdmin && (profile?.role === 'customer' || profile?.role === 'buyer') && isInsidePortal;

  const handleView = () => {
    setSelectedProduct(product);
    const targetPath = isInsidePortal ? '/buyer/product-details' : '/product-details';
    router.push(targetPath);
  };

  const handleWishlist = () => {
    if (!isAuthorizedBuyer) {
      toast.error('Please login as a buyer to save items.', { 
        id: 'wishlist-gate',
        style: {
          background: '#1B4332',
          color: '#fff',
          borderRadius: '1rem',
          fontSize: '11px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }
      });
      router.push('/login');
      return;
    }
    toggleWishlist(product, user.id);
    if (!isInWishlist) {
      toast.success('Added to wishlist', { icon: '❤️' });
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthorizedBuyer) {
      toast.error('Please login as a buyer to add to cart.', { 
        id: 'cart-gate',
        style: {
          background: '#1B4332',
          color: '#fff',
          borderRadius: '1rem',
          fontSize: '11px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }
      });
      router.push('/login');
      return;
    }

    setAdding(true);
    setTimeout(() => {
      addToCart(product);
      setAdding(false);
    }, 600);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, -1);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <BoutiqueCard
      title={title}
      subtitle={category}
      price={price}
      originalPrice={actual_price}
      image={displayImage}
      rating={rating}
      badge="Heritage"
      location={location}
      tags={tags}
      unit={unit}
      isWishlisted={isInWishlist}
      isLoading={adding}
      quantity={quantity}
      onAction={handleAddToCart}
      onDecrement={handleDecrement}
      onWishlist={handleWishlist}
      onView={handleView}
      actionIcon={ShoppingCart}
    />
  );
}
