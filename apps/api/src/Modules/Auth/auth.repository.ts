import { and, eq, lt } from "drizzle-orm";
import { db } from "../../db";
import { account, session, user, verification } from "../../lib/auth-schema";

export type AuthUserInsert = typeof user.$inferInsert;
export type AuthUserSelect = typeof user.$inferSelect;

export type AuthSessionInsert = typeof session.$inferInsert;
export type AuthSessionSelect = typeof session.$inferSelect;

export type AuthAccountInsert = typeof account.$inferInsert;
export type AuthAccountSelect = typeof account.$inferSelect;

export type AuthVerificationInsert = typeof verification.$inferInsert;
export type AuthVerificationSelect = typeof verification.$inferSelect;

type DbClient = typeof db;

export class AuthRepository {
  constructor(private readonly dbClient: DbClient = db) {}

  createUser = async (data: AuthUserInsert): Promise<AuthUserSelect> => {
    const [created] = await this.dbClient
      .insert(user)
      .values(data)
      .returning();

    if (!created) throw new Error("Failed to create user");
    return created;
  };

  findUserById = async (id: string): Promise<AuthUserSelect | undefined> => {
    const [found] = await this.dbClient
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);
    return found;
  };

  findUserByEmail = async (
    email: string,
  ): Promise<AuthUserSelect | undefined> => {
    const [found] = await this.dbClient
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    return found;
  };

  userExistsByEmail = async (email: string): Promise<boolean> => {
    const [found] = await this.dbClient
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    return Boolean(found);
  };

  userExistsById = async (id: string): Promise<boolean> => {
    const [found] = await this.dbClient
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, id))
      .limit(1);
    return Boolean(found);
  };

  updateUser = async (
    id: string,
    data: Partial<Pick<AuthUserInsert, "name" | "image" | "emailVerified">>,
  ): Promise<AuthUserSelect | undefined> => {
    const [updated] = await this.dbClient
      .update(user)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();
    return updated;
  };

  setEmailVerified = async (
    id: string,
    verified = true,
  ): Promise<AuthUserSelect | undefined> => {
    const [updated] = await this.dbClient
      .update(user)
      .set({ emailVerified: verified, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();
    return updated;
  };

  deleteUserById = async (
    id: string,
  ): Promise<AuthUserSelect | undefined> => {
    const [deleted] = await this.dbClient
      .delete(user)
      .where(eq(user.id, id))
      .returning();
    return deleted;
  };

  createSession = async (
    data: AuthSessionInsert,
  ): Promise<AuthSessionSelect> => {
    const [created] = await this.dbClient
      .insert(session)
      .values(data)
      .returning();

    if (!created) throw new Error("Failed to create session");
    return created;
  };

  findSessionById = async (
    id: string,
  ): Promise<AuthSessionSelect | undefined> => {
    const [found] = await this.dbClient
      .select()
      .from(session)
      .where(eq(session.id, id))
      .limit(1);
    return found;
  };

  findSessionByToken = async (
    token: string,
  ): Promise<AuthSessionSelect | undefined> => {
    const [found] = await this.dbClient
      .select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);
    return found;
  };

  findSessionsByUserId = async (
    userId: string,
  ): Promise<AuthSessionSelect[]> => {
    return await this.dbClient
      .select()
      .from(session)
      .where(eq(session.userId, userId));
  };

  updateSession = async (
    id: string,
    data: Partial<
      Pick<
        AuthSessionInsert,
        "expiresAt" | "ipAddress" | "userAgent"
      >
    >,
  ): Promise<AuthSessionSelect | undefined> => {
    const [updated] = await this.dbClient
      .update(session)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(session.id, id))
      .returning();
    return updated;
  };

  refreshSessionExpiry = async (
    token: string,
    expiresAt: Date,
  ): Promise<AuthSessionSelect | undefined> => {
    const [updated] = await this.dbClient
      .update(session)
      .set({ expiresAt, updatedAt: new Date() })
      .where(eq(session.token, token))
      .returning();
    return updated;
  };

  deleteSessionById = async (
    id: string,
  ): Promise<AuthSessionSelect | undefined> => {
    const [deleted] = await this.dbClient
      .delete(session)
      .where(eq(session.id, id))
      .returning();
    return deleted;
  };

  deleteSessionByToken = async (
    token: string,
  ): Promise<AuthSessionSelect | undefined> => {
    const [deleted] = await this.dbClient
      .delete(session)
      .where(eq(session.token, token))
      .returning();
    return deleted;
  };

  deleteSessionsByUserId = async (
    userId: string,
  ): Promise<AuthSessionSelect[]> => {
    return await this.dbClient
      .delete(session)
      .where(eq(session.userId, userId))
      .returning();
  };

  deleteExpiredSessions = async (
    now: Date = new Date(),
  ): Promise<AuthSessionSelect[]> => {
    return await this.dbClient
      .delete(session)
      .where(lt(session.expiresAt, now))
      .returning();
  };

  createAccount = async (
    data: AuthAccountInsert,
  ): Promise<AuthAccountSelect> => {
    const [created] = await this.dbClient
      .insert(account)
      .values(data)
      .returning();

    if (!created) throw new Error("Failed to create account");
    return created;
  };

  findAccountById = async (
    id: string,
  ): Promise<AuthAccountSelect | undefined> => {
    const [found] = await this.dbClient
      .select()
      .from(account)
      .where(eq(account.id, id))
      .limit(1);
    return found;
  };

  findAccountsByUserId = async (
    userId: string,
  ): Promise<AuthAccountSelect[]> => {
    return await this.dbClient
      .select()
      .from(account)
      .where(eq(account.userId, userId));
  };

  findAccountByProvider = async (
    providerId: string,
    accountId: string,
  ): Promise<AuthAccountSelect | undefined> => {
    const [found] = await this.dbClient
      .select()
      .from(account)
      .where(
        and(
          eq(account.providerId, providerId),
          eq(account.accountId, accountId),
        ),
      )
      .limit(1);
    return found;
  };

  updateAccount = async (
    id: string,
    data: Partial<
      Pick<
        AuthAccountInsert,
        | "accessToken"
        | "refreshToken"
        | "idToken"
        | "accessTokenExpiresAt"
        | "refreshTokenExpiresAt"
        | "scope"
        | "password"
      >
    >,
  ): Promise<AuthAccountSelect | undefined> => {
    const [updated] = await this.dbClient
      .update(account)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(account.id, id))
      .returning();
    return updated;
  };

  deleteAccountById = async (
    id: string,
  ): Promise<AuthAccountSelect | undefined> => {
    const [deleted] = await this.dbClient
      .delete(account)
      .where(eq(account.id, id))
      .returning();
    return deleted;
  };

  deleteAccountsByUserId = async (
    userId: string,
  ): Promise<AuthAccountSelect[]> => {
    return await this.dbClient
      .delete(account)
      .where(eq(account.userId, userId))
      .returning();
  };

  createVerification = async (
    data: AuthVerificationInsert,
  ): Promise<AuthVerificationSelect> => {
    const [created] = await this.dbClient
      .insert(verification)
      .values(data)
      .returning();

    if (!created) throw new Error("Failed to create verification");
    return created;
  };

  findVerificationById = async (
    id: string,
  ): Promise<AuthVerificationSelect | undefined> => {
    const [found] = await this.dbClient
      .select()
      .from(verification)
      .where(eq(verification.id, id))
      .limit(1);
    return found;
  };

  findVerificationsByIdentifier = async (
    identifier: string,
  ): Promise<AuthVerificationSelect[]> => {
    return await this.dbClient
      .select()
      .from(verification)
      .where(eq(verification.identifier, identifier));
  };

  findVerificationByIdentifierAndValue = async (
    identifier: string,
    value: string,
  ): Promise<AuthVerificationSelect | undefined> => {
    const [found] = await this.dbClient
      .select()
      .from(verification)
      .where(
        and(
          eq(verification.identifier, identifier),
          eq(verification.value, value),
        ),
      )
      .limit(1);
    return found;
  };

  deleteVerificationById = async (
    id: string,
  ): Promise<AuthVerificationSelect | undefined> => {
    const [deleted] = await this.dbClient
      .delete(verification)
      .where(eq(verification.id, id))
      .returning();
    return deleted;
  };

  deleteVerificationsByIdentifier = async (
    identifier: string,
  ): Promise<AuthVerificationSelect[]> => {
    return await this.dbClient
      .delete(verification)
      .where(eq(verification.identifier, identifier))
      .returning();
  };

  deleteExpiredVerifications = async (
    now: Date = new Date(),
  ): Promise<AuthVerificationSelect[]> => {
    return await this.dbClient
      .delete(verification)
      .where(lt(verification.expiresAt, now))
      .returning();
  };
}

const authRepository = new AuthRepository(db);
export default authRepository;
