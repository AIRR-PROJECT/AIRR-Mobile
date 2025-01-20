import { StyleSheet, View, Pressable, Text } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
};
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
export default function ButtonGradient({ label, onPress }: Props) {
  return (
    <ThemedView style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <ThemedText style={styles.buttonLabel}>{label}</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    backgroundColor: 'transparent',
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#0070f3',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
