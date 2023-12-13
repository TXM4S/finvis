import { mutateStockData } from "../src/index";

describe("mutateStockData", () => {
  it("should fill in missing days with null values", () => {
    const from = "2022-01-01";
    const to = "2022-01-05";
    const response = [
      { t: Date.parse("2022-01-01"), c: 100 },
      { t: Date.parse("2022-01-03"), c: 200 },
      { t: Date.parse("2022-01-05"), c: 300 },
    ];

    const result = mutateStockData({ from, to, response });

    expect(result).toEqual([
      { t: Date.parse("2022-01-01"), c: 100, ec: null },
      { t: Date.parse("2022-01-02"), c: null, ec: 100 },
      { t: Date.parse("2022-01-03"), c: 200, ec: null },
      { t: Date.parse("2022-01-04"), c: null, ec: 200 },
      { t: Date.parse("2022-01-05"), c: 300, ec: null },
    ]);
  });
});
