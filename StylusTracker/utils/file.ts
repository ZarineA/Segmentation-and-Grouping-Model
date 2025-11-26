import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Traj } from "./trajectory";

export async function saveJsonFile(demos: Traj[], demosSmoothed: Traj[]) {
  try {
    const output: any = {
      unsmoothed: {},
      smoothed: {},
      normalized: {},
    };

    demos.forEach(function ([t, x, y], i) {
      const [tt, xx, yy] = demosSmoothed[i];

      const maxVal = Math.max(
        ...xx.map((v) => Math.abs(v)),
        ...yy.map((v) => Math.abs(v))
      );
      const xxn = xx.map((v) => v / maxVal);
      const yyn = yy.map((v) => v / maxVal);

      output.unsmoothed[i] = { t, x, y };
      output.smoothed[i] = { t: tt, x: xx, y: yy };
      output.normalized[i] = { t: tt, x: xxn, y: yyn };
    });

    const file = new File(Paths.cache, "stylus_demo.json");
    file.write(JSON.stringify(output));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
      });
    } else {
      console.log("Sharing not available on this device.");
    }
  } catch (error) {
    console.error(error);
  }
}
