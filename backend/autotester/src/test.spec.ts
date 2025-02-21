const request = require("supertest");

describe("Task 1", () => {
  describe("POST /parse", () => {
    const getTask1 = async (inputStr) => {
      return await request("http://localhost:8080")
        .post("/parse")
        .send({ input: inputStr });
    };


    it("example1", async () => {
      const response = await getTask1("Riz@z RISO00tto!");
      expect(response.body).toStrictEqual({ msg: "Rizz Risotto" });
    });


    it("example2", async () => {
      const response = await getTask1("alpHa-alFRedo");
      expect(response.body).toStrictEqual({ msg: "Alpha Alfredo" });
    });


    it("example3", async () => {
      const response = await getTask1("Skibidi spaghetti");
      expect(response.body).toStrictEqual({ msg: "Skibidi Spaghetti" });
    });


    it("example4", async () => {
      const response = await getTask1("Skibidi   spaghetti");
      expect(response.body).toStrictEqual({ msg: "Skibidi Spaghetti" });
    });


    it("example5", async () => {
      const response = await getTask1("Skibidi___Spaghetti  ");
      expect(response.body).toStrictEqual({ msg: "Skibidi Spaghetti" });
    });


    it("example5", async () => {
      const response = await getTask1("Skibidi Spaghetti");
      expect(response.body).toStrictEqual({ msg: "Skibidi Spaghetti" });
    });


    it("example5", async () => {
      const response = await getTask1("meatball");
      expect(response.body).toStrictEqual({ msg: "Meatball" });
    });


    it("error case", async () => {
      const response = await getTask1("");
      expect(response.status).toBe(400);
    });
  });
});


describe("Task 2", () => {
  describe("POST /entry", () => {
    const putTask2 = async (data) => {
      return await request("http://localhost:8080").post("/entry").send(data);
    };


    it("Add Ingredients", async () => {
      const entries = [
        { type: "ingredient", name: "Eggy", cookTime: 6 },
        { type: "ingredient", name: "Lettuce", cookTime: 1 },
      ];
      for (const entry of entries) {
        const resp = await putTask2(entry);
        expect(resp.status).toBe(200);
        expect(resp.body).toStrictEqual({});
      }
    });


    it("Add Recipe", async () => {
      const meatball = {
        type: "recipe",
        name: "Meatballer",
        requiredItems: [{ name: "Beefer", quantity: 1 }],
      };
      const resp1 = await putTask2(meatball);
      expect(resp1.status).toBe(200);
    });


    it("Congratulations u burnt the pan pt2", async () => {
      const resp = await putTask2({
        type: "ingredient",
        name: "beefer",
        cookTime: -1,
      });
      expect(resp.status).toBe(400);


    });


    it("Congratulations u burnt the pan pt3", async () => {
      const resp = await putTask2({
        type: "pan",
        name: "pan",
        cookTime: 20,
      });
      expect(resp.status).toBe(400);
    });


    it("Unique names", async () => {
      const resp = await putTask2({
        type: "ingredient",
        name: "Beefer",
        cookTime: 10,
      });
      expect(resp.status).toBe(200);


      const resp2 = await putTask2({
        type: "ingredient",
        name: "Beefer",
        cookTime: 8,
      });
      expect(resp2.status).toBe(400);


      const resp3 = await putTask2({
        type: "recipe",
        name: "Beefer",
        cookTime: 8,
      });
      expect(resp3.status).toBe(400);
    });


    it("Unique requiredItems", async () => {
      const resp = await putTask2({
        "type": "recipe",
        "name": "Sussy Salad",
        "requiredItems": [
          {
            "name": "Mayonaise",
            "quantity": 1
          },
          {
            "name": "Lettuce",
            "quantity": 3
          },
        ]
      });
      expect(resp.status).toBe(200);


      const resp2 = await putTask2({
        "type": "recipe",
        "name": "Normal Salad",
        "requiredItems": [
          {
            "name": "Mayonaise",
            "quantity": 1
          },
          {
            "name": "Mayonaise",
            "quantity": 3
          },
        ]
      });
      expect(resp2.status).toBe(400);
    });
  });
});


