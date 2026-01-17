//Defining types used in this project
export type DailyRow = {
  date: string;
  total_consumption: string | number | null;
  total_production: string | number | null;
  average_price: string | number | null;
  longest_consecutive_time: number;
};
//Making ColumnKey type based on DailyRow keys
export type ColumnKey = keyof DailyRow;

//Defining the structure of api
export type ApiResponse = {
  page: number;
  limit: number;
  sort?: string;
  order?: string;
  from?: string | null;
  to?: string | null;
  total_count: number;
  total_pages: number;
  data: DailyRow[];
};
//Defining the structure of query parameters
export type QueryParams = {
  page: number;
  limit: number;
  sort: ColumnKey;
  order: "asc" | "desc";
  from?: string;
  to?: string;
};
