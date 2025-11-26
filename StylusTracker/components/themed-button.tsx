import { StyleSheet, ButtonProps, TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "./themed-text";

export function ThemedButton({ ...props }: ButtonProps) {
  const color = useThemeColor({}, props.disabled ? "disabled" : "tint");
  const backgroundColor = useThemeColor({}, props.disabled ? "background" : "backgroundTernary")

  return (
    <TouchableOpacity {...props}>
      <ThemedText
        style={[
          { borderColor: color, color, backgroundColor },
          styles.default,
          props.disabled && styles.disabled,
        ]}
      >
        {props.title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  default: {
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  disabled: {},
});
