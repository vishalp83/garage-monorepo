import { prisma, Vehicle } from "../prisma";
import GarageRepositoryInterface from "./RepositoryInterface";

export class VehiclesRepository implements GarageRepositoryInterface<Vehicle> {
  all(): Promise<Vehicle[]> {
    throw new Error("Method not implemented.");
  }
  find(id: number): Promise<Vehicle> {
    throw new Error("Method not implemented.");
  }
  create(data: object): Promise<Vehicle> {
    throw new Error("Method not implemented.");
  }
  update(data: object): Promise<Vehicle> {
    throw new Error("Method not implemented.");
  }

  findAllForUserId(id: number): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      where: { user_id: id },
    });
  }
}
