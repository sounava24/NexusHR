import { prisma } from "@/lib/prisma"

export async function logAction({
  action,
  entity,
  entityId,
  userId,
  changes,
}: {
  action: string
  entity: string
  entityId: string
  userId?: string
  changes?: never
}) {
  await prisma.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      userId,
      changes,
    },
  })
}