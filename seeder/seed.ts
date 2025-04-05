import { faker } from '@faker-js/faker';
import { PrismaClient, user } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

const createUsers = async (quantity: number) => {
  const users: user[] = [];

  for (let i = 0; i < quantity; i++) {
    const user = await prisma.user.create({
      data: {
        full_name: faker.person.fullName(),
        role: faker.person.jobType(),
        efficiency: faker.number.int({ min: 0, max: 100 }),
      },
    });

    users.push(user);
  }

  console.log(`Created ${users.length} users`);
};

async function main() {
  console.log('Start seeding...');

  await createUsers(500);
}

main()
  .catch((error) => console.error(error))
  .finally(async () => await prisma.$disconnect());
