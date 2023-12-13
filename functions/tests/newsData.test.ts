import { mutateNewsData } from "../src/index";

describe("mutateNewsData", () => {
  it("should group articles by date", () => {
    const articles = [
      {
        publishedAt: "2022-01-01T12:00:00Z",
        title: "Article 1",
        author: "Author 1",
        source: { id: "1", name: "Source 1" },
        url: "URL 1",
      },
      {
        publishedAt: "2022-01-01T15:00:00Z",
        title: "Article 2",
        author: "Author 2",
        source: { id: "2", name: "Source 2" },
        url: "URL 2",
      },
      {
        publishedAt: "2022-01-02T12:00:00Z",
        title: "Article 3",
        author: "Author 3",
        source: { id: "3", name: "Source 3" },
        url: "URL 3",
      },
    ];

    const result = mutateNewsData(articles);

    expect(result).toEqual({
      [Date.parse("2022-01-01")]: [
        {
          publishedAt: "2022-01-01T12:00:00Z",
          title: "Article 1",
          author: "Author 1",
          source: { id: "1", name: "Source 1" },
          url: "URL 1",
          t: Date.parse("2022-01-01"),
        },
        {
          publishedAt: "2022-01-01T15:00:00Z",
          title: "Article 2",
          author: "Author 2",
          source: { id: "2", name: "Source 2" },
          url: "URL 2",
          t: Date.parse("2022-01-01"),
        },
      ],
      [Date.parse("2022-01-02")]: [
        {
          publishedAt: "2022-01-02T12:00:00Z",
          title: "Article 3",
          author: "Author 3",
          source: { id: "3", name: "Source 3" },
          url: "URL 3",
          t: Date.parse("2022-01-02"),
        },
      ],
    });
  });

  it("should handle real data", () => {
    const articles = [
      {
        title:
          "60 Best Apple Black Friday Deals (2023): iPad, Apple Watch, AirPods",
        author: "Brenda Stolyar",
        source: {
          id: "wired",
          name: "Wired",
        },
        publishedAt: "2023-11-25T22:16:18Z",
        url: "https://www.wired.com/story/best-apple-black-friday-deals-2023-3/",
      },
      {
        title:
          "45 Best Apple Black Friday Deals (2023): iPad, Apple Watch, AirPods",
        author: "Brenda Stolyar",
        source: {
          id: "wired",
          name: "Wired",
        },
        publishedAt: "2023-11-22T21:35:27Z",
        url: "https://www.wired.com/story/best-apple-black-friday-deals-2023-1/",
      },
      {
        title:
          "38 Best Apple Black Friday Deals (2023): iPad, Apple Watch, AirPods",
        author: "Brenda Stolyar",
        source: {
          id: "wired",
          name: "Wired",
        },
        publishedAt: "2023-11-21T14:30:00Z",
        url: "https://www.wired.com/story/best-apple-black-friday-deals-2023/",
      },
    ];

    const result = mutateNewsData(articles);

    expect(result).toEqual({
      [Date.parse("2023-11-25")]: [
        {
          title:
            "60 Best Apple Black Friday Deals (2023): iPad, Apple Watch, AirPods",
          author: "Brenda Stolyar",
          source: {
            id: "wired",
            name: "Wired",
          },
          publishedAt: "2023-11-25T22:16:18Z",
          url: "https://www.wired.com/story/best-apple-black-friday-deals-2023-3/",
          t: Date.parse("2023-11-25"),
        },
      ],
      [Date.parse("2023-11-22")]: [
        {
          title:
            "45 Best Apple Black Friday Deals (2023): iPad, Apple Watch, AirPods",
          author: "Brenda Stolyar",
          source: {
            id: "wired",
            name: "Wired",
          },
          publishedAt: "2023-11-22T21:35:27Z",
          url: "https://www.wired.com/story/best-apple-black-friday-deals-2023-1/",
          t: Date.parse("2023-11-22"),
        },
      ],
      [Date.parse("2023-11-21")]: [
        {
          title:
            "38 Best Apple Black Friday Deals (2023): iPad, Apple Watch, AirPods",
          author: "Brenda Stolyar",
          source: {
            id: "wired",
            name: "Wired",
          },
          publishedAt: "2023-11-21T14:30:00Z",
          url: "https://www.wired.com/story/best-apple-black-friday-deals-2023/",
          t: Date.parse("2023-11-21"),
        },
      ],
    });
  });

  // it('should handle empty array', () => {
  //     const articles = [];

  //     const result = mutateNewsData(articles);

  //     expect(result).toEqual({});
  // });
});
