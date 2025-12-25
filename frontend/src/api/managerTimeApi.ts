import axios from "axios";

/* ======================
   Types (MATCH BACKEND)
====================== */

export interface ManagerEmployeeOverview {
  userId: string;
  fullName: string;
  status: "Clocked In" | "Clocked Out";
  todayHours: number;
  weeklyHours: number;
  lastClockIn: string | null;
  lastClockOut: string | null;
}

export interface ManagerTimeOverviewResponse {
  employees: ManagerEmployeeOverview[];
}

/* ======================
   API Call
====================== */

export function getManagerTimeOverview(): Promise<ManagerTimeOverviewResponse> {
  return axios
    .get<ManagerTimeOverviewResponse>(
      "http://localhost:5019/api/manager/time/overview",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then(response => response.data);
}
