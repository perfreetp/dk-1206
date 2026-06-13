import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockTrends } from '@/data/mockData';
import { CategoryType } from '@/types';
import TrendCard from '@/components/TrendCard';
import FilterBar from '@/components/FilterBar';
import styles from './index.module.scss';

const BLOCKED_KEY = 'blocked_trends';

const TrendsPage: React.FC = () => {
  const [category, setCategory] = useState<CategoryType>('all');
  const [platform, setPlatform] = useState('全部');
  const [region, setRegion] = useState('全部');
  const [tab, setTab] = useState<'hot' | 'rising'>('hot');
  const [showReport, setShowReport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(BLOCKED_KEY);
    if (saved) {
      setBlockedIds(JSON.parse(saved));
    }
  }, []);

  const filteredTrends = useMemo(() => {
    let result = mockTrends.filter(item => {
      const categoryMatch = category === 'all' || item.category === category;
      const platformMatch = platform === '全部' || item.platform === platform;
      const regionMatch = region === '全部' || item.region === region;
      const notBlocked = !blockedIds.includes(item.id);
      return categoryMatch && platformMatch && regionMatch && notBlocked;
    });
    
    if (tab === 'hot') {
      result.sort((a, b) => b.heat - a.heat);
    } else {
      result.sort((a, b) => b.heatChangePercent - a.heatChangePercent);
    }
    
    return result.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [category, platform, region, tab, blockedIds]);

  const handleItemClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  };

  const handleShare = () => {
    setShowShare(true);
  };

  const handleReport = () => {
    setShowReport(true);
  };

  const handleBlock = (id: string) => {
    const updated = [...blockedIds, id];
    setBlockedIds(updated);
    localStorage.setItem(BLOCKED_KEY, JSON.stringify(updated));
    Taro.showToast({
      title: '已屏蔽该话题',
      icon: 'success'
    });
  };

  const generateReport = () => {
    const hotList = [...mockTrends].sort((a, b) => b.heat - a.heat).slice(0, 5);
    const risingList = [...mockTrends].sort((a, b) => b.heatChangePercent - a.heatChangePercent).slice(0, 3);
    
    return {
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
      hot: hotList,
      rising: risingList,
      summary: `${hotList[0]?.title || '暂无'}以${(hotList[0]?.heat || 0) / 10000}万热度占据榜首，${risingList[0]?.title || '暂无'}涨幅最高，达${risingList[0]?.heatChangePercent || 0}%`
    };
  };

  const report = generateReport();

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
          <View key={item.id}>
            <TrendCard
              item={item}
              onClick={() => handleItemClick(item.id)}
            />
            <View className={styles.blockBtnWrap}>
              <Button className={styles.blockBtn} onClick={() => handleBlock(item.id)}>
                <Text className={styles.blockBtnText}>🙅 屏蔽</Text>
              </Button>
            </View>
          </View>
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

      {showReport && (
        <View className={styles.modal} onClick={() => setShowReport(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>📊 每日简报</Text>
              <Text className={styles.modalDate}>{report.date}</Text>
            </View>
            
            <View className={styles.reportSection}>
              <Text className={styles.reportSectionTitle}>🏆 热门TOP5</Text>
              <View className={styles.reportList}>
                {report.hot.map((item, index) => (
                  <View key={item.id} className={styles.reportItem}>
                    <Text className={`${styles.reportRank} ${index < 3 ? styles.topRank : ''}`}>
                      {index + 1}
                    </Text>
                    <Text className={styles.reportTitle}>{item.title}</Text>
                    <Text className={styles.reportHeat}>{(item.heat / 10000).toFixed(1)}万</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.reportSection}>
              <Text className={styles.reportSectionTitle}>📈 上升最快</Text>
              <View className={styles.reportList}>
                {report.rising.map((item, index) => (
                  <View key={item.id} className={styles.reportItem}>
                    <Text className={styles.reportRank}>{index + 1}</Text>
                    <Text className={styles.reportTitle}>{item.title}</Text>
                    <Text className={styles.reportRising}>+{item.heatChangePercent}%</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.reportSummary}>
              <Text className={styles.reportSummaryText}>{report.summary}</Text>
            </View>

            <Button className={styles.modalCloseBtn} onClick={() => setShowReport(false)}>
              <Text>关闭</Text>
            </Button>
          </View>
        </View>
      )}

      {showShare && (
        <View className={styles.modal} onClick={() => setShowShare(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>📤 分享榜单</Text>
            </View>
            
            <View className={styles.sharePreview}>
              <Text className={styles.shareTitle}>娱乐趋势榜</Text>
              <Text className={styles.shareSubtitle}>{tab === 'hot' ? '热门榜' : '上升榜'}</Text>
              <View className={styles.shareList}>
                {filteredTrends.slice(0, 5).map((item, index) => (
                  <View key={item.id} className={styles.shareItem}>
                    <Text className={styles.shareRank}>{index + 1}</Text>
                    <Text className={styles.shareItemTitle}>{item.title}</Text>
                  </View>
                ))}
              </View>
              <Text className={styles.shareFooter}>数据更新于 {new Date().toLocaleString()}</Text>
            </View>

            <View className={styles.shareButtons}>
              <Button className={styles.shareBtn} onClick={() => {
                Taro.showToast({ title: '已复制到剪贴板', icon: 'success' });
                setShowShare(false);
              }}>
                <Text>📋 复制链接</Text>
              </Button>
              <Button className={styles.shareBtn} onClick={() => {
                Taro.showToast({ title: '生成图片中...', icon: 'loading' });
                setTimeout(() => {
                  Taro.showToast({ title: '图片已保存', icon: 'success' });
                  setShowShare(false);
                }, 1500);
              }}>
                <Text>🖼️ 保存图片</Text>
              </Button>
            </View>

            <Button className={styles.modalCloseBtn} onClick={() => setShowShare(false)}>
              <Text>关闭</Text>
            </Button>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default TrendsPage;