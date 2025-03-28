import { useRef } from 'react';
import { Pressable, Animated, PressableProps } from "react-native";

const AnimatedPressable = ({ children, ...props }: PressableProps) => {
  const animated = useRef(new Animated.Value(1)).current;
  
  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
    
  return (
    <Pressable onPressIn={fadeIn} onPressOut={fadeOut} {...props}>
      <Animated.View style={{ opacity: animated }}>{children}</Animated.View>
    </Pressable>
  );
};
    
export default AnimatedPressable;