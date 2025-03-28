/**
 * Utility functions for date manipulation
 */
export class DateUtils {
  /**
   * Gets a future date with specific time
   * @param daysFromNow - Number of days from today
   * @param hours - Hour (0-23)
   * @param minutes - Minute (0-59), defaults to 0
   * @returns ISO string of the future date
   */
  static getFutureDate(
    daysFromNow: number,
    hours: number,
    minutes: number = 0,
  ): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  }

  /**
   * Gets a future date with time range
   * @param daysFromNow - Number of days from today
   * @param startHour - Start hour (0-23)
   * @param durationHours - Duration in hours
   * @returns Object with start and end ISO strings
   */
  static getFutureTimeRange(
    daysFromNow: number,
    startHour: number,
    durationHours: number,
  ): { startTime: string; endTime: string } {
    const startTime = this.getFutureDate(daysFromNow, startHour);
    const endTime = this.getFutureDate(daysFromNow, startHour + durationHours);
    return { startTime, endTime };
  }
}
