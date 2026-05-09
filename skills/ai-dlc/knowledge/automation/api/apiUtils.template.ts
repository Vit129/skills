/**
 * DateHelper - Class for managing dates for API
 * Supports formatting, calculation, validation, and Thai Buddhist Era (B.E.)
 * 
 * ✅ FEATURES:
 * - Format: DD/MM/YYYY, YYYY-MM-DD, ISO 8601
 * - Calculation: add/subtract days, months, years
 * - Range: get past/future date ranges
 * - Era: CE (A.D.) / BE (B.E.) conversion
 */
export class DateHelper {
  /**
   * 🔥 MAIN: Format or Parse dates in any format in one place
   * @param date - Source date (string or Date object)
   * @param options - Format and era options
   * 
   * @example
   * // Format current date as DD/MM/YYYY B.E.
   * DateHelper.format(new Date(), { outputFormat: 'DD/MM/YYYY', outputEra: 'BE' });
   * 
   * // Parse from DD/MM/YYYY B.E. to YYYY-MM-DD A.D.
   * DateHelper.format('19/12/2567', { inputFormat: 'DD/MM/YYYY', inputEra: 'BE' });
   */
  static format(date: string | Date, options: DateOptions = {}): string {
    // Implementation logic...
    return "";
  }

  /**
   * Get current date (YYYY-MM-DD)
   */
  static today(): string {
    return this.format(new Date());
  }

  /**
   * Get current date (ISO 8601)
   */
  static nowIso(): string {
    return new Date().toISOString();
  }

  /**
   * Get tomorrow's date
   */
  static tomorrow(): string {
    return this.getFutureDate(1);
  }

  /**
   * Get yesterday's date
   */
  static yesterday(): string {
    return this.getPastDate(1);
  }

