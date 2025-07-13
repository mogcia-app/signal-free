"use client";
import { useState } from "react";

// ⭐ 型定義
type DiagnosisResult = {
  strategy: {
    title: string;
    content: string;
    note: string;
  };
  journeyMap: {
    [key: string]: {
      目的: string;
      施策: string;
    };
  };
};

export default function Home() {
  const [sns, setSns] = useState("");
  const [currentFollowers, setCurrentFollowers] = useState("");
  const [targetFollowers, setTargetFollowers] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [snsGoal, setSnsGoal] = useState("");
  const [brandConcept, setBrandConcept] = useState("");
  const [industry, setIndustry] = useState("");
  const [email, setEmail] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null); // ⭐ 型つき

  const handleDiagnosis = async () => {
    if (!email) {
      alert("メールアドレスを入力してください");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sns, currentFollowers, targetFollowers,
          targetAudience, snsGoal, brandConcept, industry, email
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "診断に失敗しました");
      } else {
        setResult(data.data);
      }
    } catch (err) {
      console.error("診断エラー:", err);
      alert("診断に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDetailedReport = async () => {
    try {
      await fetch("/api/request-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sns, currentFollowers, targetFollowers,
          targetAudience, snsGoal, brandConcept,
          industry, email, accountName,
          aiResult: result
        })
      });
      alert("レポート依頼を受け付けました。後日メールでお送りします。");
    } catch (err) {
      console.error("詳細レポート依頼エラー:", err);
      alert("依頼に失敗しました");
    }
  };

  return (
    <>
      {/* ====== HEROセクション ====== */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              まずは無料で診断しませんか？
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Signalの計画ページを簡単に体験できます。<br />
              <span className="text-[#ff8a15] font-semibold">
                おひとり様一回まで。
              </span><br />
              簡易版AIですが、無料で御社に合わせたプランの一部をお試し可能です。
            </p>
            <p className="text-sm text-gray-500 mt-6">
              さらに詳しいシミュレーションや戦略レポートも
              無料でお送りできます。
            </p>
          </div>

          <div className="relative flex justify-center md:justify-end">
            <img src="/images/122.svg" alt="計画ページイメージ" className="w-full max-w-sm rounded-lg shadow-lg" />
            <img src="/images/illustration.svg" alt="イラスト" className="absolute bottom-0 right-0 w-1/4 translate-x-1/3 translate-y-1/3" />
          </div>
        </div>
      </section>

      {/* ====== 無料診断フォーム ====== */}
      <main id="diagnosis" className="py-12 px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">無料SNS診断ツール</h2>
          <div className="mb-8 p-4 bg-gray-50 border-l-4 border-[#ff8a15] text-gray-700 text-sm rounded">
            💡 より精度の高い提案を受けるコツ：
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>ターゲット層は具体的に（例: 20代前半・自分磨き好き）</li>
              <li>ブランドコンセプトは1行で特徴的に（例: 高級×親しみやすさ）</li>
              <li>ゴールはなるべく数値やアクションで（例: ECサイト月50件誘導）</li>
            </ul>
          </div>

          <div className="space-y-6 mb-8">
            {/* SNS情報 */}
            <div>
              <h3 className="text-lg font-semibold mb-2 border-b pb-1">SNS情報</h3>
              <select className="w-full border p-3 rounded focus:outline-none focus:border-[#ff8a15] transition mb-3"
                value={sns} onChange={(e) => setSns(e.target.value)}>
                <option value="">利用するSNSを選択</option>
                <option value="Instagram">Instagram</option>
                <option value="X">X (旧Twitter)</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
              </select>
              <label className="block text-sm text-gray-700 font-medium mb-1">現在のフォロワー数</label>
              <input type="number" placeholder="例：500" className="w-full border p-3 rounded focus:border-[#ff8a15] transition"
                value={currentFollowers} onChange={(e) => setCurrentFollowers(e.target.value)} />
              <label className="block text-sm text-gray-700 font-medium mb-1 mt-4">1ヶ月後の目標フォロワー数</label>
              <input type="number" placeholder="例：1000" className="w-full border p-3 rounded focus:border-[#ff8a15] transition"
                value={targetFollowers} onChange={(e) => setTargetFollowers(e.target.value)} />
            </div>

            {/* ターゲット & 目的 */}
            <div>
              <h3 className="text-lg font-semibold mb-2 border-b pb-1">ターゲット & 目的</h3>
              <label className="block text-sm text-gray-700 font-medium mb-1">ターゲット層</label>
              <input type="text" placeholder="例：20代前半・自分磨き好き"
                className="w-full border p-3 rounded focus:border-[#ff8a15] transition"
                value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
              <label className="block text-sm text-gray-700 font-medium mb-1 mt-4">SNSでのゴール</label>
              <input type="text" placeholder="例：ECサイト月50件誘導"
                className="w-full border p-3 rounded focus:border-[#ff8a15] transition"
                value={snsGoal} onChange={(e) => setSnsGoal(e.target.value)} />
            </div>

            {/* 業種 & ブランド */}
            <div>
              <h3 className="text-lg font-semibold mb-2 border-b pb-1">業種 & ブランド情報</h3>
              <label className="block text-sm text-gray-700 font-medium mb-1">業種</label>
              <input type="text" placeholder="例：カフェ"
                className="w-full border p-3 rounded focus:border-[#ff8a15] transition"
                value={industry} onChange={(e) => setIndustry(e.target.value)} />
              <label className="block text-sm text-gray-700 font-medium mb-1 mt-4">ブランドコンセプト</label>
              <input type="text" placeholder="例：シンプル×高級感"
                className="w-full border p-3 rounded focus:border-[#ff8a15] transition"
                value={brandConcept} onChange={(e) => setBrandConcept(e.target.value)} />
            </div>

            {/* メール */}
            <div>
              <h2 className="text-[16px] font-semibold mb-2 text-red-600">※ メールアドレス（必須）</h2>
              <input type="email" placeholder="例：your@email.com"
                className="w-full border p-3 rounded focus:border-[#ff8a15] transition"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <button
            onClick={handleDiagnosis}
            disabled={!email}
            className={`w-full py-3 rounded font-bold transition ${
              email ? "bg-[#ff8a15] text-white hover:bg-orange-600" : "bg-gray-400 text-white cursor-not-allowed"
            }`}>
            {loading ? "診断中..." : "診断する"}
          </button>

          {result && (
            <>
              <div className="mt-10 p-6 border rounded bg-gray-50 space-y-4">
                <h2 className="text-xl font-semibold mb-4">診断結果</h2>
                <div><strong>戦略:</strong> {result.strategy.title}</div>
                <div dangerouslySetInnerHTML={{ __html: toHtmlList(result.strategy.content) }} />
                <div>
                  <strong>カスタマージャーニー:</strong>
                  <ul className="list-disc ml-6">
                    {Object.entries(result.journeyMap).map(([stage, info]) => (
                      <li key={stage}>
                        <strong>{stage}:</strong> {info.目的}
                        <p className="ml-5">- {info.施策}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-center space-y-4">
                <input type="text" placeholder="任意：SNSアカウント名"
                  className="w-full max-w-xs border p-3 rounded focus:border-[#ff8a15] transition"
                  value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                <p className="text-gray-700 mt-4">
                  📈 さらに具体的な改善案（投稿テーマやハッシュタグ例）、
                  <br />目標までの逆算シミュレーション、
                  <br />専用アドバイザーからのレポートを
                  <span className="font-semibold text-[#ff8a15]">無料でお送りできます。</span>
                </p>
                <button
                  onClick={handleRequestDetailedReport}
                  className="px-8 py-3 rounded-full bg-[#ff8a15] text-white hover:bg-orange-600 transition">
                  詳しいレポートを依頼する
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function toHtmlList(text?: string) {
  if (!text) return "";
  const items = text.split("\n").filter(l => l.trim());
  return `<ul class="list-disc ml-6">${items.map(l => `<li>${l.replace(/^\d+[\).]?\s*/, "")}</li>`).join("")}</ul>`;
}
