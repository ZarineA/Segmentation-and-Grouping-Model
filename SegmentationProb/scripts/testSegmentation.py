import drawData2D as scr2
from ModSegment import main2d, probabilistically_combine
import os

if __name__ == '__main__':
  files = files_only = [f for f in os.listdir("../json files") if ".json" in f]
  all_results = {}

  for file_name in files:
    nb_letters = len(file_name.split(".")[0])
    nb_demos = scr2.get_nb_demos_json(file_name)
    all_segments = []
    for i in range(nb_demos):
      segments,demo = main2d(i, file_name)
      all_segments.append(segments)
    segmentsDbscan = probabilistically_combine(all_segments, len(demo), 1, n_samples=3, n_pass=2, mode="dbscan")
    segmentsKmeans = probabilistically_combine(all_segments, len(demo), 1, n_samples=3, n_pass=2, mode="kmeans")

    if nb_letters not in all_results:
      all_results[nb_letters] = {"nb_examples": 0, "total_dbscan": 0, "total_kmeans": 0}

    all_results[nb_letters]["nb_examples"] += 1
    all_results[nb_letters]["total_dbscan"] += len(segmentsDbscan) - 1
    all_results[nb_letters]["total_kmeans"] += len(segmentsKmeans) - 1
  
  print("\nLetters\tDBSCAN\tK-Means")
  for nb_letters in sorted(all_results.keys()):
    average_dbscan = all_results[nb_letters]["total_dbscan"] / all_results[nb_letters]["nb_examples"]
    average_kmeans = all_results[nb_letters]["total_kmeans"] / all_results[nb_letters]["nb_examples"]
    print(f"{nb_letters} \t{round(average_dbscan, 2)} \t{round(average_kmeans, 2)}")