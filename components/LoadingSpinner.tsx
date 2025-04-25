import { useAppSelector } from "@/redux/hook";
import { StyleSheet } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

export default function LoadingSpinner() {
    const { loading } = useAppSelector(state => state.loading)
    
    return (
        <Spinner 
          visible={loading}
          size={"large"}
          color="#b9ff66"
          textContent={"Now loading..."}
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