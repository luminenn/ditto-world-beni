import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "ja";

/** A small ruby helper so JA strings can carry furigana over kanji. */
function R({ k, r }: { k: string; r: string }) {
  return (
    <ruby>
      {k}
      <rt>{r}</rt>
    </ruby>
  );
}

type Entry = { node: ReactNode; text: string };
const e = (text: string, node?: ReactNode): Entry => ({ text, node: node ?? text });

const en = {
  brand: e("Dittoland"),
  welcome: e("Welcome Beni!"),
  tagline: e("Beni's hand-drawn card shop"),

  nav_playground: e("Playground"),
  nav_shop: e("The Shop"),
  nav_study: e("Study Corner"),

  hero_title: e("Squish a jelly Ditto & shop Beni's hand-drawn cards"),
  hero_sub: e("A cozy little corner of the internet where a wobbly pink blob keeps shop. Poke it, dress it up, and take home a one-of-a-kind Pokémon card."),
  hero_cta1: e("Play with Ditto"),
  hero_cta2: e("Browse the shop"),

  playground_title: e("Squishy Ditto Playground"),
  playground_sub: e("Click & drag Ditto to squish it. Tap an accessory to dress it up — then drag to reposition."),
  accessory_box: e("Accessory Box"),
  reset: e("Reset Ditto"),
  acc_hat: e("Top Hat"),
  acc_glasses: e("Round Glasses"),
  acc_scarf: e("Cozy Scarf"),

  shop_title: e("Beni's Hand-Drawn Custom Cards"),
  shop_sub: e("Every card is drawn by hand, one at a time, with lots of love and a little bit of Ditto goo."),
  price_label: e("Price"),
  available: e("Available"),
  sold_out: e("Sold Out"),
  view_card: e("View card"),
  inquire: e("Buy / Inquire"),
  close: e("Close"),
  order_title: e("Take this card home"),
  order_sub: e("Tell Beni a little about yourself and she'll write back soon."),
  name: e("Your name"),
  email: e("Email"),
  message: e("Message"),
  name_ph: e("Beni's biggest fan"),
  email_ph: e("you@example.com"),
  message_ph: e("Hi Beni! I love this card because…"),
  send: e("Send to Beni"),
  sending: e("Sending…"),
  thanks_title: e("Thank you!"),
  thanks_sub: e("Ditto is sending your message to Beni!"),

  study_title: e("Ditto's Japanese School"),
  study_sub: e("Pick the right meaning. Ditto cheers when you're right!"),
  score: e("Score"),
  streak: e("Streak"),
  next: e("Next question"),
  correct: e("Yay! Ditto is so proud!"),
  wrong: e("Oops, try the next one!"),

  footer: e("Made with squishy love. Ditto is © Nintendo / Game Freak — this is a fan-made shop for Beni's original art."),
};

