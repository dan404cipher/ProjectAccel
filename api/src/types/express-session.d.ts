import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    // add other session properties here if needed
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session?: import('express-session').Session & Partial<import('express-session').SessionData>;
  }
} 