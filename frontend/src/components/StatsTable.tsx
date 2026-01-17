import "../styles/StatsTable.css";
import type { DailyRow, ColumnKey } from "../types";
import {
  formatConsumptionMWh,
  formatProductionMWh,
  formatPrice,
} from "../assets/dataFormatters";
import { columnLabels } from "../assets/ui";

//Props for statstable component
type Props = {
  rows: DailyRow[];
  loading: boolean;
  sort: ColumnKey;
  order: "asc" | "desc";
  onToggleSort: (column: ColumnKey) => void;
};

const columns: ColumnKey[] = [
  "date",
  "total_consumption",
  "total_production",
  "average_price",
  "longest_consecutive_time",
];

//Statstable component
//Made with copilot prewritten suggestion and own modifications
export default function StatsTable(props: Props) {
  return (
    <div className="tableWrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((key) => {
              const isSorted = props.sort === key;
              return (
                <th
                  key={key}
                  className={isSorted ? "sorted" : ""}
                  onClick={() => props.onToggleSort(key)}
                >
                  {columnLabels[key]} {isSorted ? `(${props.order})` : ""}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {props.loading ? (
            <tr>
              <td colSpan={columns.length} className="loadingRow">
                Loading…
              </td>
            </tr>
          ) : (
            props.rows.map((row) => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{formatConsumptionMWh(row.total_consumption)}</td>
                <td>{formatProductionMWh(row.total_production)}</td>
                <td>{formatPrice(row.average_price)}</td>
                <td>{row.longest_consecutive_time}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
