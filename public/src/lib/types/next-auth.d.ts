import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      date_joined: Date;
      last_joined: Date;
      is_active: boolean;
      is_staff: boolean;
      accessToken: string;
      refreshToken: string;
    };
  }
}
