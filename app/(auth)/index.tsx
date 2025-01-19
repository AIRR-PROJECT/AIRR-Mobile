import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/auth/button';

import ImageViewer from '@/components/auth/imageViewer';
const logo = require('@/assets/images/auth/Logo.svg');
export default function AuthScreen() {
  return (
    <ThemedView style={styles.container} darkColor='#110F0F' lightColor='#110F0F'> 
      <ThemedView style={styles.imageContainer} darkColor='#110F0F' lightColor='#110F0F'>
       <ImageViewer imgSource={logo}></ImageViewer>
      </ThemedView>
      <ThemedView style={styles.footerContainer} darkColor='#110F0F' lightColor='#110F0F'>
        <Button label="Choose a photo" />
        <Button label="Use this photo" />
        <Button label="Continue as guest" />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    alignItems: 'center',
  },
  imageContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
