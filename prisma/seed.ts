import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding Database...")

  // Generate generic password
  const hashedPassword = await bcrypt.hash("password123", 10)

  // 1. Create Default Department
  const defaultDept = await prisma.department.upsert({
    where: { name: "Management" },
    update: {},
    create: { name: "Management" },
  })
  
  const devDept = await prisma.department.upsert({
    where: { name: "Engineering" },
    update: {},
    create: { name: "Engineering" },
  })

  // 2. Create Admin Account
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@flowlytics.com" },
    update: {},
    create: {
      email: "admin@flowlytics.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  await prisma.employee.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      departmentId: defaultDept.id,
      designation: "CEO",
      salary: 150000,
      status: "ACTIVE",
    },
  })

  // 3. Create normal Employee Account
  const normalUser = await prisma.user.upsert({
    where: { email: "employee@flowlytics.com" },
    update: {},
    create: {
      email: "employee@flowlytics.com",
      name: "Test Employee",
      password: hashedPassword,
      role: "EMPLOYEE",
    },
  })

  await prisma.employee.upsert({
    where: { userId: normalUser.id },
    update: {},
    create: {
      userId: normalUser.id,
      departmentId: devDept.id,
      designation: "Software Engineer",
      salary: 80000,
      status: "ACTIVE",
    },
  })

  console.log("Database successfully seeded 🚀")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
