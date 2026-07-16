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
  brand: e("Ditto's World"),
  welcome: e("Welcome Beni!"),
  tagline: e("Beni's Pokemon Cards"),

  nav_playground: e("Ditto's Playground"),
  nav_shop: e("Beni's Pokemon Cards"),
  nav_study: e("Ditto's Japanese Class"),

  hero_title: e("Hang around with Ditto and check out Beni's Pokemon cards."),
  hero_sub: e(
    "A cozy little corner of the internet run by Ditto. Play with Ditto, shop Beni's hand-drawn Pokemon cards, and learn Japanese. Feel free to stick around with Ditto for as long as you want!",
  ),
  hero_cta1: e("Play with Ditto"),
  hero_cta2: e("Browse the shop"),

  playground_title: e("Squishy Ditto Playground"),
  playground_sub: e("Click & drag Ditto to squish it. Tap an accessory to dress it up — then drag to reposition."),
  accessory_box: e("Accessory Box"),
  reset: e("Reset Ditto"),
  acc_hat: e("Top Hat"),
  acc_glasses: e("Round Glasses"),
  acc_scarf: e("Cozy Scarf"),
  acc_lollipop: e("Lollipop"),
  acc_detective: e("Detective Hat"),
  acc_pixelshades: e("Pixel Shades"),
  acc_chef: e("Chef's Hat"),
  acc_ribbon: e("Ribbon Bow"),
  acc_crown: e("Golden Crown"),
  acc_beanie: e("Winter Beanie"),
  acc_propeller: e("Propeller Hat"),
  acc_pizza: e("Pizza Slice"),
  acc_pokeball: e("Pokéball"),
  acc_bowtie: e("Bowtie"),
  acc_moustache: e("Moustache"),
  acc_bunnyears: e("Bunny Ears"),
  acc_catears: e("Cat Ears"),
  acc_monocle: e("Monocle"),
  acc_greenscarf: e("Green Scarf"),
  acc_piratehat: e("Pirate Hat"),
  acc_astrohelmet: e("Astronaut Helmet"),
  acc_chocobar: e("Chocolate Bar"),
  acc_sword: e("Toy Sword"),
  acc_rainbowpop: e("Rainbow Lollipop"),
  acc_rubberduck: e("Rubber Duck"),
  acc_boba: e("Boba Milk Tea"),
  acc_balloon: e("Party Balloon"),
  acc_hpglasses: e("Round Specs"),
  acc_diamondcrown: e("Diamond Crown"),
  acc_shortcake: e("Strawberry Shortcake"),

  shop_title: e("Beni's Pokemon Cards"),
  shop_sub: e(
    "Thanks for stopping by. Every card is carefully hand-drawn and designed by Beni. These cards have received much love and enjoyment from customers from San Francisco to Miami! Beni also accepts custom requests.",
  ),
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

  study_title: e("Ditto's Japanese Class"),
  study_sub: e("Welcome to Sensei Ditto's Japanese Classroom. Ready to practice your Japanese?"),
  score: e("Score"),
  streak: e("Streak"),
  next: e("Next question"),
  correct: e("Yay! Ditto is so proud!"),
  wrong: e("Oops, try the next one!"),

  footer: e(
    "Made with squishy love. Ditto is © Nintendo / Game Freak — this is a fan-made shop for Beni's original art.",
  ),
};

