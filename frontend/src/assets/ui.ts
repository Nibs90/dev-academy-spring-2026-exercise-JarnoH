import type { ColumnKey } from "../types";

//Map of columb keys
export const columnLabels: Record<ColumnKey, string> = {
  date: "Date",
  total_consumption: "Total consumption (MWh)",
  total_production: "Total production (MWh)",
  average_price: "Average price (€/MWh)",
  longest_consecutive_time: "Longest consecutive time* (h)",
};
