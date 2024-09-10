import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      address: string;
      date_joined: Date;
      last_update: Date;
      is_active: boolean;
      is_staff: boolean;
      balance: number,
      interest: number,
      profit: number,
      accessToken: string;
      refreshToken: string;
    };
  }
}
