import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { CategoryType, categoryMap } from '@/types';
import { platforms, regions } from '@/data/mockData';
import styles from './index.module.scss';

interface FilterBarProps {
  category: CategoryType;
  platform: string;
  region: string;
  onCategoryChange: (category: CategoryType) => void;
  onPlatformChange: (platform: string) => void;
  onRegionChange: (region: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  category,
  platform,
  region,
  onCategoryChange,
  onPlatformChange,
  onRegionChange
}) => {
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [showRegions, setShowRegions] = useState(false);

  const categories: CategoryType[] = ['all', 'movie', 'drama', 'variety', 'artist', 'game'];

  return (
    <View className={styles.filterContainer}>
      <ScrollView className={styles.categoryScroll} scrollX enableFlex>
        <View className={styles.categoryList}>
          {categories.map(cat => (
            <Text
              key={cat}
              className={`${styles.categoryItem} ${category === cat ? styles.active : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {categoryMap[cat]}
            </Text>
          ))}
        </View>
      </ScrollView>
      
      <View className={styles.filterRow}>
        <View className={styles.filterItem} onClick={() => setShowPlatforms(!showPlatforms)}>
          <Text className={styles.filterLabel}>平台</Text>
          <Text className={styles.filterValue}>{platform || '全部'}</Text>
          <Text className={styles.filterArrow}>{showPlatforms ? '▲' : '▼'}</Text>
        </View>
        
        <View className={styles.filterItem} onClick={() => setShowRegions(!showRegions)}>
          <Text className={styles.filterLabel}>地域</Text>
          <Text className={styles.filterValue}>{region || '全部'}</Text>
          <Text className={styles.filterArrow}>{showRegions ? '▲' : '▼'}</Text>
        </View>
      </View>
      
      {showPlatforms && (
        <View className={styles.dropdown}>
          {platforms.map(p => (
            <Text
              key={p}
              className={`${styles.dropdownItem} ${platform === p ? styles.active : ''}`}
              onClick={() => {
                onPlatformChange(p);
                setShowPlatforms(false);
              }}
            >
              {p}
            </Text>
          ))}
        </View>
      )}
      
      {showRegions && (
        <View className={styles.dropdown}>
          {regions.map(r => (
            <Text
              key={r}
              className={`${styles.dropdownItem} ${region === r ? styles.active : ''}`}
              onClick={() => {
                onRegionChange(r);
                setShowRegions(false);
              }}
            >
              {r}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default FilterBar;