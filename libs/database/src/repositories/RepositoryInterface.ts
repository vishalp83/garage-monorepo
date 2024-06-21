export default interface GarageRepositoryInterface<T> {
    all(): Promise<T[]>;
    find(id: number): Promise<T>;
    create(data: object): Promise<T>;
    update(data: object): Promise<T>;
  }