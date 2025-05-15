import { useAppSelector } from "@/redux/hook";
import { StyleSheet, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

export default function LoadingSpinner() {
    const { loading, message } = useAppSelector(state => state.loading)

    return (
      <View style={styles.overlay}>
        <Spinner 
          visible={loading}
          size={"large"}
          color="#b9ff66"
          textContent={message}
          overlayColor="#3d3d3d66"
          textStyle={styles.loadingSpinnerText}
        />
      </View>
    )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  loadingSpinnerText: {
    color: "#b9ff66",
    textShadowColor: "black",
    textShadowRadius: 1
  }
});