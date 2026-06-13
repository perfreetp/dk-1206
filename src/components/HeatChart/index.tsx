import React from 'react';
import { View, Text } from '@tarojs/components';
import { HeatPoint } from '@/types';
import styles from './index.module.scss';

interface HeatChartProps {
  data: HeatPoint[];
  height?: number;
}

const HeatChart: React.FC<HeatChartProps> = ({ data, height = 200 }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * (height - 60) + 20;
  };
  
  const formatValue = (value: number) => {
    if (value >= 10000) {
      return (value / 10000).toFixed(0) + '万';
    }
    return value.toLocaleString();
  };
  
  const displayData = data.slice(-12);
  
  return (
    <View className={styles.chartContainer}>
      <View className={styles.yAxis}>
        <Text className={styles.yLabel}>{formatValue(maxValue)}</Text>
        <Text className={styles.yLabel}>{formatValue((maxValue + minValue) / 2)}</Text>
        <Text className={styles.yLabel}>{formatValue(minValue)}</Text>
      </View>
      
      <View className={styles.chartArea}>
        <View className={styles.bars}>
          {displayData.map((point, index) => (
            <View key={index} className={styles.barWrap}>
              <View 
                className={styles.bar}
                style={{ height: `${getBarHeight(point.value)}rpx` }}
              />
              <Text className={styles.xLabel}>{point.time.split(':')[0]}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default HeatChart;