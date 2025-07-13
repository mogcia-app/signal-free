import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getFirestore } from "firebase-admin/firestore";
import "@/lib/firebase-admin-init";

const db = getFirestore();
const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sns, currentFollowers, targetFollowers,
      targetAudience, snsGoal, brandConcept,
      industry, email
    } = body;

    // 🛡️ 簡易サニタイズ
    const safeSns = (sns || "").slice(0, 30);
    const safeTargetAudience = (targetAudience || "").slice(0, 100);
    const safeSnsGoal = (snsGoal || "").slice(0, 100);
    const safeBrandConcept = (brandConcept || "").slice(0, 200);
    const safeIndustry = (industry || "").slice(0, 100);
    const safeEmail = (email || "").slice(0, 200);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (process.env.NODE_ENV !== "development") {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentIp = await db.collection("snsDiagnosisLogs")
        .where("ip", "==", ip)
        .where("createdAt", ">", oneHourAgo)
        .limit(1)
        .get();

      if (!recentIp.empty) {
        return NextResponse.json({
          success: false,
          error: "同一IPでは1時間に1回まで診断可能です。"
        }, { status: 429 });
      }
    }

    const existing = await db.collection("snsDiagnosisLogs")
      .where("email", "==", safeEmail)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({
        success: false,
        error: "このメールアドレスは既に診断済みです。"
      }, { status: 400 });
    }

    const current = Math.max(parseInt(currentFollowers || "0", 10), 0);
    const target = Math.max(parseInt(targetFollowers || "0", 10), 0);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      return NextResponse.json({ success: false, error: "正しいメールアドレスを入力してください" }, { status: 400 });
    }

    const prompt = `...`; // 省略（ここは今のコードのままでOK）

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800
    });

    let aiData: unknown = {};
    try {
      const cleaned = aiRes.choices[0].message.content
        ?.replace(/```[a-z]*\n?/gi, "")
        .replace(/```/g, "")
        .trim();
      aiData = JSON.parse(cleaned || "{}");
    } catch {
      return NextResponse.json({ success: false, error: "AIレスポンス解析に失敗" }, { status: 500 });
    }

    await db.collection("snsDiagnosisLogs").add({
      sns: safeSns, current, target,
      targetAudience: safeTargetAudience,
      snsGoal: safeSnsGoal,
      brandConcept: safeBrandConcept,
      industry: safeIndustry,
      email: safeEmail,
      ip,
      aiStrategy: aiData,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, data: aiData });

  } catch (err) {
    return NextResponse.json({ success: false, error: "診断に失敗しました" }, { status: 500 });
  }
}
