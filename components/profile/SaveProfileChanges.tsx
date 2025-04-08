import { StyleSheet } from "react-native";
import ButtonGradient from "../ButtonGradient";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getUserInfo, setUserChangeSaved, updateUser } from "@/redux/slices/authSlice";
import { User } from "@/interfaces/userInterface";

export default function SaveProfileChanges() {
  const dispatch = useAppDispatch()
  const { user, userChange } = useAppSelector(state => state.user)

  // handle on press to save change here
  const handleSaveChanges = () => {
    if (JSON.stringify(user) == JSON.stringify(userChange)) {
      dispatch(getUserInfo()).then(() => {
        dispatch(setUserChangeSaved(true))
      })
    }
    else {
      dispatch(updateUser(userChange as unknown as User)).then(() => {
        dispatch(getUserInfo()).then(() => {
          dispatch(setUserChangeSaved(true))
        })
      })
    }
  };
  return (
    <ButtonGradient
      label="SAVE CHANGES"
      onPress={handleSaveChanges}
      style={styles.buttonContainer}
      labelStyle={styles.buttonLabel}
    />
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 150,
    height: 40,
    borderRadius: 20,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
