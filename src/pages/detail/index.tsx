import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Button, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getTrendDetail } from '@/data/mockData';
import { useFavorites } from '@/hooks/useFavorites';
import { useAlerts } from '@/hooks/useAlerts';
import HeatChart from '@/components/HeatChart';
import styles from './index.module.scss';

const DetailPage: React.FC = () => {
  const [detail, setDetail] = useState<ReturnType<typeof getTrendDetail>>();
  const [notes, setNotes] = useState('');
  const { addFavorite, isFavorite, removeFavorite } = useFavorites();
  const { addAlert } = useAlerts();

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = (currentPage as any).options;
    const id = options?.id || '1';
    
    const data = getTrendDetail(id);
    setDetail(data);
    
    const savedNotes = localStorage.getItem(`notes_${id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const formatHeat = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  const handleFavorite = () => {
    if (!detail) return;
    
    if (isFavorite(detail.id)) {
      removeFavorite(detail.id);
      Taro.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      addFavorite(detail);
      Taro.showToast({ title: '收藏成功', icon: 'success' });
    }
  };

  const handleAlert = () => {
    if (!detail) return;
    
    const threshold = Math.floor(detail.heat * 1.1);
    addAlert(detail.id, detail.title, threshold, detail.heat);
    Taro.showToast({ title: '提醒设置成功', icon: 'success' });
  };

  const handleShare = () => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' });
  };

  const handleBlock = () => {
    Taro.showToast({ title: '已屏蔽该话题', icon: 'success' });
  };

  const handleSaveNotes = () => {
    if (!detail) return;
    localStorage.setItem(`notes_${detail.id}`, notes);
    Taro.showToast({ title: '备注已保存', icon: 'success' });
  };

  if (!detail) {
    return (
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Image className={styles.cover} src={detail.coverUrl} mode="aspectFill" />
        <Text className={styles.title}>{detail.title}</Text>
        <View className={styles.tags}>
          {detail.tags.map((tag, index) => (
            <Text key={index} className={styles.tag}>{tag}</Text>
          ))}
        </View>
      </View>

      <View className={styles.stats}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{formatHeat(detail.heat)}</Text>
          <Text className={styles.statLabel}>热度值</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={`${styles.statValue} ${detail.trend === 'up' ? 'color-trending-up' : detail.trend === 'down' ? 'color-trending-down' : ''}`}>
            {detail.trend === 'up' ? '+' : ''}{detail.heatChangePercent.toFixed(1)}%
          </Text>
          <Text className={styles.statLabel}>涨跌幅</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{formatHeat(detail.discussions)}</Text>
          <Text className={styles.statLabel}>讨论量</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>🔥 热度趋势</Text>
        <HeatChart data={detail.heatHistory} />
      </View>

      {detail.reason && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>💡 热度变化原因</Text>
          <View className={styles.reasonCard}>
            <Text className={styles.reasonIcon}>📝</Text>
            <Text className={styles.reasonText}>{detail.reason}</Text>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>🔗 关联关键词</Text>
        <View className={styles.keywords}>
          {detail.relatedKeywords.map((keyword, index) => (
            <Text key={index} className={styles.keyword}>{keyword}</Text>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>💬 热门讨论</Text>
        {detail.hotDiscussions.map((discussion) => (
          <View key={discussion.id} className={styles.discussionCard}>
            <Text className={styles.discussionContent}>{discussion.content}</Text>
            <View className={styles.discussionFooter}>
              <Text className={styles.discussionAuthor}>{discussion.author}</Text>
              <View className={styles.discussionLikes}>
                <Text>❤️</Text>
                <Text>{discussion.likes}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {detail.relatedTopics.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📺 同类话题</Text>
          {detail.relatedTopics.map((topic) => (
            <View 
              key={topic.id} 
              className={styles.relatedTopic}
              onClick={() => {
                Taro.redirectTo({ url: `/pages/detail/index?id=${topic.id}` });
              }}
            >
              <Image className={styles.relatedCover} src={topic.coverUrl} mode="aspectFill" />
              <View className={styles.relatedInfo}>
                <Text className={styles.relatedTitle}>{topic.title}</Text>
                <Text className={styles.relatedHeat}>热度 {formatHeat(topic.heat)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View className={styles.notesSection}>
        <Text className={styles.sectionTitle}>📝 我的观察备注</Text>
        <Textarea 
          className={styles.notesTextarea}
          placeholder="记录你的观察和分析..."
          value={notes}
          onChange={(e) => setNotes(e.detail.value)}
        />
        <Button className={styles.notesBtn} onClick={handleSaveNotes}>
          <Text>保存备注</Text>
        </Button>
      </View>

      <View style={{ height: 160 }} />

      <View className={styles.actionBar}>
        <Button className={styles.actionBtn} onClick={handleBlock}>
          <Text className={styles.actionBtnText}>🙅 屏蔽</Text>
        </Button>
        <Button className={styles.actionBtn} onClick={handleFavorite}>
          <Text className={styles.actionBtnText}>{isFavorite(detail.id) ? '❤️ 已收藏' : '🤍 收藏'}</Text>
        </Button>
        <Button className={styles.actionBtn} onClick={handleAlert}>
          <Text className={styles.actionBtnText}>🔔 提醒</Text>
        </Button>
        <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleShare}>
          <Text className={styles.actionBtnText}>📤 分享</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default DetailPage;