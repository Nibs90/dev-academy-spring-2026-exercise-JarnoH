import express from "express";
import { pool } from "./db";

// Creating an express app
const app = express();
app.use(express.json());
const port = 3000;

// Format a date value as YYYY-MM-DD by using local date parts
function formatDateToYYYYMMDD(d: string | Date) {
  if (typeof d === "string") return d.slice(0, 10);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Health check endpoint to verify DB connection
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1 LIMIT 1");
    res.json({ ok: true });
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ ok: false });
  }
});

// Endpoint to get daily statistics with the pagination, sorting, and filtering
app.get("/api/statistics", async (req, res) => {
  // Pagination
  const hasDateFilter =
    typeof req.query.from === "string" || typeof req.query.to === "string";

  const page = Math.max(1, Number(req.query.page) || 1);

  //If datefilter is applied, increase default limit to 1000
  const defaultLimit = hasDateFilter ? 1000 : 10;
  const limit = Math.min(
    1000,
    Math.max(1, Number(req.query.limit) || defaultLimit),
  );

  //Calculate offset for SQL query
  const offset = (page - 1) * limit;

  //Sort
  const sort = (req.query.sort as string) || "date";
  const orderParam = (req.query.order as string) || "desc";
  const order = orderParam.toLowerCase() === "asc" ? "ASC" : "DESC";

  const allowedSorts: { [key: string]: string } = {
    date: "date",
    total_consumption: "total_consumption",
    total_production: "total_production",
    average_price: "average_price",
  };

  //Filtering
  const fromDate = req.query.from as string | undefined;
  const toDate = req.query.to as string | undefined;

  // Validate date format (YYYY-MM-DD) and range
  // Made from stackoverflow answer with modifications
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (fromDate && !dateRegex.test(fromDate)) {
    return res.status(400).send("Please write as YYYY-MM-DD");
  }
  if (toDate && !dateRegex.test(toDate)) {
    return res.status(400).send("Please write as YYYY-MM-DD");
  }

  if (fromDate && toDate) {
    const fromTs = Date.parse(fromDate);
    const toTs = Date.parse(toDate);
    if (isNaN(fromTs) || isNaN(toTs)) {
      return res.status(400).json({ error: "invalid date range" });
    }
    if (fromTs > toTs) {
      return res
        .status(400)
        .json({ error: "'from' must be before or equal to 'to' date" });
    }
  }

  // Build filter SQL and parameters
  // Made of Copilot suggestion with minor modifications
  let filterSql = "WHERE 1=1";
  const filterParams: any[] = [];

  if (fromDate) {
    filterParams.push(fromDate);
    filterSql += ` AND date >= $${filterParams.length}`;
  }

  if (toDate) {
    filterParams.push(toDate);
    filterSql += ` AND date <= $${filterParams.length}`;
  }

  // Get total count of distinct dates for pagination
  const totalSql = `SELECT COUNT(DISTINCT date) AS count FROM electricitydata ${filterSql};`;
  const totalResult = await pool.query(totalSql, filterParams);
  const totalCount = Number(totalResult.rows[0].count);
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const sqlSortColumn =
    sort === "longest_consecutive_time"
      ? "date"
      : (allowedSorts[sort] ?? "date");

  // SQL query to get the daily statistics
  const dailySql = `
  SELECT
    date::text AS date,
    SUM(consumptionamount) AS total_consumption,
    SUM(productionamount) AS total_production,
    AVG(hourlyprice) AS average_price
  FROM electricitydata
  ${filterSql}
  GROUP BY date
  ORDER BY ${sqlSortColumn} ${order}
  LIMIT $${filterParams.length + 1} OFFSET $${filterParams.length + 2};
`;

  //SQL query to get daily stats for the current page
  const dailyResult = await pool.query(dailySql, [
    ...filterParams,
    limit,
    offset,
  ]);
  // Extract the dates for the current page
  const days = dailyResult.rows.map((r) => formatDateToYYYYMMDD(r.date));

  // If there are no days, return empty data
  if (days.length === 0) {
    res.json({ page, limit, totalCount, total_pages: totalPages, data: [] });
    return;
  }

  // SQL query to get all prices for the wanted dates
  const pricesSql = `
    SELECT date::text AS date, starttime, hourlyprice
    FROM electricitydata
    WHERE date = ANY($1)
    ORDER BY date DESC, starttime ASC;
  `;

  //SQL query to get prices for the wanted dates
  const pricesResult = await pool.query(pricesSql, [days]);

  // Combine daily stats with price data
  const currentLine: { [day: string]: number } = {};
  const maxLine: { [day: string]: number } = {};

  // Calculate current and the max negative price lines
  for (const row of pricesResult.rows) {
    const day = formatDateToYYYYMMDD(row.date);

    if (currentLine[day] === undefined) currentLine[day] = 0;
    if (maxLine[day] === undefined) maxLine[day] = 0;

    const price = row.hourlyprice === null ? null : Number(row.hourlyprice);

    if (price !== null && price < 0) {
      currentLine[day] += 1;
      if (currentLine[day] > maxLine[day]) {
        maxLine[day] = currentLine[day];
      }
    } else {
      currentLine[day] = 0;
    }
  }

  // Prepare final data combining daily stats and max negative price lines
  const data = dailyResult.rows.map((r) => {
    const day = formatDateToYYYYMMDD(r.date);
    return {
      date: day,
      total_consumption: r.total_consumption,
      total_production: r.total_production,
      average_price: r.average_price,
      longest_consecutive_time: maxLine[day] ?? 0,
    };
  });

  // If sorting made by longest consecutive time, script will sort the data in JS,
  // as it cannot be done directly in SQL
  if (sort === "longest_consecutive_time") {
    data.sort((a, b) => {
      const diff =
        (Number(a.longest_consecutive_time) || 0) -
        (Number(b.longest_consecutive_time) || 0);

      return order === "ASC" ? diff : -diff;
    });
  }

  // Return the response JSON
  res.json({
    page,
    limit,
    sort,
    order: order.toLowerCase(),
    from: fromDate,
    to: toDate,
    total_count: totalCount,
    total_pages: totalPages,
    data,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