  /**
   * Get future date
   * @param days - Number of days ahead
   */
  static getFutureDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return this.format(date);
  }

  /**
   * Get past date
   * @param days - Number of days ago
   */
  static getPastDate(days: number): string {
    return this.getFutureDate(-days);
  }

  /**
   * Get first day of month
   */
  static getFirstDayOfMonth(date: Date = new Date()): string {
    const d = new Date(date.getFullYear(), date.getMonth(), 1);
    return this.format(d);
  }

  /**
   * Get last day of month
   */
  static getLastDayOfMonth(date: Date = new Date()): string {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return this.format(d);
  }

  /**
   * Get first day of year
   */
  static getFirstDayOfYear(date: Date = new Date()): string {
    const d = new Date(date.getFullYear(), 0, 1);
    return this.format(d);
  }

  /**
   * Get last day of year
   */
  static getLastDayOfYear(date: Date = new Date()): string {
    const d = new Date(date.getFullYear(), 11, 31);
    return this.format(d);
  }

  /**
   * Get first day of week (Monday)
   */
  static getFirstDayOfWeek(date: Date = new Date()): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return this.format(new Date(d.setDate(diff)));
  }

  /**
   * Get last day of week (Sunday)
   */
  static getLastDayOfWeek(date: Date = new Date()): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? 0 : 7);
    return this.format(new Date(d.setDate(diff)));
  }

  /**
   * Get date range (7 days ago - today)
   */
  static getLast7Days(): DateRange {
    return { start: this.getPastDate(7), end: this.today() };
  }

  /**
   * Get date range (30 days ago - today)
   */
  static getLast30Days(): DateRange {
    return { start: this.getPastDate(30), end: this.today() };
  }

  /**
   * Get date range (N days ago - today)
   */
  static getPastRange(days: number): DateRange {
    return { start: this.getPastDate(days), end: this.today() };
  }

  /**
   * Get date range for this month
   */
  static getThisMonthRange(): DateRange {
    return { start: this.getFirstDayOfMonth(), end: this.getLastDayOfMonth() };
  }

  /**
   * Get date range for this year
   */
  static getThisYearRange(): DateRange {
    return { start: this.getFirstDayOfYear(), end: this.getLastDayOfYear() };
  }

  /**
   * Get date range for this week
   */
  static getThisWeekRange(): DateRange {
    return { start: this.getFirstDayOfWeek(), end: this.getLastDayOfWeek() };
  }

  /**
   * Get date range for last month
   */
  static getLastMonthRange(): DateRange {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return { 
      start: this.getFirstDayOfMonth(d), 
      end: this.getLastDayOfMonth(d) 
    };
  }

  /**
   * Add days
   * @param date - Source date (YYYY-MM-DD)
   * @param days - Number of days (positive = future, negative = past)
   */
  static addDays(date: string, days: number): string {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return this.format(d);
  }

  /**
   * Add months
   */
  static addMonths(date: string, months: number): string {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return this.format(d);
  }

  /**
   * Add years
   */
  static addYears(date: string, years: number): string {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + years);
    return this.format(d);
  }

  /**
   * Subtract days (shorthand for addDays with negative)
   */
  static subDays(date: string, days: number): string {
    return this.addDays(date, -days);
  }

  /**
   * Subtract months
   */
  static subMonths(date: string, months: number): string {
    return this.addMonths(date, -months);
  }

  /**
   * Subtract years
   */
  static subYears(date: string, years: number): string {
    return this.addYears(date, -years);
  }

  /**
   * Calculate number of days between two dates
   */
  static diffDays(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Calculate number of months between two dates
   */
  static diffMonths(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  }

  /**
   * Calculate number of years between two dates
   */
  static diffYears(date1: string, date2: string): number {
    return Math.floor(this.diffMonths(date1, date2) / 12);
  }

  /**
   * Check if date is in the past
   */
  static isPast(date: string): boolean {
    return new Date(date).getTime() < new Date().getTime();
  }

  /**
   * Check if date is in the future
   */
  static isFuture(date: string): boolean {
    return new Date(date).getTime() > new Date().getTime();
  }

  /**
   * Check if date is today
   */
  static isToday(date: string): boolean {
    return this.format(new Date(date)) === this.today();
  }

  /**
   * Check if date is a weekend (Saturday/Sunday)
   */
  static isWeekend(date: string): boolean {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  }

  /**
   * Check if date is a weekday (Monday-Friday)
   */
  static isWeekday(date: string): boolean {
    return !this.isWeekend(date);
  }

  /**
   * Check if date string is valid
   */
  static isValid(date: string): boolean {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }

  /**
   * Check if date is within range
   */
  static isBetween(date: string, start: string, end: string): boolean {
    const d = new Date(date).getTime();
    return d >= new Date(start).getTime() && d <= new Date(end).getTime();
  }

  /**
   * Convert date to timestamp
   */
  static toTimestamp(date: string): number {
    return new Date(date).getTime();
  }

  /**
   * Convert timestamp to date
   */
  static fromTimestamp(timestamp: number): string {
    return this.format(new Date(timestamp));
  }

  /**
   * Get day name (Monday, Tuesday, ...)
   */
  static getDayName(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  }

  /**
   * Get day name in English (Sunday, Monday, ...)
   */
  static getDayNameLocale(date: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
  }

  /**
   * Get month name (January, February, ...)
   */
  static getMonthName(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'long' });
  }

  /**
   * Get month name in English (January, February, ...)
   */
  static getMonthNameLocale(date: string): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return months[new Date(date).getMonth()];
  }

  /**
   * Get short month name in English (Jan, Feb, ...)
   */
  static getMonthNameLocaleShort(date: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date(date).getMonth()];
  }

  /**
   * Convert year CE <-> BE
   */
  static convertYear(year: number, to: 'CE' | 'BE'): number {
    return to === 'BE' ? year + 543 : year - 543;
  }

  /**
   * Get Buddhist Year from date
   * @example
   * DateHelper.getBuddhistYear() // 2568 (if year is 2025)
   */
  static getBuddhistYear(date: Date = new Date()): number {
    return date.getFullYear() + 543;
  }

  /**
   * Format date in English style (Day Month Year B.E.)
   * @example
   * DateHelper.formatLocaleFull('2024-12-19') // '19 December 2567'
   */
  static formatLocaleFull(date: string): string {
    const d = new Date(date);
    return `${d.getDate()} ${this.getMonthNameLocale(date)} ${d.getFullYear() + 543}`;
  }

  /**
   * Format short date in English style (Day ShortMonth Year)
   * @example
   * DateHelper.formatLocaleShort('2024-12-19') // '19 Dec 67'
   */
  static formatLocaleShort(date: string): string {
    const d = new Date(date);
    const year = (d.getFullYear() + 543).toString().slice(-2);
    return `${d.getDate()} ${this.getMonthNameLocaleShort(date)} ${year}`;
  }
}

export interface DateOptions {
  inputFormat?: string;
  outputFormat?: string;
  inputEra?: 'CE' | 'BE';
  outputEra?: 'CE' | 'BE';
}

export interface DateRange {
  start: string;
  end: string;
}
