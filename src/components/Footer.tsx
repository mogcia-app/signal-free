export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-700 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* 左ロゴ・紹介 */}
        <div>
          <a
            href="https://signal-ten-livid.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-bold text-gray-900 mb-4 inline-block"
          >
            Signal<span className="text-[#ff8a15]">.</span>
          </a>
          <p className="text-[13px] mb-4">
            オリジナルAIが逆算思考で戦略を専用設計。<br />
            一貫性を持ったPDCAで御社の強みを最大限に活かし、
            SNSを次の成長へつなげます。
          </p>
          <div className="flex space-x-4 text-xs mt-6">
            <a href="https://signal-ten-livid.vercel.app/privacy" className="hover:text-[#ff8a15] transition">
              プライバシーポリシー
            </a>
            <a href="https://signal-ten-livid.vercel.app/terms" className="hover:text-[#ff8a15] transition">
              利用規約
            </a>
          </div>
        </div>

        {/* 右側3カラム */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">

          <div>
            <h4 className="font-bold text-[#ff8a15] mb-4">Service</h4>
            <ul className="space-y-2">
              <li><a href="https://signal-ten-livid.vercel.app/features" className="hover:text-[#ff8a15] transition">機能</a></li>
              <li><a href="https://signal-ten-livid.vercel.app/price" className="hover:text-[#ff8a15] transition">料金</a></li>
              <li><a href="https://signal-ten-livid.vercel.app/flow" className="hover:text-[#ff8a15] transition">導入までの流れ</a></li>
              <li><a href="https://signal-ten-livid.vercel.app/faq" className="hover:text-[#ff8a15] transition">よくある質問</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#ff8a15] mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://mogcia.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ff8a15] transition"
                >
                  運営会社
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#ff8a15] mb-4">Campaigns</h4>
            <ul className="space-y-2">
              <li><a href="https://signal-ten-livid.vercel.app/partners" className="hover:text-[#ff8a15] transition">パートナー制度</a></li>
            </ul>
            <h4 className="font-bold text-[#ff8a15] mt-6 mb-3">お問い合わせ</h4>
            <p className="text-xs mb-1">平日 10:00〜17:00</p>
            <p className="text-xs mb-3">翌営業日にご連絡いたします。</p>
            <p className="text-xs mb-3">
              TEL: <a href="tel:092-517-9804" className="hover:text-[#ff8a15] transition">092-517-9804</a>
            </p>
            <a href="mailto:info@signalapp.jp" className="hover:text-[#ff8a15] text-xs transition">info@signalapp.jp</a>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-100 py-6 text-center text-gray-400 text-xs">
        © 2025 Signal. All rights reserved.
      </div>
    </footer>
  );
}
