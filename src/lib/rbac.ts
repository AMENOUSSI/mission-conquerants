import "server-only";
import { auth } from "@/lib/auth";
import { Role } from "@/generated/prisma/client";

/**
 * Role hierarchy per the spec's RBAC matrix (highest first). A role can act
 * at or below its own rank.
 */
const RANK: Record<Role, number> = {
  [Role.SUPER_ADMIN]: 4,
  [Role.ADMIN]: 3,
  [Role.EDITOR]: 2,
  [Role.CONTRIBUTOR]: 1,
};

export class ForbiddenError extends Error {
  constructor(message = "Action non autorisée pour votre rôle.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class UnauthenticatedError extends Error {
  constructor(message = "Connexion requise.") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

/** Throws unless the current session's role is at least `minRole`. Use at the top of every server action / route handler that mutates data. */
export async function requireRole(minRole: Role) {
  const session = await auth();
  if (!session?.user) throw new UnauthenticatedError();
  if (RANK[session.user.role] < RANK[minRole]) throw new ForbiddenError();
  return session.user;
}

/** Throws unless a session exists; returns the user. Use for any authenticated (but role-agnostic) admin read. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new UnauthenticatedError();
  return session.user;
}

export function canManageUsers(role: Role) {
  return RANK[role] >= RANK[Role.ADMIN];
}

export function canPublish(role: Role) {
  return RANK[role] >= RANK[Role.EDITOR];
}

export function canConfigureSite(role: Role) {
  return role === Role.SUPER_ADMIN;
}

/**
 * Content authorization for Pages/Posts/Events/Projects, per the spec's RBAC
 * matrix: Contributors can only create/edit their OWN drafts and can never
 * publish; Editors and above can edit anything and set any status.
 *
 * Throws if the current user may not touch this content at all. Returns the
 * user plus a `status` override to apply — Contributors always get forced
 * back to DRAFT regardless of what they submitted.
 */
export async function requireContentAccess(existingAuthorId?: string) {
  const user = await requireUser();
  const isEditorOrAbove = canPublish(user.role);

  if (!isEditorOrAbove) {
    if (existingAuthorId && existingAuthorId !== user.id) {
      throw new ForbiddenError("Vous ne pouvez modifier que vos propres contenus.");
    }
  }

  return { user, forceDraft: !isEditorOrAbove };
}
