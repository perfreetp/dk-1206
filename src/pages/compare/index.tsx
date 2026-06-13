import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { mockTrends } from '@/data/mockData';
import { CategoryType, categoryMap } from '@/types';
import HeatChart from '@/components/HeatChart';
import { useBlocked } from '@/hooks/useBlocked';
import styles from './index.module.scss';

const ComparePage: React.FC = () => {
  const [category, setCategory] = useState<CategoryType>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { blockedIds } = useBlocked();

  const categories: CategoryType[] = ['all', 'movie', 'drama', 'variety', 'artist', 'game'];

  const filteredItems = useMemo(() => {
    return mockTrends.filter(item => {
      const categoryMatch = category === 'all' || item.category === category;
      const notBlocked = !blockedIds.includes(item.id);
      return categoryMatch && notBlocked;
    });
  }, [category, blockedIds]);

  const selectedItems = useMemo(() => {
    return mockTrends.filter(item => selectedIds.includes(item.id));
  }, [selectedIds]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const formatHeat = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  const getMaxHeat = () => {
    return Math.max(...selectedItems.map(item => item.heat), 1);
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>对比分析</Text>
        <Text className={styles.subtitle}>最多选择3个话题进行对比</Text>
      </View>

      <View className={styles.selectContainer}>
        <Text className={styles.selectTitle}>选择分类</Text>
        <View className={styles.selectGrid}>
          {categories.map(cat => (
            <Text
              key={cat}
              className={`${styles.selectItem} ${category === cat ? styles.selected : ''}`}
              onClick={() => {
                setCategory(cat);
                setSelectedIds([]);
              }}
            >
              <Text className={styles.selectItemText}>{categoryMap[cat]}</Text>
            </Text>
          ))}
        </View>
      </View>

      <View className={styles.selectContainer}>
        <Text className={styles.selectTitle}>选择话题（已选{selectedIds.length}/3）</Text>
        <View className={styles.selectGrid}>
          {filteredItems.map(item => (
            <Text
              key={item.id}
              className={`${styles.selectItem} ${selectedIds.includes(item.id) ? styles.selected : ''}`}
              onClick={() => toggleSelect(item.id)}
            >
              <Text className={styles.selectItemText}>{item.title}</Text>
            </Text>
          ))}
        </View>
        {filteredItems.length === 0 && (
          <Text className={styles.emptyText}>当前分类下暂无可选话题</Text>
        )}
      </View>

      {selectedItems.length >= 2 ? (
        <>
          <View className={styles.compareCard}>
            <Text className={styles.compareTitle}>数据对比</Text>
            <View className={styles.compareItem}>
              <Text className={styles.compareLabel}>热度值</Text>
              <View style={{ display: 'flex', gap: 32 }}>
                {selectedItems.map(item => (
                  <Text key={item.id} className={styles.compareValue}>
                    {formatHeat(item.heat)}
                  </Text>
                ))}
              </View>
            </View>
            <View className={styles.compareItem}>
              <Text className={styles.compareLabel}>热度变化</Text>
              <View style={{ display: 'flex', gap: 32 }}>
                {selectedItems.map(item => (
                  <Text key={item.id} className={`${styles.compareValue} ${item.trend === 'up' ? 'color-trending-up' : item.trend === 'down' ? 'color-trending-down' : ''}`}>
                    {item.trend === 'up' ? '+' : ''}{item.heatChangePercent.toFixed(1)}%
                  </Text>
                ))}
              </View>
            </View>
            <View className={styles.compareItem}>
              <Text className={styles.compareLabel}>讨论量</Text>
              <View style={{ display: 'flex', gap: 32 }}>
                {selectedItems.map(item => (
                  <Text key={item.id} className={styles.compareValue}>
                    {formatHeat(item.discussions)}
                  </Text>
                ))}
              </View>
            </View>
            <View className={styles.compareItem}>
              <Text className={styles.compareLabel}>排名</Text>
              <View style={{ display: 'flex', gap: 32 }}>
                {selectedItems.map(item => (
                  <Text key={item.id} className={styles.compareValue}>
                    第{item.rank}名
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View className={styles.compareChart}>
            <Text className={styles.compareTitle}>热度趋势对比</Text>
            {selectedItems[0] && (
              <HeatChart data={[{ time: '00:00', value: selectedItems[0].heat }, { time: '12:00', value: selectedItems[0].heat * 1.1 }, { time: '24:00', value: selectedItems[0].heat }]} />
            )}
          </View>
        </>
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>📊</Text>
          <Text className={styles.emptyText}>请选择至少2个话题进行对比</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default ComparePage;