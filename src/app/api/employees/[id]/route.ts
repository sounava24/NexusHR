export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole(["ADMIN", "HR"])

  const { id } = await params
  const body = await req.json()

  const employee = await prisma.employee.update({
    where: { id },
    data: body,
  })

  return Response.json(employee)
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole(["ADMIN"])

  const { id } = await params

  await prisma.employee.delete({
    where: { id },
  })

  return Response.json({ message: "Deleted" })
}