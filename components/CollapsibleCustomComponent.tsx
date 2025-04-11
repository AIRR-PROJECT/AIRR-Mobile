import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

export function CollapsibleCustomComponent({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <Text style={styles.title}>{title}</Text>
        <IconSymbol
          name="chevron.right"
          size={30}
          weight="medium"
          color={"#fff"}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    backgroundColor: "#212531",
    borderRadius: 90,
    padding: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#fff',
  }
});