const ja: Record<keyof typeof en, Entry> = {
  brand: e("ディットランド"),
  welcome: e("ようこそ ベニちゃん!"),
  tagline: e(
    "ベニちゃんの手描きカードショップ",
    <>ベニちゃんの<R k="手描" r="てが" />きカードショップ</>,
  ),

  nav_playground: e(
    "あそび場",
    <>あそび<R k="場" r="ば" /></>,
  ),
  nav_shop: e(
    "お店",
    <>お<R k="店" r="みせ" /></>,
  ),
  nav_study: e(
    "勉強コーナー",
    <><R k="勉強" r="べんきょう" />コーナー</>,
  ),

  hero_title: e(
    "ぷにぷにメタモンとベニちゃんの手描きカード",
    <>ぷにぷにメタモンと ベニちゃんの<R k="手描" r="てが" />きカード</>,
  ),
  hero_sub: e(
    "ちいさな ピンクの ぷにぷにが お店番をする ちいさな おうち。つついて、きせかえて、世界にひとつの ポケモンカードを つれて帰ろう。",
    <>ちいさな ピンクの ぷにぷにが お<R k="店番" r="みせばん" />を する ちいさな おうち。つついて、きせかえて、<R k="世界" r="せかい" />に ひとつの ポケモンカードを つれて<R k="帰" r="かえ" />ろう。</>,
  ),
  hero_cta1: e("メタモンとあそぶ"),
  hero_cta2: e(
    "お店をみる",
    <>お<R k="店" r="みせ" />を みる</>,
  ),

  playground_title: e(
    "ぷにぷにメタモン広場",
    <>ぷにぷにメタモン<R k="広場" r="ひろば" /></>,
  ),
  playground_sub: e(
    "メタモンを ひっぱると のびるよ。アクセサリーを タップして、ドラッグで位置を かえてね。",
    <>メタモンを ひっぱると のびるよ。アクセサリーを タップして、ドラッグで<R k="位置" r="いち" />を かえてね。</>,
  ),
  accessory_box: e("アクセサリー箱", <>アクセサリー<R k="箱" r="ばこ" /></>),
  reset: e("リセット"),
  acc_hat: e("シルクハット"),
  acc_glasses: e("まるメガネ"),
  acc_scarf: e("マフラー"),

  shop_title: e(
    "ベニちゃんの手描きカード",
    <>ベニちゃんの<R k="手描" r="てが" />きカード</>,
  ),
  shop_sub: e(
    "一枚ずつ手で描いた、世界にひとつだけのカードです。",
    <><R k="一枚" r="いちまい" />ずつ<R k="手" r="て" />で<R k="描" r="か" />いた、<R k="世界" r="せかい" />に ひとつだけの カードです。</>,
  ),
  price_label: e("価格", <><R k="価格" r="かかく" /></>),
  available: e("販売中", <><R k="販売中" r="はんばいちゅう" /></>),
  sold_out: e("売り切れ", <><R k="売" r="う" />り<R k="切" r="き" />れ</>),
  view_card: e("カードを見る", <>カードを<R k="見" r="み" />る</>),
  inquire: e("買う / 相談する", <><R k="買" r="か" />う / <R k="相談" r="そうだん" />する</>),
  close: e("閉じる", <><R k="閉" r="と" />じる</>),
  order_title: e(
    "このカードを おうちへ",
    <>この カードを おうちへ</>,
  ),
  order_sub: e(
    "少しだけ 自己紹介してくれたら、ベニちゃんが お返事するよ。",
    <><R k="少" r="すこ" />しだけ <R k="自己紹介" r="じこしょうかい" />してくれたら、ベニちゃんが お<R k="返事" r="へんじ" />するよ。</>,
  ),
  name: e("お名前", <>お<R k="名前" r="なまえ" /></>),
  email: e("メール"),
  message: e("メッセージ"),
  name_ph: e("ベニちゃんの大ファン", ""),
  email_ph: e("you@example.com", ""),
  message_ph: e("こんにちは ベニちゃん!このカードが…", ""),
  send: e("ベニちゃんに送る", <>ベニちゃんに<R k="送" r="おく" />る</>),
  sending: e("送信中…", <><R k="送信中" r="そうしんちゅう" />…</>),
  thanks_title: e("ありがとう!"),
  thanks_sub: e(
    "メタモンが ベニちゃんに メッセージを 届けているよ!",
    <>メタモンが ベニちゃんに メッセージを <R k="届" r="とど" />けているよ!</>,
  ),

  study_title: e(
    "メタモンの日本語教室",
    <>メタモンの<R k="日本語教室" r="にほんごきょうしつ" /></>,
  ),
  study_sub: e(
    "正しい意味を えらんでね。正解でメタモンが よろこぶよ!",
    <><R k="正" r="ただ" />しい<R k="意味" r="いみ" />を えらんでね。<R k="正解" r="せいかい" />で メタモンが よろこぶよ!</>,
  ),
  score: e("スコア"),
  streak: e("連続", <><R k="連続" r="れんぞく" /></>),
  next: e("次の問題", <><R k="次" r="つぎ" />の<R k="問題" r="もんだい" /></>),
  correct: e("正解!メタモン大喜び!", <><R k="正解" r="せいかい" />!メタモン<R k="大喜" r="おおよろこ" />び!</>),
  wrong: e("残念!次がんばろう!", <><R k="残念" r="ざんねん" />!<R k="次" r="つぎ" />がんばろう!</>),

  footer: e(
    "ぷにぷにな愛をこめて。メタモンは © 任天堂 / ゲームフリーク — ベニちゃんの手描き作品を集めた ファンショップです。",
    <>ぷにぷにな<R k="愛" r="あい" />をこめて。メタモンは © <R k="任天堂" r="にんてんどう" /> / ゲームフリーク — ベニちゃんの<R k="手描" r="てが" />き<R k="作品" r="さくひん" />を あつめた ファンショップです。</>,
  ),
};

export type TKey = keyof typeof en;

const dicts = { en, ja } as const;

const LangCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => ReactNode;
  ts: (k: TKey) => string;
}>({
  lang: "en",
  setLang: () => {},
  t: (k) => en[k].node,
  ts: (k) => en[k].text,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = (k: TKey) => dicts[lang][k].node;
  const ts = (k: TKey) => dicts[lang][k].text;
  return <LangCtx.Provider value={{ lang, setLang, t, ts }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
