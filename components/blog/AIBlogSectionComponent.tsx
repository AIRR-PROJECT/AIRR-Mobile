import { sub } from "date-fns";
import { View, Text, StyleSheet } from "react-native";

type SubDetailGroupCardComponentProps = {
  SubHeading: string;
  Details: string;
  Source: string;
  Code?: string;
};
type DetailGroupCardComponentProps = {
  Heading: string;
  Content: SubDetailGroupCardComponentProps[];
};

export default function DetailGroupCardComponent({
  Heading,
  Content,
}: DetailGroupCardComponentProps) {
  return (
    <View style={styles.container}>
      <Text>{Heading}</Text>
      {Content.map((item, index) => (
        <View key={index}>
          <Text>{item.SubHeading}</Text>
          <Text>{item.Details}</Text>
          <Text>{item.Source}</Text>
          <Text>{item.Code}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    },
    subHeadingContainer :{
    marginBottom: 10,
    }  ,
});
