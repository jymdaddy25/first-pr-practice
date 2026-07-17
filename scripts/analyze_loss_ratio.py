"""Summarize the insurance loss-ratio time series data.

Reads TrackA_실습데이터/insurance_data/loss_ratio_timeseries.csv and prints
the average loss ratio (손해율) per product category (상품카테고리).
"""
import csv
import glob
import os
from collections import defaultdict

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# The TrackA folder name is Korean and may be stored in a different Unicode
# normalization form (NFC vs NFD) depending on the filesystem, so it's
# located by glob rather than hardcoded as a string literal.
DATA_PATH = glob.glob(
    os.path.join(REPO_ROOT, "TrackA_*", "insurance_data", "loss_ratio_timeseries.csv")
)[0]


def load_records(path=DATA_PATH):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def average_loss_ratio_by_category(records):
    totals = defaultdict(float)
    counts = defaultdict(int)
    for row in records:
        category = row["상품카테고리"]
        totals[category] += float(row["손해율(%)"])
        counts[category] += 1
    return {category: round(totals[category] / counts[category], 2) for category in totals}


def main():
    records = load_records()
    averages = average_loss_ratio_by_category(records)
    for category, avg in sorted(averages.items(), key=lambda item: item[1], reverse=True):
        print(f"{category}: {avg}%")


if __name__ == "__main__":
    main()
