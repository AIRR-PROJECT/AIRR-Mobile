import { useAppSelector } from "@/redux/hook";
import { StyleSheet } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

export default function LoadingSpinner() {
    const { loading, message } = useAppSelector(state => state.loading)

    return (
        <Spinner 
          visible={loading}
          size={"large"}
          color="#b9ff66"
          textContent={message}
          overlayColor="#3d3d3d66"
          textStyle={styles.loadingSpinnerText}
        />
    )
}

const styles = StyleSheet.create({
  loadingSpinnerText: {
    color: "#b9ff66",
    textShadowColor: "black",
    textShadowRadius: 1
  }
});