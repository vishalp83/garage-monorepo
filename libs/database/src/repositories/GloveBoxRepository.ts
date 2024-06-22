import { GloveBox } from "../prisma";
import GarageRepositoryInterface from "./RepositoryInterface";

export class GloveBoxRepository implements GarageRepositoryInterface<GloveBox> {
  all(): Promise<GloveBox[]> {
    throw new Error("Method not implemented.");
  }
  find(id: number): Promise<GloveBox> {
    throw new Error("Method not implemented.");
  }
  create(data: object): Promise<GloveBox> {
    throw new Error("Method not implemented.");
  }
  update(data: object): Promise<GloveBox> {
    throw new Error("Method not implemented.");
  }
}
