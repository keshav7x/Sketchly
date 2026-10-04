export interface UpdateProfileInput {
  name?: string;
  image?: string | null;
}

export interface UserIdInput {
  id: string;
}

export interface SessionIdInput {
  sessionId: string;
}

export interface SessionTokenInput {
  token: string;
}

export interface RevokeSessionInput {
  sessionId: string;
  requestingUserId: string;
}
