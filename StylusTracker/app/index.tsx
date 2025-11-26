import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedLink } from "@/components/themed-link";
import { ThemedButton } from "@/components/themed-button";

export default function HomeScreen() {
  const canvasColor = useThemeColor({}, "backgroundSecondary");
  const nb_demos = 0;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.leftPanel}>
        <ThemedView style={styles.controlsContainer}>
          <ThemedView style={styles.topContainer}>
            <ThemedText style={styles.text}>
              You have inputted {nb_demos} demonstration{nb_demos > 1 && "s"}
            </ThemedText>
            <ThemedLink
              href="/modal"
              title="Save demonstrations to .h5 file"
              disabled={nb_demos === 0}
            />
          </ThemedView>
          <ThemedButton title="Restart" disabled={nb_demos === 0} />
        </ThemedView>
      </SafeAreaView>
      <SafeAreaView style={styles.centralPanel}>
        <ThemedView
          style={{ backgroundColor: canvasColor, ...styles.canvas }}
        ></ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  leftPanel: {
    width: 250,
    padding: 16,
  },
  centralPanel: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
  },
  controlsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topContainer: {
    gap: 30,
  },
  text: {
    textAlign: "center",
  },
});
