import { prisma, User } from "../prisma";
import GarageRepositoryInterface from "./RepositoryInterface";

export class UserRepository implements GarageRepositoryInterface<User> {
  // prismaClient:PrismaClient = new PrismaClient();

  all(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  find(id: number): Promise<User> {
    throw new Error("Method not implemented.");
  }

  findByEmail(email: string): Promise<User> {
    return prisma.user.findFirstOrThrow({
      where: { email: email },
      include: {
        vehicles: true,
      },
    });
  }

  create(data: object): Promise<User> {
    throw new Error("Method not implemented.");
  }
  update(data: object): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
