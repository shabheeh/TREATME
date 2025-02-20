export interface IOtpService {
  sendOTP(email: string, type: string, subject: string): Promise<string>;
  verifyOTP(email: string, otp: string, type: string): Promise<boolean>;
  getOTP(email: string, type: string): Promise<string | null>;
  deleteOTP(email: string, type: string): Promise<void>;
}

export interface ICacheService {
  store(key: string, value: string, ttl: number): Promise<void>;
  delete(key: string): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}
