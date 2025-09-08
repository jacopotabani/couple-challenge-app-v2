import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export const createAuth = (databaseUrl: string) => {
  const client = new MongoClient(databaseUrl);
  const db = client.db("couple_app_db_2");

  return betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [expo()],
    trustedOrigins: ["expo://", "mobile://", "exp://", "http://localhost:3000", "http://192.168.1.169:3000"],
  });
};
