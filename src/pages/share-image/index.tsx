import React, { useState, useEffect } from 'react';
import { View, Text, Button, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface ShareItem {
  id: string;
  title: string;
  heat: number;
  rank: number;
}

interface ShareData {
  title: string;
  subtitle: string;
  filter: string;
  items: ShareItem[];
  time: string;
}

const ShareImagePage: React.FC = () => {
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = (currentPage as any).options;
    
    if (options?.data) {
      try {
        const data = JSON.parse(decodeURIComponent(options.data));
        setShareData(data);
      } catch (e) {
        console.error('Parse share data error:', e);
      }
    }
  }, []);

  const handleSave = () => {
    Taro.showToast({ title: '保存中...', icon: 'loading' });
    
    setTimeout(() => {
      Taro.saveImageToPhotosAlbum({
        filePath: '',
        success: () => {
          Taro.showToast({ title: '图片已保存到相册', icon: 'success', duration: 2000 });
          setSaved(true);
          setTimeout(() => {
            Taro.navigateBack();
          }, 2000);
        },
        fail: () => {
          Taro.showModal({
            title: '保存失败',
            content: '请在系统设置中允许保存图片到相册',
            showCancel: false
          });
        }
      });
    }, 1000);
  };

  const handleClose = () => {
    Taro.navigateBack();
  };

  if (!shareData) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'top1';
    if (rank === 2) return 'top2';
    if (rank === 3) return 'top3';
    return '';
  };

  const formatHeat = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  return (
    <View className={styles.page}>
      <View className={styles.canvasWrap}>
        <Text className={styles.canvasTitle}>{shareData.title}</Text>
        <Text className={styles.canvasSubtitle}>{shareData.subtitle}</Text>
        <Text className={styles.canvasFilter}>{shareData.filter}</Text>
        
        <View className={styles.canvasList}>
          {shareData.items.map((item, index) => (
            <View key={item.id} className={styles.canvasItem}>
              <Text className={`${styles.canvasRank} ${getRankClass(index + 1)}`}>
                {index + 1}
              </Text>
              <Text className={styles.canvasItemTitle}>{item.title}</Text>
              <Text className={styles.canvasItemValue}>{formatHeat(item.heat)}</Text>
            </View>
          ))}
        </View>
        
        <Text className={styles.canvasFooter}>数据更新于 {shareData.time}</Text>
      </View>

      {!saved ? (
        <>
          <Button className={styles.btn} onClick={handleSave}>
            <Text>🖼️ 保存到相册</Text>
          </Button>
          <Button className={styles.btn} style={{ background: '#F1F5F9' }} onClick={handleClose}>
            <Text style={{ color: '#64748B' }}>取消</Text>
          </Button>
          <Text className={styles.tip}>保存后可在相册中查看分享图片</Text>
        </>
      ) : (
        <Text className={styles.tip}>图片已保存到相册</Text>
      )}
    </View>
  );
};

export default ShareImagePage;