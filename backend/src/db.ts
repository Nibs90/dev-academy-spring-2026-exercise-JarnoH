import { Pool } from "pg";

//PostgreSQL connection pool
export const pool = new Pool({
  connectionString: "postgres://academy:academy@localhost:5432/electricity",
});
