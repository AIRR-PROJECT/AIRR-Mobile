import { abortRequest } from "@/redux/api/axiosInstance";
import { useAppSelector } from "@/redux/hook";
import { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Text } from "react-native";

export default function LoadingSpinner() {
    const { loading, message } = useAppSelector(state => state.loading)

    return (
      <View style={styles.overlay}>
        <Spinner 
          visible={loading}
          size={"large"}
          color="#b9ff66"
          // textContent={message}
          overlayColor="#3d3d3d66"
          // textStyle={styles.loadingSpinnerText}
          customIndicator={
            <View style={styles.frame}>
              <ActivityIndicator size={"large"} color={"#b9ff66"}/>
              <Text style={styles.loadingSpinnerText}>{message}</Text>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => { abortRequest() }}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          }
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
  frame: {
    backgroundColor: "#878487CC",
    padding: 15,
    paddingTop: 45,
    borderRadius: 10
  },
  loadingSpinnerText: {
    color: "#b9ff66",
    fontWeight: "bold",
    marginTop: 48,
    fontSize: 24,
    textShadowColor: "black",
    textShadowRadius: 1
  },
  cancelButton: {
    backgroundColor: "#878787",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  cancelButtonText: {
    color: "#ffffff",
    textAlign: "center"
  }
});