import { subDays, format } from "date-fns";
import type { DailyProductivity } from "@/types";

export const weeklyProductivity: DailyProductivity[] = Array.from({ length: 7 }, (_, i) => {
  const date = subDays(new Date(), 6 - i);
  return {
    date: format(date, "EEE"),
    completed: 4 + Math.round(Math.sin(i) * 3 + i),
    created: 3 + Math.round(Math.cos(i) * 2 + i * 0.7),
  };
});

export const tasksPerDay = Array.from({ length: 14 }, (_, i) => {
  const date = subDays(new Date(), 13 - i);
  return {
    date: format(date, "MMM d"),
    tasks: 2 + Math.round(Math.abs(Math.sin(i * 1.3)) * 10),
  };
});

export const taskStatusDistribution = [
  { name: "To Do", value: 28, color: "#94A3B8" },
  { name: "Doing", value: 19, color: "#4F46E5" },
  { name: "Review", value: 12, color: "#F97316" },
  { name: "Done", value: 41, color: "#16A34A" },
];

export const projectProgress = [
  { name: "Website Redesign", progress: 68 },
  { name: "Mobile App Launch", progress: 45 },
  { name: "Q3 Marketing Campaign", progress: 82 },
  { name: "API Platform v3", progress: 34 },
  { name: "Customer Onboarding", progress: 57 },
];

export const memberActivity = [
  { name: "Nethmika Athukorala", tasks: 24 },
  { name: "Aloka", tasks: 31 },
  { name: "Okith", tasks: 18 },
  { name: "Yenuli", tasks: 22 },
  { name: "Venuja", tasks: 15 },
  { name: "Linal", tasks: 27 },
];

export const completionRateTrend = Array.from({ length: 6 }, (_, i) => ({
  month: format(subDays(new Date(), (5 - i) * 30), "MMM"),
  rate: 55 + i * 6 + Math.round(Math.random() * 4),
}));
