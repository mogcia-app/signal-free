import { initializeApp, cert, getApps } from "firebase-admin/app";

console.log("🔥 privateKey(ENV RAW):", process.env.FIREBASE_PRIVATE_KEY);
console.log("🔥 privateKey(REPLACED):", process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'));

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
