"""Summarize the insurance loss-ratio time series data.

Reads TrackA_실습데이터/insurance_data/loss_ratio_timeseries.csv and prints
the average loss ratio (손해율) per product category (상품카테고리).
"""
import csv
import os
from collections import defaultdict

DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "TrackA_실습데이터",
    "insurance_data",
    "loss_ratio_timeseries.csv",
)


def load_records(path=DATA_PATH):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def average_loss_ratio_by_category(records):
    # TODO: group records by 상품카테고리 and compute the average 손해율(%)
    raise NotImplementedError


def main():
    records = load_records()
    averages = average_loss_ratio_by_category(records)
    for category, avg in sorted(averages.items(), key=lambda item: item[1], reverse=True):
        print(f"{category}: {avg}%")


if __name__ == "__main__":
    main()
