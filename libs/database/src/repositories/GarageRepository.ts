import { Garage } from "../prisma";
import GarageRepositoryInterface from "./RepositoryInterface";

export class GarageRepository implements GarageRepositoryInterface<Garage> {
  all(): Promise<Garage[]> {
    throw new Error("Method not implemented.");
  }
  find(id: number): Promise<Garage> {
    throw new Error("Method not implemented.");
  }
  create(data: object): Promise<Garage> {
    throw new Error("Method not implemented.");
  }
  update(data: object): Promise<Garage> {
    throw new Error("Method not implemented.");
  }
}
