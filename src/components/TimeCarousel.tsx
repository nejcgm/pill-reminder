import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import styles, { constants } from './styles/TimeCarousel.styles';

type HourFormat = 24 | 12;

export interface TimeCarouselProps {
  value: string; // "HH:mm"
  onChange: (value: string) => void;
  hourFormat?: HourFormat; // default 24
  minuteStep?: number; // default 1
  orientation?: 'horizontal' | 'vertical'; // default vertical
}

function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(num, max));
}

export default function TimeCarousel({
  value,
  onChange,
  hourFormat = 24,
  minuteStep = 1,
  orientation = 'vertical',
}: TimeCarouselProps) {
  const [initialHour, initialMinute] = value.split(':').map((v) => parseInt(v, 10) || 0);

  const hours = useMemo(() => {
    if (hourFormat === 12) {
      return Array.from({ length: 12 }, (_, i) => i + 1); 
    }
    return Array.from({ length: 24 }, (_, i) => i); 
  }, [hourFormat]);

  const minutes = useMemo(() => {
    const step = Math.max(1, Math.min(30, Math.floor(minuteStep)));
    const size = Math.ceil(60 / step);
    return Array.from({ length: size }, (_, i) => i * step).map((m) => clamp(m, 0, 59));
  }, [minuteStep]);

  
  const hoursData = useMemo(() => [...hours, Number.NaN], [hours]);
  const minutesData = useMemo(() => [...minutes, Number.NaN], [minutes]);

  const hourListRef = useRef<FlatList<number>>(null);
  const minuteListRef = useRef<FlatList<number>>(null);

  const selectedHourIndex = useMemo(() => {
    if (hourFormat === 12) {

      const displayHour = ((initialHour % 12) || 12);
      return Math.max(0, hours.indexOf(displayHour));
    }
    return Math.max(0, hours.indexOf(clamp(initialHour, 0, 23)));
  }, [hours, hourFormat, initialHour]);

  const selectedMinuteIndex = useMemo(() => {
    const found = minutes.indexOf(initialMinute);
    if (found >= 0) return found;
    // Snap to nearest minute in list
    let nearestIdx = 0;
    let best = Number.POSITIVE_INFINITY;
    minutes.forEach((m, idx) => {
      const d = Math.abs(m - initialMinute);
      if (d < best) {
        best = d;
        nearestIdx = idx;
      }
    });
    return nearestIdx;
  }, [minutes, initialMinute]);

  
  const [hourIndex, setHourIndex] = useState<number>(selectedHourIndex);
  const [minuteIndex, setMinuteIndex] = useState<number>(selectedMinuteIndex);

  useEffect(() => {
  
    const hourIdx = clamp(selectedHourIndex, 0, hours.length - 1);
    const minIdx = clamp(selectedMinuteIndex, 0, minutes.length - 1);
    setTimeout(() => {
      hourListRef.current?.scrollToIndex({ index: hourIdx, animated: false });
      minuteListRef.current?.scrollToIndex({ index: minIdx, animated: false });
    }, 0);
    setHourIndex(hourIdx);
    setMinuteIndex(minIdx);
  }, [hours.length, minutes.length, selectedHourIndex, selectedMinuteIndex]);

  const itemSize = constants.ITEM_SIZE;
  const visibleItems = 3;
  const mainLen = itemSize * visibleItems;
  const sidePadding = ((mainLen - itemSize) / 2);

  function format(num: number): string {
    return num < 10 ? `0${num}` : String(num);
  }

  function computeValue(nextHourIdx: number | null, nextMinuteIdx: number | null) {
    const hourIdx = clamp(nextHourIdx ?? hourIndex, 0, hours.length - 1);
    const minIdx = clamp(nextMinuteIdx ?? minuteIndex, 0, minutes.length - 1);

    let hourVal = hours[hourIdx];
    
    const minuteVal = minutes[minIdx];
    return `${format(hourVal)}:${format(minuteVal)}`;
  }

  function onHourMomentumEnd(e: any) {
    const offset = orientation === 'horizontal'
      ? (e.nativeEvent.contentOffset.x || 0)
      : (e.nativeEvent.contentOffset.y || 0);
    
    const idxRaw = clamp(Math.round(offset / itemSize), 0, hoursData.length - 1);
    
    const realIdx = Math.min(idxRaw, hoursData.length - 2);
    setHourIndex(realIdx);
    const next = computeValue(realIdx, null);
    onChange(next);
  }

  function onMinuteMomentumEnd(e: any) {
    const offset = orientation === 'horizontal' ? (e.nativeEvent.contentOffset.x || 0) : (e.nativeEvent.contentOffset.y || 0);
    const idxRaw = clamp(Math.round(offset / itemSize), 0, minutesData.length - 1);
    const realIdx = Math.min(idxRaw, minutesData.length - 2);
    setMinuteIndex(realIdx);
    const next = computeValue(null, realIdx);
    onChange(next);
  }

  function renderItem({ item, index }: ListRenderItemInfo<number>, selectedIndex: number) {
    const isPhantom = Number.isNaN(item);
    const isSelected = !isPhantom && selectedIndex === index;
    return (
      <View style={styles.itemContainer}>
        {!isPhantom && (
          <Text style={isSelected ? styles.itemTextSelected : styles.itemText}>
            {format(item)}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View style={styles.containerInner}>
      <FlatList
        ref={hourListRef}
        data={hoursData}
        horizontal={orientation === 'horizontal'}
        keyExtractor={(_, index) => `h-${index}`}
        renderItem={(info) => renderItem(info, hourIndex)}
        showsHorizontalScrollIndicator={orientation === 'horizontal'}
        showsVerticalScrollIndicator={orientation === 'vertical'}
        snapToInterval={itemSize}
        snapToAlignment="center"
        decelerationRate="fast"
        bounces={false}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          index,
          length: itemSize,
          offset: itemSize * index,
        })}
        onMomentumScrollEnd={onHourMomentumEnd}
        contentContainerStyle={[
          styles.listContainer,
          orientation === 'horizontal'
            ? { paddingHorizontal: sidePadding }
            : { paddingVertical: sidePadding },
        ]}
        // ListFooterComponent={() => (
        //   <View style={orientation === 'horizontal' ? { width: sidePadding } : { height: sidePadding }} />
        // )}
        style={[
          styles.list,
          orientation === 'horizontal' ? { width: mainLen, height: 64 } : { height: mainLen, width: itemSize },
        ]}
      />
      <View style={{ height: mainLen, justifyContent: 'center' }}>
        <Text style={styles.separator}>:</Text>
      </View>
      <FlatList
        ref={minuteListRef}
        data={minutesData}
        horizontal={orientation === 'horizontal'}
        keyExtractor={(_, index) => `m-${index}`}
        renderItem={(info) => renderItem(info, minuteIndex)}
        showsHorizontalScrollIndicator={orientation === 'horizontal'}
        showsVerticalScrollIndicator={orientation === 'vertical'}
        snapToInterval={itemSize}
        snapToAlignment="center"
        decelerationRate="fast"
        bounces={false}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          index,
          length: itemSize,
          offset: itemSize * index,
        })}
        onMomentumScrollEnd={onMinuteMomentumEnd}
        contentContainerStyle={[
          styles.listContainer,
          orientation === 'horizontal'
            ? { paddingHorizontal: sidePadding }
            : { paddingVertical: sidePadding },
        ]}
        // ListFooterComponent={() => (
        //   <View style={orientation === 'horizontal' ? { width: sidePadding } : { height: sidePadding }} />
        // )}
        style={[
          styles.list,
          orientation === 'horizontal' ? { width: mainLen, height: 64 } : { height: mainLen, width: itemSize },
        ]}
      />
      </View>
    </View>
  );
}


