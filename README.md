<div align="center">

# 📋 B2B Shift Management System
### 〜 実務の現場を想定した高度なシフト希望提出・承認・管理Webアプリケーション 〜

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

[🌐 デモサイトはこちら](https://shift-management-app-nine-psi.vercel.app/)

</div>

---

## 💡 アプリケーションの概要 (Overview)

店舗や企業のバックオフィス業務において不可欠な**「シフト管理・承認プロセス」**をデジタル化し、効率化することを目指して開発したB2B向けWebアプリケーションです。

単なるスケジュール登録に留まらず、ロール（権限）に応じた画面切り替え、マルチアカウント対応、データ可視化など、実運用を意識した堅牢な設計を取り入れています。

---

## ✨ 主な機能とこだわり（Features）

* **👥 ロールベースの権限管理 ＆ マルチスタッフ対応**
  * ゲスト、スタッフ、管理者への権限分岐（RBAC）に加え、複数スタッフの切り替えに対応。実運用に近いマルチユーザー環境を再現。
* **📅 動的月間カレンダービュー（自作コンポーネント）**
  * 外部ライブラリに依存せず、JavaScriptの `Date` オブジェクトと配列操作を駆使して月間カレンダーグリッドをスクラッチ実装。視覚的なスケジュール確認を実現。
* **📊 リアルタイム集計サマリーカード**
  * スタッフおよび管理者ダッシュボードに、提出総数や承認状況をリアルタイムで算出・表示するカードを搭載。
* **📥 CSV一括エクスポート機能（文字化け対策済み）**
  * 検索・ステータスフィルターで絞り込んだデータを、Excelでの文字化けを防ぐUTF-8（BOM付与）形式でワンクリックダウンロード。
* **🔔 インタラクティブなトースト通知 ＆ 永続化**
  * ユーザーの操作に対して的確にフィードバックを返すポップアップ通知と、`localStorage` による堅牢なデータ永続化。

---

## 🛠️ 使用技術 (Tech Stack)

| カテゴリ | 技術・ツール |
| :--- | :--- |
| **Frontend** | React (Vite), TypeScript, Tailwind CSS |
| **State / Storage** | React Hooks, Browser LocalStorage |
| **Deployment** | Vercel |
| **Tools** | Git / GitHub, VS Code |

---

## 📂 ディレクトリ構成 (Directory Structure)

```text
📦 shift-management-app
 ┣ 📂 src/
 ┃  ┣ 📂 components/   # AdminDashboard, StaffDashboard, Login
 ┃  ┣ 📂 assets/       # 画像・アイコン等のリソース
 ┃  ┣ 📜 App.tsx       # ルーティング・状態管理・トースト管理
 ┃  ┣ 📜 types.ts      # TypeScript 型定義
 ┃  ┣ 📜 index.css     # Tailwind CSS 設定
 ┃  ┗ 📜 main.tsx      # エントリーポイント
 ┣ 📜 package.json
 ┗ 📜 tailwind.config.js
