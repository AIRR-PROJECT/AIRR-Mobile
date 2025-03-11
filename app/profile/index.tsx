import { View, Text } from "react-native";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
const source = {
  html: `
  <p><span style="color: rgb(0, 138, 0);">xin chaof</span></p><ol><li><span style="color: rgb(0, 138, 0);">hihi</span></li><li><span style="color: rgb(0, 138, 0);">haha</span></li><li><span style="color: rgb(0, 138, 0);">asdasd</span></li></ol><p class="ql-align-center"><span style="color: rgb(0, 138, 0);">asdasdasdasdasdasdd</span></p>
  `,
};
export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <RenderHTML
        contentWidth={useWindowDimensions().width}
        source={source}
      >
      </RenderHTML>
    </View>
  );
}
