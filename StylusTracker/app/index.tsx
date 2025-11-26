import React, { useState, useRef } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { Circle } from "react-native-svg";
import { scheduleOnRN } from "react-native-worklets";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedLink } from "@/components/themed-link";
import { ThemedButton } from "@/components/themed-button";

type Traj = [number[], number[], number[]];

export default function HomeScreen() {
  const canvasColor = useThemeColor({}, "backgroundSecondary");
  const dotsColor = useThemeColor({}, "text");

  const [demos, setDemos] = useState<Traj[]>([]);
  const [smoothed, setSmoothed] = useState<Traj[]>([]);
  const [showSmooth, setShowSmooth] = useState(false);

  const [currentPoints, setCurrentPoints] = useState<
    { x: number; y: number }[]
  >([]);

  const T = useRef<number[]>([]);
  const X = useRef<number[]>([]);
  const Y = useRef<number[]>([]);

  const recording = useRef(false);

  const reset = () => {
    setCurrentPoints([]);
    setSmoothed([]);
    setDemos([]);
  };

  const handleEnd = (traj: Traj) => {
    setDemos((prev) => [...prev, traj]);
    setSmoothed((prev) => [...prev, smoothTrajectory(traj, 1000)]);
  };

  const handleUpdate = (point: { x: number; y: number }) => {
    setCurrentPoints((prev) => [...prev, point]);
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      recording.current = true;
      T.current = [];
      X.current = [];
      Y.current = [];
      scheduleOnRN(setCurrentPoints, []);
    })
    .onUpdate((e) => {
      if (!recording.current) return;
      const { x, y } = e;
      if (x < 0 || y < 0)
        return;

      const t = Date.now();
      T.current.push(t);
      X.current.push(x);
      Y.current.push(y);
      scheduleOnRN(handleUpdate, { x, y });
    })
    .onEnd(() => {
      if (!recording.current) return;
      recording.current = false;

      const traj: Traj = [T.current, X.current, Y.current];
      scheduleOnRN(handleEnd, traj);
    });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.leftPanel}>
        <ThemedView style={styles.controlsContainer}>
          <ThemedView style={styles.topContainer}>
            <ThemedText style={styles.text}>
              You have inputted {demos.length} demonstration
              {demos.length > 1 && "s"}
            </ThemedText>
            <ThemedLink
              href="/modal"
              title="Save demonstrations to .h5 file"
              disabled={demos.length === 0}
            />
            <ThemedButton
              title="Display Smoothed"
              disabled={demos.length === 0}
              onPress={() => setShowSmooth(!showSmooth)}
            />
          </ThemedView>
          <ThemedButton
            title="Restart"
            disabled={demos.length === 0}
            onPress={reset}
          />
        </ThemedView>
      </SafeAreaView>
      <SafeAreaView style={styles.centralPanel}>
        <ThemedView style={{ backgroundColor: canvasColor, ...styles.canvas }}>
          <GestureDetector gesture={panGesture}>
            <Svg width="100%" height="100%">
              {(showSmooth ? smoothed : demos).map((demo, i) =>
                demo[1].map((x, j) => (
                  <Circle
                    key={`demo-${i}-${j}`}
                    cx={x}
                    cy={demo[2][j]}
                    r={3}
                    fill={dotsColor}
                    opacity={0.2}
                  />
                ))
              )}

              {currentPoints.map((p, i) => (
                <Circle
                  key={`live-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill={dotsColor}
                />
              ))}
            </Svg>
          </GestureDetector>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

function smoothTrajectory(traj: Traj, samples: number): Traj {
  const [T, X, Y] = traj;
  if (T.length < 2) return traj;

  const smoothX: number[] = [];
  const smoothY: number[] = [];
  const smoothT: number[] = [];

  const step = Math.max(1, Math.floor(T.length / samples));

  for (let i = 0; i < T.length; i += step) {
    smoothT.push(T[i]);
    smoothX.push(X[i]);
    smoothY.push(Y[i]);
  }

  return [smoothT, smoothX, smoothY];
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
