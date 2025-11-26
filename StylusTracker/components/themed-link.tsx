import { ButtonProps } from "react-native";
import { Link, LinkProps } from "expo-router";
import { ThemedButton } from "./themed-button";

export function ThemedLink({ ...props }: LinkProps & ButtonProps) {
  return (
    <Link {...props} asChild>
      <ThemedButton {...props} />
    </Link>
  );
}
