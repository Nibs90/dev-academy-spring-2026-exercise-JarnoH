import { useMemo, useState } from "react";
import type { QueryParams, ColumnKey } from "./types";
import Controls from "./components/Controls";
import StatsTable from "./components/StatsTable";
import Pagination from "./components/Pagination";
import { useDailyStats } from "./assets/useDailyStats";
import "./styles/App.css";

//Main application component
export default function App() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<ColumnKey>("date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  //Helpers to change page
  function resetToFirstPage() {
    setPage(1);
  }

  function goPrev() {
    setPage((p) => Math.max(1, p - 1));
  }

  function goNext() {
    setPage((p) => p + 1);
  }

  function changeLimit(newLimit: number) {
    setLimit(newLimit);
    resetToFirstPage();
  }

  function toggleSort(column: ColumnKey) {
    if (sort === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(column);
      setOrder("desc");
    }
  }

  function applyFilter() {
    resetToFirstPage();
  }

  function clearFilter() {
    setFrom("");
    setTo("");
    resetToFirstPage();
  }

  //Memoize query parameters to avoid unnecessary fetches
  const params: QueryParams = useMemo(
    () => ({ page, limit, sort, order, from, to }),
    [page, limit, sort, order, from, to],
  );

  const { resp, loading, error } = useDailyStats(params);

  //Determine current page and total pages
  const currentPage = resp?.page ?? page;
  const totalPages = resp?.total_pages ?? 1;

  return (
    <div className="app">
      <h1>Electricity daily stats</h1>

      <Controls
        from={from}
        to={to}
        limit={limit}
        setFrom={setFrom}
        setTo={setTo}
        setLimit={changeLimit}
        onApply={applyFilter}
        onClear={clearFilter}
      />

      {error ? <p className="error">{error}</p> : null}

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        canPrev={currentPage > 1}
        canNext={currentPage < totalPages}
        onPrev={goPrev}
        onNext={goNext}
      />

      <StatsTable
        rows={resp?.data ?? []}
        loading={loading}
        sort={sort}
        order={order}
        onToggleSort={toggleSort}
      />
      <p className="sortingNote">
        * Longest consecutive time is sorted per page.
      </p>
    </div>
  );
}
