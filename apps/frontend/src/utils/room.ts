import bcrypt from 'bcrypt';

const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const SALT_ROUNDS = 10;

export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * ROOM_CODE_CHARS.length);
    code += ROOM_CODE_CHARS[randomIndex];
  }
  return code;
}

export async function hashPasscode(passcode: string): Promise<string> {
  return bcrypt.hash(passcode, SALT_ROUNDS);
}

export async function verifyPasscode(
  passcode: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(passcode, hash);
}
