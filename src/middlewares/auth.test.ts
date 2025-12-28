import { describe, expect, it } from 'vitest';
import { commonValidator, paymentValidator } from './auth';

describe('auth middleware', () => {
  describe('commonValidator', () => {
    it('should allow admin users', () => {
      commonValidator({
        is_admin: true, // admin
        is_verified: false,
        is_active: false,
      } as any);
    });

    it('should throw error for unverified users', () => {
      try {
        commonValidator({
          is_admin: false,
          is_verified: false, // unverified
          is_active: true,
        } as any);

        throw new Error('unverified users can pass validation');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('Your account is not verified');
        }
      }
    });

    it('should throw error for inactive users', () => {
      expect(() => {
        commonValidator({
          is_admin: false,
          is_verified: true,
          is_active: false,
        } as any);
      }).toThrow('Your account is not active');
    });
  });

  describe('paymentValidator', () => {
    it('should throw error for users with no subscription', () => {
      try {
        paymentValidator({
          role: 'USER',
          subscription_name: null, // no subscription
          subscription_expires_at: null,
        } as any);
        throw new Error('users with no subscription can pass validation');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe(
            'Your user subscription has expired. Please renew to continue accessing this feature.',
          );
        }
      }
    });
  });
});
