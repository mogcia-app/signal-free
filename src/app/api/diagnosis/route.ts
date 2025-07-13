import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getFirestore } from "firebase-admin/firestore";
import "@/lib/firebase-admin-init"; // adminSDK初期化

const db = getFirestore();
const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let {
      sns, currentFollowers, targetFollowers,
      targetAudience, snsGoal, brandConcept,
      industry, email
    } = body;

    // 🛡️ 簡易サニタイズ
    sns = (sns || "").slice(0, 30);
    targetAudience = (targetAudience || "").slice(0, 100);
    snsGoal = (snsGoal || "").slice(0, 100);
    brandConcept = (brandConcept || "").slice(0, 200);
    industry = (industry || "").slice(0, 100);
    email = (email || "").slice(0, 200);

    // 🔍 IP取得
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // ✅ 本番環境のみ同一IP制限
    if (process.env.NODE_ENV !== "development") {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentIp = await db.collection("snsDiagnosisLogs")
        .where("ip", "==", ip)
        .where("createdAt", ">", oneHourAgo)
        .limit(1)
        .get();

      if (!recentIp.empty) {
        console.warn(`IP制限: ${ip} 1時間以内の診断済み`);
        return NextResponse.json({
          success: false,
          error: "同一IPでは1時間に1回まで診断可能です。"
        }, { status: 429 });
      }
    }

    // ✅ 同一メール制限
    const existing = await db.collection("snsDiagnosisLogs")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existing.empty) {
      console.warn(`メール制限: ${email} は既に診断済み`);
      return NextResponse.json({
        success: false,
        error: "このメールアドレスは既に診断済みです。"
      }, { status: 400 });
    }

    // 🚀 型チェック + email正規表現
    const current = Math.max(parseInt(currentFollowers || "0", 10), 0);
    const target = Math.max(parseInt(targetFollowers || "0", 10), 0);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "正しいメールアドレスを入力してください" }, { status: 400 });
    }

    // 🤖 OpenAIプロンプト
 const prompt = `
あなたはSNSマーケティングの専門家です。
以下の情報をもとに、${sns}の1ヶ月でフォロワーを${target}人まで増加させるための逆算戦略を提案してください。

- 業種: ${industry}
- ブランドコンセプト: ${brandConcept}
- 現在のフォロワー数: ${current}人
- 1ヶ月後の目標フォロワー数: ${target}人
- ターゲット層: ${targetAudience}
- SNSゴール: ${snsGoal}

【追加条件】
- 目標フォロワー数が現在のフォロワー数より少ない場合は、現状維持または少し増加を目指す戦略を提案してください。
- 現在のフォロワー数と目標フォロワー数の差が極端に大きい場合（10倍以上）、
  リスクを抑えた段階的な増加プランを提案し、短期で達成困難な数字は保守的に解釈してください。
- 無理なバズ狙いや過度な広告依存ではなく、ブランドの世界観やターゲットに合った戦略を重視してください。

【要件】
カスタマージャーニー（認知→興味→比較・検討→行動）に沿って、
各フェーズの「目的」と「主要施策」を1行ずつ簡潔にまとめて
**必ず日本語で** JSON形式で出力してください。

{
  "strategy": { "title": "...", "content": "...", "note": "..." },
  "journeyMap": {
    "認知": { "目的": "...", "施策": "..." },
    "興味": { "目的": "...", "施策": "..." },
    "比較・検討": { "目的": "...", "施策": "..." },
    "行動": { "目的": "...", "施策": "..." }
  }
}
説明文は不要。このJSONのみを返してください。
`.trim();
    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800
    });

    console.log("AI raw response:", aiRes.choices[0].message.content);

    // 🔥 JSONパース
    let aiData: any = {};
    try {
      const cleaned = aiRes.choices[0].message.content
        ?.replace(/```[a-z]*\n?/gi, "")
        .replace(/```/g, "")
        .trim();
      aiData = JSON.parse(cleaned || "{}");
    } catch (err) {
      console.error("AI JSON parse error:", err);
      return NextResponse.json({ success: false, error: "AIレスポンス解析に失敗" }, { status: 500 });
    }

    // ✅ Firestore保存
    await db.collection("snsDiagnosisLogs").add({
      sns, current, target, targetAudience, snsGoal, brandConcept, industry, email,
      ip,
      aiStrategy: aiData,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      data: aiData
    });

  } catch (err) {
    console.error("診断API全体エラー:", err);
    return NextResponse.json({ success: false, error: "診断に失敗しました" }, { status: 500 });
  }
}
