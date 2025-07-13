import cron from 'node-cron';
import { updateSystemHealth } from '../controllers/employeeController/dashboardController.js';

export const startCronJobs = () => {
  cron.schedule('* * * * *', () => {
    updateSystemHealth(); // Now safe to call without res
  });

  console.log("🟢 Cron job for system health initialized");
};
