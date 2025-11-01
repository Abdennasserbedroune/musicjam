import { generateRoomCode, hashPasscode, verifyPasscode } from '@/utils/room';

describe('Room Utils', () => {
  describe('generateRoomCode', () => {
    it('should generate a 6-character code', () => {
      const code = generateRoomCode();
      expect(code).toHaveLength(6);
    });

    it('should generate codes with valid characters only', () => {
      const code = generateRoomCode();
      expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
    });

    it('should generate different codes', () => {
      const code1 = generateRoomCode();
      const code2 = generateRoomCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe('hashPasscode and verifyPasscode', () => {
    it('should hash and verify a passcode correctly', async () => {
      const passcode = 'test123';
      const hash = await hashPasscode(passcode);

      expect(hash).not.toBe(passcode);
      expect(hash).toHaveLength(60);

      const isValid = await verifyPasscode(passcode, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect passcode', async () => {
      const passcode = 'test123';
      const hash = await hashPasscode(passcode);

      const isValid = await verifyPasscode('wrong', hash);
      expect(isValid).toBe(false);
    });
  });
});
