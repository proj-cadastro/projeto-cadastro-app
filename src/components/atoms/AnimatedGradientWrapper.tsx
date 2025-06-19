import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type Props = {
  children: ReactNode;
  style?: any;
};

export const AnimatedGradientWrapper = ({ children, style }: Props) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear, 
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const wave = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const invertedWave = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const start = { x: wave, y: 0 };
  const end = { x: invertedWave, y: 1 };

  return (
    <AnimatedLinearGradient
      colors={[ '#8B0000', '#D32719']}
      start={start}
      end={end}
      style={style}
    >
      {children}
    </AnimatedLinearGradient>
  );
};