describe("Task 3", () => {
  describe("GET /summary", () => {
    const postEntry = async (data) => {
      return await request("http://localhost:8080").post("/entry").send(data);
    };


    const getTask3 = async (name) => {
      return await request("http://localhost:8080").get(
        `/summary?name=${name}`
      );
    };


    it("What is bro doing - Get empty cookbook", async () => {
      const resp = await getTask3("nothing");
      expect(resp.status).toBe(400);
    });


    it("What is bro doing - Get ingredient", async () => {
      const resp = await postEntry({
        type: "ingredient",
        name: "beef",
        cookTime: 2,
      });
      expect(resp.status).toBe(200);


      const resp2 = await getTask3("beef");
      expect(resp2.status).toBe(400);
    });


    it("Unknown missing item", async () => {
      const cheese = {
        type: "recipe",
        name: "Cheese",
        requiredItems: [{ name: "Not Real", quantity: 1 }],
      };
      const resp1 = await postEntry(cheese);
      expect(resp1.status).toBe(200);


      const resp2 = await getTask3("Cheese");
      expect(resp2.status).toBe(400);
    });


    it("Bro cooked", async () => {
      const meatball = {
        type: "recipe",
        name: "Skibidi",
        requiredItems: [{ name: "Bruh", quantity: 2 }],
      };
      const resp1 = await postEntry(meatball);
      expect(resp1.status).toBe(200);


      const resp2 = await postEntry({
        type: "ingredient",
        name: "Bruh",
        cookTime: 2,
      });
      expect(resp2.status).toBe(200);


      const resp3 = await getTask3("Skibidi");
      expect(resp3.status).toBe(200);
      expect(resp3.body).toStrictEqual({
        "name": "Skibidi",
        "cookTime": 4,
        "ingredients": [
          {
            "name": "Bruh",
            "quantity": 2
          }
        ]
      });
    });


    it("Bro cooked v2", async () => {
      const spag = {
        type: "recipe",
        name: "Skibidi Spaghetti",
        requiredItems: [
          {
            "name": "Meatball",
            "quantity": 3
          },
          {
            "name": "Pasta",
            "quantity": 1
          },
          {
            "name": "Tomato",
            "quantity": 2
          }
        ],
      };
      const resp1 = await postEntry(spag);
      expect(resp1.status).toBe(200);


      const meatball = {
        type: "recipe",
        name: "Meatball",
        requiredItems: [
          {
            "name": "Beef",
            "quantity": 2
          },
          {
            "name": "Egg",
            "quantity": 1
          }
        ],
      };
      const resp2 = await postEntry(meatball);
      expect(resp2.status).toBe(200);


      const pasta = {
        type: "recipe",
        name: "Pasta",
        requiredItems: [
          {
            "name": "Flour",
            "quantity": 3
          },
          {
            "name": "Egg",
            "quantity": 1
          }
        ],
      };
      const resp3 = await postEntry(pasta);
      expect(resp3.status).toBe(200);


      const beef = {
        "type": "ingredient",
        "name": "Beef",
        "cookTime": 5
      };
      const resp4 = await postEntry(beef);
      expect(resp4.status).toBe(200);


      const flour = {
        "type": "ingredient",
        "name": "Flour",
        "cookTime": 0
      };
      const resp5 = await postEntry(flour);
      expect(resp5.status).toBe(200);


      const egg = {
        "type": "ingredient",
        "name": "Egg",
        "cookTime": 3,
      };
      const resp6 = await postEntry(egg);
      expect(resp6.status).toBe(200);


      const tomato = {
        "type": "ingredient",
        "name": "Tomato",
        "cookTime": 2
      };
      const resp7 = await postEntry(tomato);
      expect(resp7.status).toBe(200);


      const resp8 = await getTask3("Skibidi Spaghetti");
      expect(resp8.status).toBe(200);
      expect(resp8.body).toStrictEqual({
        "name": "Skibidi Spaghetti",
        "cookTime": 46,
        "ingredients": [
          {
            "name": "Beef",
            "quantity": 6
          },
          {
            "name": "Egg",
            "quantity": 4
          },
          {
            "name": "Flour",
            "quantity": 3
          },
          {
            "name": "Tomato",
            "quantity": 2
          }
        ]
      });
    });


    it("Bro cooked v3", async () => {
      const spag = {
        type: "recipe",
        name: "Skibidi Yum",
        requiredItems: [
          {
            "name": "Meat",
            "quantity": 3
          }
        ],
      };
      const resp1 = await postEntry(spag);
      expect(resp1.status).toBe(200);


      const meatball = {
        type: "recipe",
        name: "Meat",
        requiredItems: [
          {
            "name": "beefy",
            "quantity": 2
          },
          {
            "name": "eggy",
            "quantity": 1
          }
        ],
      };
      const resp2 = await postEntry(meatball);
      expect(resp2.status).toBe(200);


      const beef = {
        "type": "ingredient",
        "name": "beefy",
        "cookTime": 5
      };
      const resp4 = await postEntry(beef);
      expect(resp4.status).toBe(200);


      const egg = {
        "type": "ingredient",
        "name": "eggy",
        "cookTime": 3,
      };
      const resp6 = await postEntry(egg);
      expect(resp6.status).toBe(200);


      const resp8 = await getTask3("Skibidi Yum");
      expect(resp8.status).toBe(200);
      expect(resp8.body).toStrictEqual({
        "name": "Skibidi Yum",
        "cookTime": 39,
        "ingredients": [
          {
            "name": "beefy",
            "quantity": 6
          },
          {
            "name": "eggy",
            "quantity": 3
          }
        ]
      });
    });


  });
});



