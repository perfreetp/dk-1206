import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useFavorites } from '@/hooks/useFavorites';
import { useBlocked } from '@/hooks/useBlocked';
import { mockTrends } from '@/data/mockData';
import styles from './index.module.scss';

const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites();
  const { blockedIds, removeBlocked } = useBlocked();
  const [showBlocked, setShowBlocked] = useState(false);

  const filteredFavorites = favorites.filter(fav => !blockedIds.includes(fav.id));
  
  const blockedItems = mockTrends.filter(item => blockedIds.includes(item.id));

  const formatHeat = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  const handleItemClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    Taro.showModal({
      title: '取消收藏',
      content: '确定要取消收藏吗？',
      success: (res) => {
        if (res.confirm) {
          removeFavorite(id);
          Taro.showToast({
            title: '已取消收藏',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleRestore = (id: string) => {
    Taro.showModal({
      title: '恢复话题',
      content: '确定要恢复该话题吗？',
      success: (res) => {
        if (res.confirm) {
          removeBlocked(id);
          Taro.showToast({
            title: '已恢复',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleClearAllBlocked = () => {
    Taro.showModal({
      title: '清空屏蔽',
      content: '确定要清空所有屏蔽的话题吗？',
      success: (res) => {
        if (res.confirm) {
          blockedIds.forEach(id => removeBlocked(id));
          Taro.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>我的收藏</Text>
        <Text className={styles.subtitle}>关注你感兴趣的话题</Text>
      </View>

      <Text className={styles.count}>共 {filteredFavorites.length} 个收藏</Text>

      {filteredFavorites.length > 0 ? (
        filteredFavorites.map(item => (
          <View 
            key={item.id} 
            className={styles.favoriteCard}
            onClick={() => handleItemClick(item.id)}
          >
            <Image className={styles.cover} src={item.coverUrl} mode="aspectFill" />
            <View className={styles.content}>
              <Text className={styles.titleText}>{item.title}</Text>
              <View className={styles.tags}>
                {item.tags.slice(0, 2).map((tag, index) => (
                  <Text key={index} className={styles.tag}>{tag}</Text>
                ))}
              </View>
              <View className={styles.heat}>
                <Text className={styles.heatLabel}>热度</Text>
                <Text className={styles.heatValue}>{formatHeat(item.heat)}</Text>
              </View>
            </View>
            <Button className={styles.deleteBtn} onClick={(e) => handleDelete(e, item.id)}>
              <Text className={styles.deleteIcon}>×</Text>
            </Button>
          </View>
        ))
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>❤️</Text>
          <Text className={styles.emptyText}>还没有收藏任何话题</Text>
        </View>
      )}

      {blockedIds.length > 0 && (
        <View className={styles.blockedSection}>
          <View className={styles.blockedHeader}>
            <Text className={styles.blockedTitle}>🙅 已屏蔽话题 ({blockedItems.length})</Text>
            <Button className={styles.clearBtn} onClick={handleClearAllBlocked}>
              <Text className={styles.clearBtnText}>清空</Text>
            </Button>
          </View>
          
          <View className={`${styles.blockedList} ${showBlocked ? styles.expanded : ''}`}>
            {blockedItems.map(item => (
              <View key={item.id} className={styles.blockedItem}>
                <Text className={styles.blockedItemTitle}>{item.title}</Text>
                <Button className={styles.restoreBtn} onClick={() => handleRestore(item.id)}>
                  <Text className={styles.restoreBtnText}>恢复</Text>
                </Button>
              </View>
            ))}
          </View>
          
          <Button className={styles.toggleBtn} onClick={() => setShowBlocked(!showBlocked)}>
            <Text className={styles.toggleBtnText}>
              {showBlocked ? '收起' : `查看已屏蔽话题 (${blockedItems.length})`}
            </Text>
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default FavoritesPage;