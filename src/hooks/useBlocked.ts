import { useState, useEffect } from 'react';

const BLOCKED_KEY = 'blocked_trends';

export const useBlocked = () => {
  const [blockedIds, setBlockedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(BLOCKED_KEY);
    if (saved) {
      setBlockedIds(JSON.parse(saved));
    }
  }, []);

  const addBlocked = (id: string) => {
    setBlockedIds(prev => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem(BLOCKED_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeBlocked = (id: string) => {
    setBlockedIds(prev => {
      const updated = prev.filter(b => b !== id);
      localStorage.setItem(BLOCKED_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isBlocked = (id: string) => {
    return blockedIds.includes(id);
  };

  const clearAllBlocked = () => {
    setBlockedIds([]);
    localStorage.removeItem(BLOCKED_KEY);
  };

  return {
    blockedIds,
    addBlocked,
    removeBlocked,
    isBlocked,
    clearAllBlocked
  };
};