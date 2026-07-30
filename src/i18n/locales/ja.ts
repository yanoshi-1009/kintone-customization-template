import type { Translations } from "./en";

const ja: Translations = {
  common: { appName: "サンプルアプリ", save: "保存", cancel: "キャンセル" },
  record: {
    updated_one: "{{count}} 件のレコードを更新しました。",
    updated_other: "{{count}} 件のレコードを更新しました。",
    savedBy: "{{name}} が保存しました。"
  },
  error: { fetchFailed: "レコードの取得に失敗しました。({{message}})" }
};

export default ja;
