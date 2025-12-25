import api from "./api";

export interface TimeEntry {
  date: string;
  clockIn: string;
  clockOut: string | null;
  hours: number | null;
}

export interface MyHistoryResponse {
  today: string;
  weeklyHours: number; 
  recent: {
    date: string;
    clockIn: string | null;
    clockOut: string | null;
    hours: number | null;
  }[];
}


export async function getMyTimeHistory(): Promise<MyHistoryResponse> {
  const res = await api.get("/time/my-history");
  return res.data;
}
