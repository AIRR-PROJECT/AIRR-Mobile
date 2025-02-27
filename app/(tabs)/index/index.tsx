import { Image, StyleSheet, } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ButtonGradient from '@/components/ButtonGradient';
import BlogPreview from '@/components/tabs/BlogPreview';
import { Blog } from '@/interfaces/blogInterface';
import { loremIpsum } from 'lorem-ipsum';
import GroupSearch from '@/components/tabs/GroupSearch';
import GroupJoin from '@/components/tabs/GroupJoinComponent';
import CareerPathSuggestion from '@/components/tabs/CareerPathSuggestion';

const mockBlog: Blog = {
  title: 'How to fix clipboard if it isn’t working',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS65YSxnV0O5BzHbIQh-SdECVMcA57w2oxt8Q&s',
  description: 'Blog Description',
  content: loremIpsum({ count: 50, units: 'paragraphs' }),
  timestamp: new Date().toISOString(),
  blogAuthor: {
    name: 'Name of the Author',
    avatar: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg',
    email: 'sample_email@gmail.com',
    phoneNumber: '1234567890',
    location: 'Location',
    bio: 'Bio',
    socials: [],
    groups: [],
    blogs: [],
  },
  tags: ['Frontend', 'Backend', 'React', 'NodeJS', 'Express'],
};
export default function DashboardScreen() {
  return (
    // correct the darkColor and lightColor values later
    <ParallaxScrollView style={{ flex: 1,}}>
      {/* Title */}
      <ThemedView style={styles.titleContainer} darkColor='#1E1E1E' lightColor='#1E1E1E'>
        <ThemedText style={styles.titleText} type="title" darkColor='#fff' lightColor='#fff'>Let's Post A New Blog</ThemedText>
        <ButtonGradient style={styles.titleButton} label='POST NOW'></ButtonGradient>
      </ThemedView>
      {/*  */}
      <ThemedView style={styles.longTextContainer}>
        <ThemedText type="default" lightColor='#fff' darkColor='#fff'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis non commodi ad, nostrum quod facere magni facilis esse atque dolor doloremque aut corporis optio at praesentium mollitia fuga, pariatur quas.</ThemedText>
      </ThemedView>
      {/* Blog Preview */}
      <BlogPreview blog={mockBlog} />
      {/* Join Group props */}
      <GroupJoin url1='' url2='' url3=''/>
      {/* Find group search bar */}
      <GroupSearch/>
      {/* Career Path props suggestion */}
      <CareerPathSuggestion/>
      {/* Ai Trending tech recommdation */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  titleText:{
    flex:1,
    flexWrap: 'wrap',
    width: '100%',
  },
  titleButton:{
    width: 150,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  longTextContainer: {
    backgroundColor: 'transparent',
    gap: 0,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
