import { useState, useEffect } from 'react';
import { AlertItem } from '@/types';
import { mockAlerts } from '@/data/mockData';

const ALERTS_KEY = 'trend_alerts';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(ALERTS_KEY);
    if (saved) {
      setAlerts(JSON.parse(saved));
    } else {
      setAlerts(mockAlerts);
      localStorage.setItem(ALERTS_KEY, JSON.stringify(mockAlerts));
    }
  }, []);

  const addAlert = (trendId: string, title: string, threshold: number, currentValue: number) => {
    const newAlert: AlertItem = {
      id: Date.now().toString(),
      trendId,
      title,
      threshold,
      currentValue,
      isActive: true,
      createdAt: new Date().toLocaleString()
    };
    setAlerts(prev => {
      const updated = [...prev, newAlert];
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => {
      const updated = prev.map(a => 
        a.id === id ? { ...a, isActive: !a.isActive } : a
      );
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => {
      const updated = prev.filter(a => a.id !== id);
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    alerts,
    addAlert,
    toggleAlert,
    removeAlert
  };
};