import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockTrends } from '@/data/mockData';
import { CategoryType } from '@/types';
import TrendCard from '@/components/TrendCard';
import FilterBar from '@/components/FilterBar';
import styles from './index.module.scss';

const TrendsPage: React.FC = () => {
  const [category, setCategory] = useState<CategoryType>('all');
  const [platform, setPlatform] = useState('全部');
  const [region, setRegion] = useState('全部');
  const [tab, setTab] = useState<'hot' | 'rising'>('hot');

  const filteredTrends = useMemo(() => {
    return mockTrends.filter(item => {
      const categoryMatch = category === 'all' || item.category === category;
      const platformMatch = platform === '全部' || item.platform === platform;
      const regionMatch = region === '全部' || item.region === region;
      return categoryMatch && platformMatch && regionMatch;
    });
  }, [category, platform, region]);

  const handleItemClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  };

  const handleShare = () => {
    Taro.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  };

  const handleReport = () => {
    Taro.showToast({
      title: '已生成每日简报',
      icon: 'success'
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View>
          <Text className={styles.title}>娱乐趋势</Text>
          <Text className={styles.subtitle}>实时追踪热度变化</Text>
        </View>
        <View className={styles.headerRight}>
          <Button className={styles.headerBtn} onClick={handleReport}>
            <Text className={styles.headerBtnText}>📊</Text>
          </Button>
          <Button className={styles.headerBtn} onClick={handleShare}>
            <Text className={styles.headerBtnText}>📤</Text>
          </Button>
        </View>
      </View>

      <View className={styles.tabs}>
        <Text
          className={`${styles.tabItem} ${tab === 'hot' ? styles.active : ''}`}
          onClick={() => setTab('hot')}
        >
          热门榜
        </Text>
        <Text
          className={`${styles.tabItem} ${tab === 'rising' ? styles.active : ''}`}
          onClick={() => setTab('rising')}
        >
          上升榜
        </Text>
      </View>

      <FilterBar
        category={category}
        platform={platform}
        region={region}
        onCategoryChange={setCategory}
        onPlatformChange={setPlatform}
        onRegionChange={setRegion}
      />

      {filteredTrends.length > 0 ? (
        filteredTrends.map(item => (
          <TrendCard
            key={item.id}
            item={item}
            onClick={() => handleItemClick(item.id)}
          />
        ))
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>🔍</Text>
          <Text className={styles.emptyText}>暂无相关数据</Text>
        </View>
      )}

      <Text className={styles.refreshTip}>
        数据更新于 {new Date().toLocaleTimeString()}
      </Text>
    </ScrollView>
  );
};

export default TrendsPage;