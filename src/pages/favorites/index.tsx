import React from 'react';
import { View, Text, ScrollView, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useFavorites } from '@/hooks/useFavorites';
import styles from './index.module.scss';

const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites();

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

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>我的收藏</Text>
        <Text className={styles.subtitle}>关注你感兴趣的话题</Text>
      </View>

      <Text className={styles.count}>共 {favorites.length} 个收藏</Text>

      {favorites.length > 0 ? (
        favorites.map(item => (
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
    </ScrollView>
  );
};

export default FavoritesPage;