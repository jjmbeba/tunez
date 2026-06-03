import type { GenreDefinition } from "./genre.types";

export const GENRE_DEFINITIONS: GenreDefinition[] = [
  {
    id: "benga",
    name: "Benga",
    description: "Luo guitar-driven rhythms from the lake.",
    heroCopy:
      "Bright guitars, storytelling vocals, and rolling basslines give Benga its unmistakable East African radio identity.",
    heroLabels: ["Lake rhythms", "Guitar-led", "Storytelling"],
    accentColor: "#2D5A27",
    accentColorSoft: "#79A86F",
    featuredArtists: ["D.O. Misiani", "Prince Indah", "Emma Jalamo", "Suzanna Owiyo"],
    relatedGenreIds: ["afro-pop", "taarab"],
    tagAliases: ["benga", "luo", "ohangla", "rumba"],
  },
  {
    id: "gengetone",
    name: "Gengetone",
    description: "Nairobi street sound - raw, bold, unfiltered.",
    heroCopy:
      "Slang-heavy, percussive, and high-energy, Gengetone captures the pulse of Nairobi nightlife and youth culture.",
    heroLabels: ["Street pulse", "Club-ready", "Sheng energy"],
    accentColor: "#C2185B",
    accentColorSoft: "#F06292",
    featuredArtists: ["Ethic", "Sailors", "Rico Gang", "Boondocks Gang"],
    relatedGenreIds: ["genge", "afro-pop"],
    tagAliases: ["gengetone", "gengeton", "sheng", "street"],
  },
  {
    id: "afro-pop",
    name: "Afro-pop",
    description: "Sauti Sol, Nyashinski - modern African pop.",
    heroCopy:
      "Afro-pop blends polished hooks, live instrumentation, and broad crossover appeal into the most radio-friendly lane in the mix.",
    heroLabels: ["Crossover hooks", "Modern pop", "Live texture"],
    accentColor: "#D4A017",
    accentColorSoft: "#F1CB5F",
    featuredArtists: ["Sauti Sol", "Nyashinski", "Bien", "Nameless"],
    relatedGenreIds: ["bongo-flava", "benga"],
    tagAliases: ["afro pop", "afropop", "afrobeats", "afrobeat", "pop", "kenyan pop"],
  },
  {
    id: "genge",
    name: "Genge",
    description: "Early Nairobi hip-hop - the blueprint.",
    heroCopy:
      "Genge laid the groundwork for urban Kenyan radio with coded slang, punchy beats, and a distinctly Nairobi swagger.",
    heroLabels: ["Nairobi roots", "Urban blueprint", "Punchy bars"],
    accentColor: "#E0551F",
    accentColorSoft: "#F18A61",
    featuredArtists: ["Jua Cali", "Nonini", "Kalamashaka", "Mejja"],
    relatedGenreIds: ["gengetone", "afro-pop"],
    tagAliases: ["genge", "kapuka", "hip hop", "hiphop", "rap", "nairobi"],
  },
  {
    id: "taarab",
    name: "Taarab",
    description: "Swahili coastal melodies - poetry in motion.",
    heroCopy:
      "Taarab slows the tempo with lyrical elegance, coastal orchestration, and the ceremonial warmth of Swahili storytelling traditions.",
    heroLabels: ["Coastal poetry", "Orchestral warmth", "Ceremonial flow"],
    accentColor: "#1976D2",
    accentColorSoft: "#64B5F6",
    featuredArtists: ["Culture Musical Club", "Malika", "Siti binti Saad", "Zein L Abdin"],
    relatedGenreIds: ["benga", "bongo-flava"],
    tagAliases: ["taarab", "swahili", "coastal", "mijikenda"],
  },
  {
    id: "bongo-flava",
    name: "Bongo Flava",
    description: "Tanzanian-influenced pop - cross-border vibes.",
    heroCopy:
      "Bongo Flava brings sing-along choruses, urban-pop instincts, and a strong Kenya-Tanzania crossover presence to the dial.",
    heroLabels: ["Cross-border pop", "Sing-along choruses", "Urban sheen"],
    accentColor: "#00897B",
    accentColorSoft: "#4DB6AC",
    featuredArtists: ["Diamond Platnumz", "Ali Kiba", "Harmonize", "Zuchu"],
    relatedGenreIds: ["afro-pop", "taarab"],
    tagAliases: ["bongo flava", "bongoflava", "tanzanian pop", "swahili pop"],
  },
];
