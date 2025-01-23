
import { Text } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
type GradientTextProps = {
    children: string;
    style: any;
    start?: {x: number, y: number};
    end?: {x: number, y: number};
    colors : string[];
    };
export default function GradientText(props: GradientTextProps) {
  return (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={props.colors as any} 
        start={props.start || { x: 0, y: 0 }}
        end={props.end || { x: 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};

