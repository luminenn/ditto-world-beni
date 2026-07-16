const DITTO_IMG =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png";

type Mood = "happy" | "joy" | "sad" | "wink";

export function DittoSVG({
  size = 240,
  mood: _mood = "happy",
  className = "",
}: {
  size?: number;
  mood?: Mood;
  className?: string;
}) {
  return (
    <img
      src={DITTO_IMG}
      alt="Ditto"
      width={size}
      height={size}
      draggable={false}
      className={`block select-none object-contain ${className}`}
      style={{
        width: size,
        height: size,
        filter: "drop-shadow(4px 6px 0 rgba(74,44,91,0.25))",
      }}
    />
  );
}
