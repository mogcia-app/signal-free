import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import "@/lib/firebase-admin-init";

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sns, currentFollowers, targetFollowers,
      targetAudience, snsGoal, brandConcept,
      industry, email, accountName, aiResult // ⭐ aiResult 追加
    } = body;

    await db.collection("snsDetailedRequests").add({
      sns,
      currentFollowers,
      targetFollowers,
      targetAudience,
      snsGoal,
      brandConcept,
      industry,
      email,
      accountName,
      aiResult, // ⭐ ここで保存
      requestedAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("request-detail API エラー:", err);
    return NextResponse.json({ success: false, error: "保存に失敗しました" }, { status: 500 });
  }
}
