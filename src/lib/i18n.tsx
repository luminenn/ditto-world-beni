import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "ja";

export const translations = {
  en: {
    brand: "Dittoland",
    welcome: "Welcome Beni!",
    nav_playground: "Playground",
    nav_gallery: "Gallery",
    nav_study: "Study Corner",
    hero_title: "Squish, stretch & style a jelly Ditto",
    hero_sub: "A cozy little corner of the internet where a wobbly pink blob is the star. Poke it. Dress it up. Learn a word or two.",
    hero_cta1: "Play with Ditto",
    hero_cta2: "Peek at fanart",
    playground_title: "Squishy Ditto Playground",
    playground_sub: "Click & drag Ditto to squish it. Tap an accessory to add it — then drag to reposition!",
    accessory_box: "Accessory Box",
    reset: "Reset Ditto",
    acc_hat: "Top Hat",
    acc_glasses: "Silly Glasses",
    acc_scarf: "Cozy Scarf",
    acc_lolli: "Lollipop",
    gallery_title: "Ditto Fanart Gallery",
    gallery_sub: "A little gallery of Ditto scenes drawn by imaginary friends.",
    like: "Like",
    close: "Close",
    study_title: "Ditto's Japanese School",
    study_sub: "Pick the right meaning. Ditto cheers when you're right!",
    score: "Score",
    streak: "Streak",
    next: "Next question",
    correct: "Yay! Ditto is so proud!",
    wrong: "Oops, try the next one!",
    footer: "Made with squishy love. Ditto is © Nintendo / Game Freak — this is a fan playground.",
    scene_a: "Ditto napping in a teacup",
    scene_b: "Ditto pretending to be a cat",
    scene_c: "Ditto at the ramen shop",
    scene_d: "Ditto on a rainy day",
    scene_e: "Ditto stargazing",
    scene_f: "Ditto as a mochi",
  },
  ja: {
    brand: "メタモンのひろば",
    nav_playground: "あそぼう",
    nav_gallery: "ギャラリー",
    nav_study: "べんきょう",
    hero_title: "ぷにぷにメタモンで あそぼう",
    hero_sub: "ちいさな ピンクの ぷにぷにが しゅやくの おうち。つついて、きせかえて、ことばも おぼえよう。",
    hero_cta1: "メタモンとあそぶ",
    hero_cta2: "ファンアートをみる",
    playground_title: "ぷにぷにメタモン ひろば",
    playground_sub: "メタモンを ひっぱると のびる!アクセサリーを タップして、ドラッグで いちを かえてね。",
    accessory_box: "アクセサリー ばこ",
    reset: "リセット",
    acc_hat: "シルクハット",
    acc_glasses: "まるメガネ",
    acc_scarf: "マフラー",
    acc_lolli: "ペロペロキャンディ",
    gallery_title: "メタモン ファンアート",
    gallery_sub: "そうぞうの おともだちが えがいた メタモンの ばめん。",
    like: "すき!",
    close: "とじる",
    study_title: "メタモンの にほんごきょうしつ",
    study_sub: "ただしい いみを えらんでね。せいかいで メタモンが よろこぶよ!",
    score: "スコア",
    streak: "れんぞく",
    next: "つぎのもんだい",
    correct: "せいかい!メタモン だいよろこび!",
    wrong: "ざんねん!つぎ がんばろう!",
    footer: "ぷにぷにな あいを こめて。メタモンは © 任天堂 / ゲームフリーク — ファンサイトです。",
    scene_a: "ティーカップで おひるね",
    scene_b: "ねこの ふりをする メタモン",
    scene_c: "ラーメンやさんの メタモン",
    scene_d: "あめの ひの メタモン",
    scene_e: "ほしを みる メタモン",
    scene_f: "おもちに なった メタモン",
  },
} as const;

export type TKey = keyof typeof translations["en"];

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => translations.en[k],
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = (k: TKey) => translations[lang][k];
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
