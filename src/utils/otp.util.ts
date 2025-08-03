export const otpStore: Record<string, string> = {};

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function sendMockOTP(phone: string, otp: string): void {
  console.log(`Mock OTP sent to ${phone}: ${otp}`);
  otpStore[phone] = otp;
}

export function verifyOTP(phone: string, otp: string): boolean {
  return otpStore[phone] === otp;
}
