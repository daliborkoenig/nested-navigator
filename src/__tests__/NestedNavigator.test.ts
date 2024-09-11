import { navigator, NestedNavigator } from "../index"; // Adjust the import path as needed

// Define the type for our test data
type TestData = {
  user: {
    name: string;
    age: number;
    job: undefined;
    address: {
      city: string;
      country: string;
      postalCode?: string;
    };
    hobbies: Array<{ value: string; since?: number }>;
    pets: string[];
    scores: number[];
  };
  settings: {
    theme: "light" | "dark";
    notifications: {
      email: boolean;
      push: boolean;
      frequency: "daily" | "weekly" | "monthly";
    };
    preferences: Array<{ key: string; value: string | number | boolean }>;
  };
  emptyArray: any[];
  nullValue: null;
};

// Create our test data
const testData: TestData = {
  user: {
    name: "John Doe",
    age: 30,
    job: undefined,
    address: {
      city: "New York",
      country: "USA",
    },
    hobbies: [
      { value: "reading", since: 2010 },
      { value: "coding", since: 2015 },
      { value: "traveling" },
    ],
    pets: ["dog", "cat", "pig"],
    scores: [85, 90, 78, 95],
  },
  settings: {
    theme: "dark",
    notifications: {
      email: true,
      push: false,
      frequency: "weekly",
    },
    preferences: [
      { key: "language", value: "en" },
      { key: "currency", value: "USD" },
      { key: "autoSave", value: true },
    ],
  },
  emptyArray: [],
  nullValue: null,
};

describe("NestedNavigator", () => {
  describe("navigateTo method", () => {
    it("should navigate to nested properties", () => {
      expect(navigator(testData).navigateTo("user.name").value()).toBe(
        "John Doe"
      );
      expect(navigator(testData).navigateTo("user.address.city").value()).toBe(
        "New York"
      );
      expect(navigator(testData).navigateTo("settings.theme").value()).toBe(
        "dark"
      );
    });

    it("should handle array indices", () => {
      expect(
        navigator(testData).navigateTo("user.hobbies.1.value").value()
      ).toBe("coding");
      expect(navigator(testData).navigateTo("user.pets.2").value()).toBe("pig");
    });

    it("should handle undefined and null values", () => {
      expect(
        navigator(testData).navigateTo("user.job").value()
      ).toBeUndefined();
      expect(navigator(testData).navigateTo("nullValue").value()).toBeNull();
    });

    // For testing non-existent paths, we need to use a less strictly typed object
    it("should return undefined for non-existent paths", () => {
      const looselyTypedData: any = { ...testData };
      expect(
        navigator(looselyTypedData).navigateTo("user.email").value()
      ).toBeUndefined();
      expect(
        navigator(looselyTypedData)
          .navigateTo("settings.notifications.sms")
          .value()
      ).toBeUndefined();
    });
  });

  describe("find method", () => {
    it("should find elements in arrays of objects", () => {
      const result = navigator(testData)
        .navigateTo("user.hobbies")
        .find("value", "coding")
        .value();
      expect(result).toEqual({ value: "coding", since: 2015 });
    });

    it("should return undefined when element is not found", () => {
      const result = navigator(testData)
        .navigateTo("user.hobbies")
        .find("value", "swimming")
        .value();
      expect(result).toBeUndefined();
    });
  });

  describe("filter method", () => {
    it("should filter elements in arrays of objects", () => {
      const result = navigator(testData)
        .navigateTo("user.hobbies")
        .filter("value", "coding")
        .value();
      expect(result).toEqual([{ value: "coding", since: 2015 }]);
    });

    it("should return an empty array when no elements match", () => {
      const result = navigator(testData)
        .navigateTo("user.hobbies")
        .filter("value", "swimming")
        .value();
      expect(result).toEqual([]);
    });

    it("should handle filtering on nested properties", () => {
      const result = navigator(testData)
        .navigateTo("settings.preferences")
        .filter("value", "USD")
        .value();
      expect(result).toEqual([{ key: "currency", value: "USD" }]);
    });

    it("should return an empty array when filtering an empty array", () => {
      const result = navigator(testData)
        .navigateTo("emptyArray")
        .filter("any", "value")
        .value();
      expect(result).toEqual([]);
    });

    it("should allow chaining after filter", () => {
      const result = navigator(testData)
        .navigateTo("user.hobbies")
        .filter("since", 2015)
        .navigateTo("0.value")
        .value();
      expect(result).toBe("coding");
    });
  });

  describe("getIndex method", () => {
    it("should find index of elements in arrays of objects", () => {
      const index = navigator(testData)
        .navigateTo("user.hobbies")
        .getIndex("value", "coding");
      expect(index).toBe(1);
    });

    it("should return -1 when element is not found", () => {
      const index = navigator(testData)
        .navigateTo("user.hobbies")
        .getIndex("value", "swimming");
      expect(index).toBe(-1);
    });

    it("should return 1 when simple element is found", () => {
      const index = navigator(testData).navigateTo("user.pets").getIndex("cat");
      expect(index).toBe(1);
    });

    it("should return -1 when simple element is not found", () => {
      const index = navigator(testData)
        .navigateTo("user.pets")
        .getIndex("snake");
      expect(index).toBe(-1);
    });
  });

  describe("getLength method", () => {
    it("should return the length of an array", () => {
      const length = navigator(testData).navigateTo("user.hobbies").getLength();
      expect(length).toBe(3);
    });

    it("should return undefined for non-array values", () => {
      const length = navigator(testData).navigateTo("user.name").getLength();
      expect(length).toBeUndefined();
    });
  });

  describe("value method", () => {
    it("should return the current value", () => {
      expect(navigator(testData).navigateTo("user.age").value()).toBe(30);
      expect(
        navigator(testData).navigateTo("settings.notifications").value()
      ).toEqual({
        email: true,
        push: false,
        frequency: "weekly",
      });
    });

    // For testing invalid paths, we need to use a less strictly typed object
    it("should return undefined for invalid paths", () => {
      const looselyTypedData: any = { ...testData };
      expect(
        navigator(looselyTypedData).navigateTo("invalid.path").value()
      ).toBeUndefined();
    });
  });

  describe("chaining methods", () => {
    it("should allow chaining of methods", () => {
      const result = navigator(testData)
        .navigateTo("settings.preferences")
        .find("key", "currency")
        .navigateTo("value")
        .value();
      expect(result).toBe("USD");
    });

    it("should handle chaining with non-existent paths", () => {
      const result = navigator(testData)
        .navigateTo("user.hobbies")
        .find("value", "swimming")
        .navigateTo("since")
        .value();
      expect(result).toBeUndefined();
    });
  });
});
