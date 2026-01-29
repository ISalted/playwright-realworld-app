export class Helpers {
  /**
   * Returns Unix timestamp in seconds.
   * If daysOffset is provided, adds (or subtracts if negative) days to current time.
   */
  getUnixTimestamp(daysOffset: number = 0): number {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const secondsInDay = 24 * 60 * 60;
    return nowInSeconds + (daysOffset * secondsInDay);
  }
}
