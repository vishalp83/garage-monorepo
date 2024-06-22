import { Mod } from "../prisma";
import GarageRepositoryInterface from "./RepositoryInterface";

export class ModsRepository implements GarageRepositoryInterface<Mod> {
  all(): Promise<Mod[]> {
    throw new Error("Method not implemented.");
  }
  find(id: number): Promise<Mod> {
    throw new Error("Method not implemented.");
  }
  create(data: object): Promise<Mod> {
    throw new Error("Method not implemented.");
  }
  update(data: object): Promise<Mod> {
    throw new Error("Method not implemented.");
  }
}
