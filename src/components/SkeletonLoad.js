import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Colors } from 'src/styles';
import { ScrollView } from 'react-native';

export const SkeletonLoad = ({ height, width, marginTop }) => (
  <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: marginTop || 0 }}>
    <SkeletonPlaceholder
      backgroundColor="#999"
      borderRadius={5}
      highlightColor={Colors.primaryGradientEnd}>
      <SkeletonPlaceholder.Item width={width} marginTop={10} height={height} />
    </SkeletonPlaceholder>
    <SkeletonPlaceholder
      backgroundColor="#999"
      borderRadius={5}
      highlightColor={Colors.primaryGradientEnd}>
      <SkeletonPlaceholder.Item width={width} marginTop={10} height={height} />
    </SkeletonPlaceholder>
    <SkeletonPlaceholder
      backgroundColor="#999"
      borderRadius={5}
      highlightColor={Colors.primaryGradientEnd}>
      <SkeletonPlaceholder.Item width={width} marginTop={10} height={height} />
    </SkeletonPlaceholder>
    <SkeletonPlaceholder
      backgroundColor="#999"
      borderRadius={5}
      highlightColor={Colors.primaryGradientEnd}>
      <SkeletonPlaceholder.Item width={width} marginTop={10} height={height} />
    </SkeletonPlaceholder>
    <SkeletonPlaceholder
      backgroundColor="#999"
      borderRadius={5}
      highlightColor={Colors.primaryGradientEnd}>
      <SkeletonPlaceholder.Item width={width} marginTop={10} height={height} />
    </SkeletonPlaceholder>
  </ScrollView>
);
