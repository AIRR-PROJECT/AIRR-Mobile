import { Link, Redirect, Stack, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/auth/button';

import ImageViewer from '@/components/auth/imageViewer';
const logo = require('@/assets/images/auth/Logo.svg');
export default function AuthScreen() {
  const router = useRouter();
  const handleLogin = () => {
    router.push('/login')
  }
  return (
    <ThemedView style={styles.container} darkColor='#1E1E1E' lightColor='#1E1E1E'> 
      <ThemedView style={styles.imageContainer} darkColor='#1E1E1E' lightColor='#1E1E1E'>
       <ImageViewer imgSource={logo}></ImageViewer>
      </ThemedView>
      <ThemedView style={styles.footerContainer} darkColor='#1E1E1E' lightColor='#1E1E1E'>
        <Button label="Log In" onPress={handleLogin}/>
        <Button label="Sign Up" />
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
