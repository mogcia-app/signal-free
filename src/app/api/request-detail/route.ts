import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import "@/lib/firebase-admin-init";

const db = getFirestore();

// 型定義
interface DetailRequestData {
  sns: string;
  currentFollowers: string;
  targetFollowers: string;
  targetAudience: string;
  snsGoal: string;
  brandConcept: string;
  industry: string;
  email: string;
  accountName?: string;
  aiResult?: unknown;  // JSONは unknown で受けてOK
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DetailRequestData;

    const {
      sns, currentFollowers, targetFollowers,
      targetAudience, snsGoal, brandConcept,
      industry, email, accountName, aiResult
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
      aiResult,
      requestedAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("request-detail API エラー:", err);
    return NextResponse.json({ success: false, error: "保存に失敗しました" }, { status: 500 });
  }
}