const ja: Record<keyof typeof en, Entry> = {
  brand: e("ディットの世界"),
  welcome: e("ようこそ ベニちゃん!"),
  tagline: e(
    "ベニちゃんの手描きカードショップ",
    <>
      ベニちゃんの
      <R k="手描" r="てが" />
      きカードショップ
    </>,
  ),

  nav_playground: e(
    "あそび場",
    <>
      あそび
      <R k="場" r="ば" />
    </>,
  ),
  nav_shop: e(
    "お店",
    <>
      お<R k="店" r="みせ" />
    </>,
  ),
  nav_study: e(
    "メタモンの日本語教室",
    <>
      メタモンの
      <R k="日本語教室" r="にほんごきょうしつ" />
    </>,
  ),

  hero_title: e(
    "メタモンと一緒に遊んで、ベニの手描きポケモンカードをチェックしよう！",
    <>
      メタモンと<R k="一緒" r="いっしょ" />に<R k="遊" r="あそ" />んで、ベニの<R k="手描" r="てが" />きポケモンカードをチェックしよう！
    </>,
  ),
  hero_sub: e(
    "メタモンが運営する、ネットののんびりした小さなコーナー。メタモンと遊んだり、ベニの手描きポケモンカードをお買い物したり、日本語を学んだり。好きなだけメタモンと一緒に過ごしていってね！",
    <>
      メタモンが<R k="運営" r="うんえい" />する、ネットののんびりした<R k="小" r="ちい" />さなコーナー。メタモンと<R k="遊" r="あそ" />んだり、ベニの<R k="手描" r="てが" />きポケモンカードをお<R k="買" r="か" />い<R k="物" r="もの" />したり、<R k="日本語" r="にほんご" />を<R k="学" r="まな" />んだり。<R k="好" r="す" />きなだけメタモンと<R k="一緒" r="いっしょ" />に<R k="過" r="す" />ごしていってね！
    </>,
  ),
  hero_cta1: e("メタモンとあそぶ"),
  hero_cta2: e(
    "お店をみる",
    <>
      お<R k="店" r="みせ" />を みる
    </>,
  ),

  playground_title: e(
    "ぷにぷにメタモン広場",
    <>
      ぷにぷにメタモン
      <R k="広場" r="ひろば" />
    </>,
  ),
  playground_sub: e(
    "メタモンを ひっぱると のびるよ。アクセサリーを タップして、ドラッグで位置を かえてね。",
    <>
      メタモンを ひっぱると のびるよ。アクセサリーを タップして、ドラッグで
      <R k="位置" r="いち" />を かえてね。
    </>,
  ),
  accessory_box: e(
    "アクセサリー箱",
    <>
      アクセサリー
      <R k="箱" r="ばこ" />
    </>,
  ),
  reset: e("リセット"),
  acc_hat: e("シルクハット"),
  acc_glasses: e("まるメガネ"),
  acc_scarf: e("マフラー"),
  acc_lollipop: e("ロリポップ"),
  acc_detective: e("たんていハット", <>たんていハット</>),
  acc_pixelshades: e("ピクセルサングラス"),
  acc_chef: e(
    "コックぼう",
    <>
      コック
      <R k="帽" r="ぼう" />
    </>,
  ),
  acc_ribbon: e("リボン"),
  acc_crown: e("おうかん", <>おうかん</>),
  acc_beanie: e(
    "ニットぼう",
    <>
      ニット
      <R k="帽" r="ぼう" />
    </>,
  ),
  acc_propeller: e(
    "プロペラぼう",
    <>
      プロペラ
      <R k="帽" r="ぼう" />
    </>,
  ),
  acc_pizza: e("ピザ"),
  acc_pokeball: e("モンスターボール"),
  acc_bowtie: e("ちょうネクタイ"),
  acc_moustache: e("くちひげ"),
  acc_bunnyears: e("うさぎのみみ"),
  acc_catears: e("ねこみみ"),
  acc_monocle: e("かためがね"),
  acc_greenscarf: e("みどりのマフラー"),
  acc_piratehat: e(
    "かいぞくぼうし",
    <>
      かいぞく
      <R k="帽" r="ぼう" />し
    </>,
  ),
  acc_astrohelmet: e("うちゅうヘルメット"),
  acc_chocobar: e("チョコレート"),
  acc_sword: e("けん"),
  acc_rainbowpop: e("にじロリポップ"),
  acc_rubberduck: e("アヒルちゃん"),
  acc_boba: e("タピオカ"),
  acc_balloon: e("ふうせん"),
  acc_hpglasses: e("まるメガネ"),
  acc_diamondcrown: e("ダイヤおうかん"),
  acc_shortcake: e("いちごケーキ"),

  shop_title: e(
    "ベニちゃんの手描きカード",
    <>
      ベニちゃんの
      <R k="手描" r="てが" />
      きカード
    </>,
  ),
  shop_sub: e(
    "遊びに来てくれてありがとう。どのカードもベニが心を込めて手描きでデザインしたものです。これらのカードは、サンフランシスコからマイアミまでのお客様にとても愛され、楽しまれています！ベニはカスタムオーダーも受け付けています。",
    <>
      <R k="遊" r="あそ" />びに<R k="来" r="き" />てくれてありがとう。どのカードもベニが<R k="心" r="こころ" />を<R k="込" r="こ" />めて<R k="手描" r="てが" />きでデザインしたものです。これらのカードは、サンフランシスコからマイアミまでのお<R k="客様" r="きゃくさま" />にとても<R k="愛" r="あい" />され、<R k="楽" r="たの" />しまれています！ベニはカスタムオーダーも<R k="受" r="う" />け<R k="付" r="つ" />けています。
    </>,
  ),
  price_label: e(
    "価格",
    <>
      <R k="価格" r="かかく" />
    </>,
  ),
  available: e(
    "販売中",
    <>
      <R k="販売中" r="はんばいちゅう" />
    </>,
  ),
  sold_out: e(
    "売り切れ",
    <>
      <R k="売" r="う" />り<R k="切" r="き" />れ
    </>,
  ),
  view_card: e(
    "カードを見る",
    <>
      カードを
      <R k="見" r="み" />る
    </>,
  ),
  inquire: e(
    "買う / 相談する",
    <>
      <R k="買" r="か" />う / <R k="相談" r="そうだん" />
      する
    </>,
  ),
  close: e(
    "閉じる",
    <>
      <R k="閉" r="と" />
      じる
    </>,
  ),
  order_title: e("このカードを おうちへ", <>この カードを おうちへ</>),
  order_sub: e(
    "少しだけ 自己紹介してくれたら、ベニちゃんが お返事するよ。",
    <>
      <R k="少" r="すこ" />
      しだけ <R k="自己紹介" r="じこしょうかい" />
      してくれたら、ベニちゃんが お<R k="返事" r="へんじ" />
      するよ。
    </>,
  ),
  name: e(
    "お名前",
    <>
      お<R k="名前" r="なまえ" />
    </>,
  ),
  email: e("メール"),
  message: e("メッセージ"),
  name_ph: e("ベニちゃんの大ファン", ""),
  email_ph: e("you@example.com", ""),
  message_ph: e("こんにちは ベニちゃん!このカードが…", ""),
  send: e(
    "ベニちゃんに送る",
    <>
      ベニちゃんに
      <R k="送" r="おく" />る
    </>,
  ),
  sending: e(
    "送信中…",
    <>
      <R k="送信中" r="そうしんちゅう" />…
    </>,
  ),
  thanks_title: e("ありがとう!"),
  thanks_sub: e(
    "メタモンが ベニちゃんに メッセージを 届けているよ!",
    <>
      メタモンが ベニちゃんに メッセージを <R k="届" r="とど" />
      けているよ!
    </>,
  ),

  study_title: e(
    "メタモンの日本語教室",
    <>
      メタモンの
      <R k="日本語教室" r="にほんごきょうしつ" />
    </>,
  ),
  study_sub: e(
    "メタモン先生の日本語教室へようこそ！日本語の練習をする準備はできた？",
    <>
      メタモン<R k="先生" r="せんせい" />の<R k="日本語教室" r="にほんごきょうしつ" />へようこそ！<R k="日本語" r="にほんご" />の<R k="練習" r="れんしゅう" />をする<R k="準備" r="じゅんび" />はできた？
    </>,
  ),
  score: e("スコア"),
  streak: e(
    "連続",
    <>
      <R k="連続" r="れんぞく" />
    </>,
  ),
  next: e(
    "次の問題",
    <>
      <R k="次" r="つぎ" />の<R k="問題" r="もんだい" />
    </>,
  ),
  correct: e(
    "正解!メタモン大喜び!",
    <>
      <R k="正解" r="せいかい" />
      !メタモン
      <R k="大喜" r="おおよろこ" />
      び!
    </>,
  ),
  wrong: e(
    "残念!次がんばろう!",
    <>
      <R k="残念" r="ざんねん" />!<R k="次" r="つぎ" />
      がんばろう!
    </>,
  ),

  footer: e(
    "ぷにぷにな愛をこめて。メタモンは © 任天堂 / ゲームフリーク — ベニちゃんの手描き作品を集めた ファンショップです。",
    <>
      ぷにぷにな
      <R k="愛" r="あい" />
      をこめて。メタモンは © <R k="任天堂" r="にんてんどう" /> / ゲームフリーク — ベニちゃんの
      <R k="手描" r="てが" />き<R k="作品" r="さくひん" />を あつめた ファンショップです。
    </>,
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
