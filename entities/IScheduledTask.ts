export interface IScheduledTask {
  name: string;
  type: string;
  action: string;
  date: string;
  data: string;
  log: string;
  success: boolean;
  error: boolean;
  executed: boolean;
}
