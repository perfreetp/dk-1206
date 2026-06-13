import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { TrendItem } from '@/types';
import styles from './index.module.scss';

interface TrendCardProps {
  item: TrendItem;
  onClick: () => void;
}

const TrendCard: React.FC<TrendCardProps> = ({ item, onClick }) => {
  const formatHeat = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  const formatDiscussions = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.rankWrap}>
        <Text className={`${styles.rank} ${item.rank <= 3 ? styles.topRank : ''}`}>
          {item.rank}
        </Text>
        {item.trend === 'up' && (
          <View className={styles.trendIconUp}>
            <Text className={styles.trendText}>↑</Text>
          </View>
        )}
        {item.trend === 'down' && (
          <View className={styles.trendIconDown}>
            <Text className={styles.trendText}>↓</Text>
          </View>
        )}
      </View>
      
      <Image className={styles.cover} src={item.coverUrl} mode="aspectFill" />
      
      <View className={styles.content}>
        <Text className={styles.title}>{item.title}</Text>
        
        <View className={styles.tags}>
          {item.tags.slice(0, 2).map((tag, index) => (
            <Text key={index} className={styles.tag}>{tag}</Text>
          ))}
        </View>
        
        <View className={styles.info}>
          <View className={styles.heat}>
            <Text className={styles.heatLabel}>热度</Text>
            <Text className={styles.heatValue}>{formatHeat(item.heat)}</Text>
          </View>
          <View className={`${styles.change} ${item.trend === 'up' ? styles.up : item.trend === 'down' ? styles.down : ''}`}>
            <Text>{item.trend === 'up' ? '+' : ''}{item.heatChangePercent.toFixed(1)}%</Text>
          </View>
        </View>
        
        <Text className={styles.discussions}>
          {formatDiscussions(item.discussions)} 讨论
        </Text>
        
        {item.reason && (
          <View className={styles.reason}>
            <Text className={styles.reasonIcon}>💡</Text>
            <Text className={styles.reasonText}>{item.reason}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TrendCard;