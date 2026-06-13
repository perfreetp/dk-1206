import React from 'react';
import { View, Text } from '@tarojs/components';
import { HeatPoint } from '@/types';
import styles from './index.module.scss';

interface HeatChartProps {
  data: HeatPoint[] | HeatPoint[][];
  labels?: string[];
  height?: number;
}

const colors = ['#6366F1', '#F472B6', '#34D399', '#FF7D00'];

const HeatChart: React.FC<HeatChartProps> = ({ data, labels = [], height = 200 }) => {
  if (!data || data.length === 0) return null;
  
  const isMulti = Array.isArray(data[0]);
  const datasets = isMulti ? (data as HeatPoint[][]) : [[...data]];
  
  const allValues = datasets.flat().map(d => d.value);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
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
  
  const displayData = datasets.map(d => d.slice(-12));
  const displayPoints = displayData[0] || [];
  
  return (
    <View className={styles.chartContainer}>
      <View className={styles.yAxis}>
        <Text className={styles.yLabel}>{formatValue(maxValue)}</Text>
        <Text className={styles.yLabel}>{formatValue((maxValue + minValue) / 2)}</Text>
        <Text className={styles.yLabel}>{formatValue(minValue)}</Text>
      </View>
      
      <View className={styles.chartArea}>
        {isMulti && labels.length > 0 && (
          <View className={styles.legend}>
            {datasets.map((_, index) => (
              <View key={index} className={styles.legendItem}>
                <View className={styles.legendDot} style={{ backgroundColor: colors[index % colors.length] }} />
                <Text className={styles.legendText}>{labels[index]}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View className={styles.bars}>
          {displayPoints.map((point, pointIndex) => (
            <View key={pointIndex} className={styles.barGroup}>
              {datasets.map((dataset, dataIndex) => {
                const value = dataset[pointIndex]?.value || minValue;
                return (
                  <View 
                    key={dataIndex}
                    className={styles.bar}
                    style={{ 
                      height: `${getBarHeight(value)}rpx`,
                      backgroundColor: colors[dataIndex % colors.length],
                      marginLeft: dataIndex > 0 ? '4rpx' : '0'
                    }}
                  />
                );
              })}
              <Text className={styles.xLabel}>{point.time.split(':')[0]}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default HeatChart;