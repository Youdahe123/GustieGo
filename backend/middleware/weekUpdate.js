import cron from "node-cron";
import { fillWeekStats } from "./autoComplete.js";

cron.schedule("0 0 * * 0", async () => { // every Sunday at midnight
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    await fillWeekStats({ weekStart, weekEnd });
});