import DetailGroupCardComponent from '@/components/group/DetailGroupCardComponent';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const mockGroupDetail = {
  name: "The Data-Driven Minds Collective",
  id: "data_minds",
  avatar: "https://picsum.photos/325",
  tag: "Web Development",
  posts: 100,
  views: 2000,
  likes: 500,
}
export default function GroupPage() {
  return (
    <View style={styles.container}>
      <DetailGroupCardComponent {...mockGroupDetail}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
})
