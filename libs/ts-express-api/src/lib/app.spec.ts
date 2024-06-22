import { apiTsExpressApi } from "./app";

describe("apiTsExpressApi", () => {
  it("should work", () => {
    expect(apiTsExpressApi()).toEqual("api--ts-express-api");
  });
});
