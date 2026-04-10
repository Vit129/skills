// Template: Phone Validation Helper
// Category: Validation
// Usage: expect(PhoneValidator.isValid(phone)).toBe(true)

/**
 * PhoneValidator - Class for validating phone numbers
 * Supports Thai mobile, Thai landline, and International format
 * 
 * ✅ SUPPORTED FORMATS:
 * - Thai Mobile: 08x, 09x, 06x (10 digits)
 * - Thai Landline: 02x, 03x, 04x, 05x, 07x (9-10 digits)
 * - International: +66xxxxxxxxx, +1xxxxxxxxxx
 * 
 * @example
 * PhoneValidator.isValid('0812345678') // true (Thai mobile)
 * PhoneValidator.isValid('+66812345678') // true (International)
 */
export class PhoneValidator {

  // ===== Regex Patterns =====

  /**
   * Thai mobile pattern (08x, 09x, 06x - 10 digits)
   */
  static readonly THAI_MOBILE_PATTERN = /^0[689]\d{8}$/;

  /**
   * Thai phone pattern (Includes landline and mobile - 9-10 digits)
   */
  static readonly THAI_PHONE_PATTERN = /^0\d{8,9}$/;

  /**
   * Thai landline pattern (02, 03, 04, 05, 07 - 9 digits)
   */
  static readonly THAI_LANDLINE_PATTERN = /^0[2-5,7]\d{7}$/;

  /**
   * International pattern (+country code + number)
   */
  static readonly INTERNATIONAL_PATTERN = /^\+\d{1,3}\d{6,14}$/;

  /**
   * Thai international format (+66)
   */
  static readonly THAI_INTERNATIONAL_PATTERN = /^\+66[689]\d{8}$/;

  // ===== 🔥 MAIN: Validation Methods =====

  /**
   * 🔥 MAIN: Validate phone number (Supports all formats)
   * @param phone - Phone number (supports dash, space)
   * @param type - Type: 'any' | 'mobile' | 'landline' | 'international' (default: 'any')
   * @returns boolean - true if phone is valid
   * 
   * @example
   * PhoneValidator.isValid('081-234-5678') // true
   * PhoneValidator.isValid('0812345678', 'mobile') // true
   * PhoneValidator.isValid('+66812345678', 'international') // true
   */
  static isValid(phone: string, type: 'any' | 'mobile' | 'landline' | 'international' = 'any'): boolean {
    if (!phone || typeof phone !== 'string') return false;

    const cleaned = this.clean(phone);

    switch (type) {
      case 'mobile': return this.THAI_MOBILE_PATTERN.test(cleaned);
      case 'landline': return this.THAI_LANDLINE_PATTERN.test(cleaned);
      case 'international': return this.INTERNATIONAL_PATTERN.test(phone.replace(/[-\s]/g, ''));
      case 'any':
      default:
        return this.THAI_PHONE_PATTERN.test(cleaned) ||
          this.INTERNATIONAL_PATTERN.test(phone.replace(/[-\s]/g, ''));
    }
  }

  /**
   * Validate Thai mobile number (08x, 09x, 06x)
   */
  static isThaiMobile(phone: string): boolean {
    return this.isValid(phone, 'mobile');
  }

  /**
   * Validate Thai phone number (Includes landline)
   */
  static isThaiPhone(phone: string): boolean {
    return this.THAI_PHONE_PATTERN.test(this.clean(phone));
  }

  /**
   * Validate Thai landline number (02, 03, 04, 05, 07)
   */
  static isThaiLandline(phone: string): boolean {
    return this.isValid(phone, 'landline');
  }

  /**
   * Validate international format
   */
  static isInternational(phone: string): boolean {
    return this.isValid(phone, 'international');
  }

  // ===== Utility Methods =====

  /**
   * Remove dash, space, and parentheses from phone number
   */
  static clean(phone: string): string {
    return phone.replace(/[-\s()]/g, '');
  }

  /**
   * Format Thai phone number as xxx-xxx-xxxx
   * @example PhoneValidator.formatThai('0812345678') // '081-234-5678'
   */
  static formatThai(phone: string): string {
    const cleaned = this.clean(phone);
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
    }
    return phone;
  }

  /**
   * Convert Thai phone number to international format (+66)
   * @example PhoneValidator.toInternational('0812345678') // '+66812345678'
   */
  static toInternational(phone: string): string {
    const cleaned = this.clean(phone);
    if (cleaned.startsWith('0')) {
      return '+66' + cleaned.slice(1);
    }
    return phone;
  }

  /**
   * Convert international format to Thai phone number
   * @example PhoneValidator.fromInternational('+66812345678') // '0812345678'
   */
  static fromInternational(phone: string): string {
    const cleaned = phone.replace(/[-\s]/g, '');
    if (cleaned.startsWith('+66')) {
      return '0' + cleaned.slice(3);
    }
    return phone;
  }

  /**
   * Get prefix (operator) from mobile number
   * @example PhoneValidator.getPrefix('0812345678') // '081'
   */
  static getPrefix(phone: string): string {
    const cleaned = this.clean(phone);
    return cleaned.slice(0, 3);
  }
}

// ===== Usage Examples =====

/*
import { expect } from '@playwright/test';
import { PhoneValidator } from './apiPhoneValidator.template';

// Variant 1: Phone validation
expect(PhoneValidator.isValid('0812345678')).toBe(true);
expect(PhoneValidator.isValid('081-234-5678')).toBe(true);
expect(PhoneValidator.isThaiMobile('0912345678')).toBe(true);

// Variant 2: Different phone types
PhoneValidator.isValid('0812345678', 'mobile') // true
PhoneValidator.isValid('021234567', 'landline') // true
PhoneValidator.isValid('+66812345678', 'international') // true

// Variant 3: Phone formatting
const formatted = PhoneValidator.formatThai('0812345678'); // '081-234-5678'
const intl = PhoneValidator.toInternational('0812345678'); // '+66812345678'
const local = PhoneValidator.fromInternational('+66812345678'); // '0812345678'

// Variant 4: Get operator prefix
const prefix = PhoneValidator.getPrefix('0812345678'); // '081'
*/
