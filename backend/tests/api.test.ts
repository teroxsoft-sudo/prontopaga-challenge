import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("ProntoPaga API", () => {
  describe("POST /login", () => {
    it("debe autenticar un usuario válido y retornar un JWT", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          username: "user",
          password: "User123!",
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();

      expect(response.body.user).toMatchObject({
        username: "user",
        role: "user",
        rut: "12345678-5",
      });
    });

    it("debe rechazar credenciales incorrectas", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          username: "user",
          password: "incorrecta",
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /score/:rut", () => {
    it("debe rechazar una consulta sin JWT", async () => {
      const response = await request(app).get(
        "/score/12345678-5",
      );

      expect(response.status).toBe(401);
    });

    it("debe permitir al usuario consultar su propio RUT", async () => {
      const loginResponse = await request(app)
        .post("/login")
        .send({
          username: "user",
          password: "User123!",
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get("/score/12345678-5")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);

      expect(response.body).toMatchObject({
        rut: "12.345.678-5",
        score: 61,
      });

      expect(response.body.fecha).toBeDefined();
    });

    it("debe impedir que un usuario consulte otro RUT", async () => {
      const loginResponse = await request(app)
        .post("/login")
        .send({
          username: "user",
          password: "User123!",
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get("/score/76086428-5")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it("debe permitir al administrador consultar cualquier RUT válido", async () => {
      const loginResponse = await request(app)
        .post("/login")
        .send({
          username: "admin",
          password: "Admin123!",
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get("/score/76086428-5")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.rut).toBe("76.086.428-5");

      expect(response.body.score).toBeGreaterThanOrEqual(0);
      expect(response.body.score).toBeLessThanOrEqual(100);
    });

    it("debe rechazar un RUT inválido", async () => {
      const loginResponse = await request(app)
        .post("/login")
        .send({
          username: "admin",
          password: "Admin123!",
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get("/score/12345678-9")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("RUT inválido");
    });

    it("debe retornar siempre el mismo score para el mismo RUT", async () => {
      const loginResponse = await request(app)
        .post("/login")
        .send({
          username: "admin",
          password: "Admin123!",
        });

      const token = loginResponse.body.token;

      const firstResponse = await request(app)
        .get("/score/76086428-5")
        .set("Authorization", `Bearer ${token}`);

      const secondResponse = await request(app)
        .get("/score/76086428-5")
        .set("Authorization", `Bearer ${token}`);

      expect(firstResponse.status).toBe(200);
      expect(secondResponse.status).toBe(200);

      expect(firstResponse.body.score).toBe(
        secondResponse.body.score,
      );
    });
  });
});