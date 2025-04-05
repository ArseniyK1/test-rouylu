import { Prisma } from '@prisma/client';

export class User implements Prisma.userCreateInput {
  id: number;
  full_name: string;
  role: string;
  efficiency: number;
}
