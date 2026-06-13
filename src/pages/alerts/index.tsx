import React, { useState } from 'react';
import { View, Text, ScrollView, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAlerts } from '@/hooks/useAlerts';
import { mockTrends } from '@/data/mockData';
import styles from './index.module.scss';

const AlertsPage: React.FC = () => {
  const { alerts, toggleAlert, removeAlert, addAlert } = useAlerts();
  const [showModal, setShowModal] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState('');
  const [threshold, setThreshold] = useState('');

  const formatValue = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  const getProgress = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  const handleAddAlert = () => {
    if (!selectedTrend || !threshold) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    
    const trend = mockTrends.find(t => t.id === selectedTrend);
    if (trend) {
      addAlert(trend.id, trend.title, parseInt(threshold), trend.heat);
      setShowModal(false);
      setSelectedTrend('');
      setThreshold('');
      Taro.showToast({
        title: '提醒设置成功',
        icon: 'success'
      });
    }
  };

  const handleRemove = (id: string) => {
    Taro.showModal({
      title: '删除提醒',
      content: '确定要删除这个提醒吗？',
      success: (res) => {
        if (res.confirm) {
          removeAlert(id);
          Taro.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>热度提醒</Text>
        <Text className={styles.subtitle}>设置热度突破提醒，及时掌握动态</Text>
      </View>

      {alerts.length > 0 ? (
        alerts.map(alert => (
          <View key={alert.id} className={styles.alertCard}>
            <View className={styles.alertHeader}>
              <Text className={styles.alertTitle}>{alert.title}</Text>
              <Button 
                className={`${styles.toggleBtn} ${alert.isActive ? styles.active : ''}`}
                onClick={() => toggleAlert(alert.id)}
              >
                <View className={styles.toggleDot} />
              </Button>
            </View>
            
            <View className={styles.progressBar}>
              <View 
                className={styles.progressFill} 
                style={{ width: `${getProgress(alert.currentValue, alert.threshold)}%` }}
              />
            </View>
            
            <View className={styles.progressInfo}>
              <Text className={styles.progressText}>当前: {formatValue(alert.currentValue)}</Text>
              <Text className={styles.progressText}>目标: {formatValue(alert.threshold)}</Text>
            </View>
            
            <View className={styles.thresholdInfo}>
              <Text className={styles.thresholdIcon}>🔔</Text>
              <Text className={styles.thresholdText}>
                当热度突破 {formatValue(alert.threshold)} 时提醒
              </Text>
            </View>
            
            <Text className={styles.createTime}>创建于 {alert.createdAt}</Text>
            
            <Button 
              style={{ marginTop: 24 }} 
              onClick={() => handleRemove(alert.id)}
            >
              <Text style={{ color: '#F87171', fontSize: 24 }}>删除提醒</Text>
            </Button>
          </View>
        ))
      ) : (
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>🔔</Text>
          <Text className={styles.emptyText}>还没有设置任何提醒</Text>
        </View>
      )}

      <Button className={styles.addBtn} onClick={() => setShowModal(true)}>
        <Text className={styles.addIcon}>+</Text>
      </Button>

      {showModal && (
        <View className={styles.modal} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加热度提醒</Text>
            
            <Text style={{ fontSize: 28, marginBottom: 16 }}>选择话题</Text>
            <ScrollView scrollY style={{ maxHeight: 200, marginBottom: 24 }}>
              {mockTrends.slice(0, 5).map(trend => (
                <Text
                  key={trend.id}
                  style={{ 
                    padding: 24, 
                    fontSize: 28,
                    borderBottom: '1rpx solid #E2E8F0',
                    color: selectedTrend === trend.id ? '#6366F1' : '#64748B'
                  }}
                  onClick={() => setSelectedTrend(trend.id)}
                >
                  {trend.title}
                </Text>
              ))}
            </ScrollView>
            
            <Text style={{ fontSize: 28, marginBottom: 16 }}>设置阈值（热度）</Text>
            <Input 
              className={styles.modalInput}
              type="number"
              placeholder="输入热度阈值"
              value={threshold}
              onChange={(e) => setThreshold(e.detail.value)}
            />
            
            <Button className={styles.modalBtn} onClick={handleAddAlert}>
              <Text>确定</Text>
            </Button>
            <Button className={`${styles.modalBtn} ${styles.cancel}`} onClick={() => setShowModal(false)}>
              <Text>取消</Text>
            </Button>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default AlertsPage;