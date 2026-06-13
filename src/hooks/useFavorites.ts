import { useState, useEffect } from 'react';
import { TrendItem } from '@/types';

const FAVORITES_KEY = 'trend_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<TrendItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const addFavorite = (item: TrendItem) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      if (exists) return prev;
      const updated = [...prev, item];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.id !== id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(f => f.id === id);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
};