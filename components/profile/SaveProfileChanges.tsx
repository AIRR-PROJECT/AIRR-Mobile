import { StyleSheet, ToastAndroid } from "react-native";
import ButtonGradient from "../ButtonGradient";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { changeCurrentPassword, getUserInfo, resetChangedPassword, setUserChangeSaved, updateUser } from "@/redux/slices/authSlice";
import { User } from "@/interfaces/userInterface";
import { ChangeCurrentPasswordCredentials } from "@/interfaces/authInterface";
import { reset, resetPassword } from "@/redux/slices/userSlice";

export default function SaveProfileChanges() {
  const dispatch = useAppDispatch()
  const { user, userChange, userCurrentPassword, userNewPassword, userChangeValid } = useAppSelector(state => state.user)

  // handle on press to save change here
  const handleSaveChanges = () => {
    if (!userChangeValid) {
      ToastAndroid.show("There are errors in your form", ToastAndroid.SHORT);
      return;
    }
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

    if (userNewPassword) {
      const credentials: ChangeCurrentPasswordCredentials = {
        email: user.email!,
        current_password: userCurrentPassword,
        new_password: userNewPassword
      }
      dispatch(changeCurrentPassword(credentials)).then(() => {
        // dispatch(resetPassword())
      })
    }
  };
  return (
    <ButtonGradient
      label="SAVE CHANGES"
      onPressOut={handleSaveChanges}
      style={styles.buttonContainer}
      labelStyle={styles.buttonLabel}
    />
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
});