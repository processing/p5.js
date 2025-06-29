// From https://github.com/radiovisual/unicode-range-json,
// with decimal ranges removed to save space, and with category
// names converted to lowercase ahead of time
export const unicodeRanges = [
  {
    category: "control character",
    hexrange: ["0000", "001f"],
  },
  {
    category: "basic latin",
    hexrange: ["0000", "007f"],
  },
  {
    category: "latin-1 supplement",
    hexrange: ["0080", "00ff"],
  },
  {
    category: "latin extended-a",
    hexrange: ["0100", "017f"],
  },
  {
    category: "latin extended-b",
    hexrange: ["0180", "024f"],
  },
  {
    category: "ipa extensions",
    hexrange: ["0250", "02af"],
  },
  {
    category: "spacing modifier letters",
    hexrange: ["02b0", "02ff"],
  },
  {
    category: "combining diacritical marks",
    hexrange: ["0300", "036f"],
  },
  {
    category: "greek and coptic",
    hexrange: ["0370", "03ff"],
  },
  {
    category: "cyrillic",
    hexrange: ["0400", "04ff"],
  },
  {
    category: "cyrillic supplement",
    hexrange: ["0500", "052f"],
  },
  {
    category: "armenian",
    hexrange: ["0530", "058f"],
  },
  {
    category: "hebrew",
    hexrange: ["0590", "05ff"],
  },
  {
    category: "arabic",
    hexrange: ["0600", "06ff"],
  },
  {
    category: "syriac",
    hexrange: ["0700", "074f"],
  },
  {
    category: "arabic supplement",
    hexrange: ["0750", "077f"],
  },
  {
    category: "thaana",
    hexrange: ["0780", "07bf"],
  },
  {
    category: "nko",
    hexrange: ["07c0", "07ff"],
  },
  {
    category: "samaritan",
    hexrange: ["0800", "083f"],
  },
  {
    category: "mandaic",
    hexrange: ["0840", "085f"],
  },
  {
    category: "syriac supplement",
    hexrange: ["0860", "086f"],
  },
  {
    category: "arabic extended-b",
    hexrange: ["0870", "089f"],
  },
  {
    category: "arabic extended-a",
    hexrange: ["08a0", "08ff"],
  },
  {
    category: "devanagari",
    hexrange: ["0900", "097f"],
  },
  {
    category: "bengali",
    hexrange: ["0980", "09ff"],
  },
  {
    category: "gurmukhi",
    hexrange: ["0a00", "0a7f"],
  },
  {
    category: "gujarati",
    hexrange: ["0a80", "0aff"],
  },
  {
    category: "oriya",
    hexrange: ["0b00", "0b7f"],
  },
  {
    category: "tamil",
    hexrange: ["0b80", "0bff"],
  },
  {
    category: "telugu",
    hexrange: ["0c00", "0c7f"],
  },
  {
    category: "kannada",
    hexrange: ["0c80", "0cff"],
  },
  {
    category: "malayalam",
    hexrange: ["0d00", "0d7f"],
  },
  {
    category: "sinhala",
    hexrange: ["0d80", "0dff"],
  },
  {
    category: "thai",
    hexrange: ["0e00", "0e7f"],
  },
  {
    category: "lao",
    hexrange: ["0e80", "0eff"],
  },
  {
    category: "tibetan",
    hexrange: ["0f00", "0fff"],
  },
  {
    category: "myanmar",
    hexrange: ["1000", "109f"],
  },
  {
    category: "georgian",
    hexrange: ["10a0", "10ff"],
  },
  {
    category: "hangul jamo",
    hexrange: ["1100", "11ff"],
  },
  {
    category: "ethiopic",
    hexrange: ["1200", "137f"],
  },
  {
    category: "ethiopic supplement",
    hexrange: ["1380", "139f"],
  },
  {
    category: "cherokee",
    hexrange: ["13a0", "13ff"],
  },
  {
    category: "unified canadian aboriginal syllabics",
    hexrange: ["1400", "167f"],
  },
  {
    category: "ogham",
    hexrange: ["1680", "169f"],
  },
  {
    category: "runic",
    hexrange: ["16a0", "16ff"],
  },
  {
    category: "tagalog",
    hexrange: ["1700", "171f"],
  },
  {
    category: "hanunoo",
    hexrange: ["1720", "173f"],
  },
  {
    category: "buhid",
    hexrange: ["1740", "175f"],
  },
  {
    category: "tagbanwa",
    hexrange: ["1760", "177f"],
  },
  {
    category: "khmer",
    hexrange: ["1780", "17ff"],
  },
  {
    category: "mongolian",
    hexrange: ["1800", "18af"],
  },
  {
    category: "unified canadian aboriginal syllabics extended",
    hexrange: ["18b0", "18ff"],
  },
  {
    category: "limbu",
    hexrange: ["1900", "194f"],
  },
  {
    category: "tai le",
    hexrange: ["1950", "197f"],
  },
  {
    category: "new tai lue",
    hexrange: ["1980", "19df"],
  },
  {
    category: "khmer symbols",
    hexrange: ["19e0", "19ff"],
  },
  {
    category: "buginese",
    hexrange: ["1a00", "1a1f"],
  },
  {
    category: "tai tham",
    hexrange: ["1a20", "1aaf"],
  },
  {
    category: "combining diacritical marks extended",
    hexrange: ["1ab0", "1aff"],
  },
  {
    category: "balinese",
    hexrange: ["1b00", "1b7f"],
  },
  {
    category: "sundanese",
    hexrange: ["1b80", "1bbf"],
  },
  {
    category: "batak",
    hexrange: ["1bc0", "1bff"],
  },
  {
    category: "lepcha",
    hexrange: ["1c00", "1c4f"],
  },
  {
    category: "ol chiki",
    hexrange: ["1c50", "1c7f"],
  },
  {
    category: "cyrillic extended-c",
    hexrange: ["1c80", "1c8f"],
  },
  {
    category: "georgian extended",
    hexrange: ["1c90", "1cbf"],
  },
  {
    category: "sundanese supplement",
    hexrange: ["1cc0", "1ccf"],
  },
  {
    category: "vedic extensions",
    hexrange: ["1cd0", "1cff"],
  },
  {
    category: "phonetic extensions",
    hexrange: ["1d00", "1d7f"],
  },
  {
    category: "phonetic extensions supplement",
    hexrange: ["1d80", "1dbf"],
  },
  {
    category: "combining diacritical marks supplement",
    hexrange: ["1dc0", "1dff"],
  },
  {
    category: "latin extended additional",
    hexrange: ["1e00", "1eff"],
  },
  {
    category: "greek extended",
    hexrange: ["1f00", "1fff"],
  },
  {
    category: "general punctuation",
    hexrange: ["2000", "206f"],
  },
  {
    category: "superscripts and subscripts",
    hexrange: ["2070", "209f"],
  },
  {
    category: "currency symbols",
    hexrange: ["20a0", "20cf"],
  },
  {
    category: "combining diacritical marks for symbols",
    hexrange: ["20d0", "20ff"],
  },
  {
    category: "letterlike symbols",
    hexrange: ["2100", "214f"],
  },
  {
    category: "number forms",
    hexrange: ["2150", "218f"],
  },
  {
    category: "arrows",
    hexrange: ["2190", "21ff"],
  },
  {
    category: "mathematical operators",
    hexrange: ["2200", "22ff"],
  },
  {
    category: "miscellaneous technical",
    hexrange: ["2300", "23ff"],
  },
  {
    category: "control pictures",
    hexrange: ["2400", "243f"],
  },
  {
    category: "optical character recognition",
    hexrange: ["2440", "245f"],
  },
  {
    category: "enclosed alphanumerics",
    hexrange: ["2460", "24ff"],
  },
  {
    category: "box drawing",
    hexrange: ["2500", "257f"],
  },
  {
    category: "block elements",
    hexrange: ["2580", "259f"],
  },
  {
    category: "geometric shapes",
    hexrange: ["25a0", "25ff"],
  },
  {
    category: "miscellaneous symbols",
    hexrange: ["2600", "26ff"],
  },
  {
    category: "dingbats",
    hexrange: ["2700", "27bf"],
  },
  {
    category: "miscellaneous mathematical symbols-a",
    hexrange: ["27c0", "27ef"],
  },
  {
    category: "supplemental arrows-a",
    hexrange: ["27f0", "27ff"],
  },
  {
    category: "braille patterns",
    hexrange: ["2800", "28ff"],
  },
  {
    category: "supplemental arrows-b",
    hexrange: ["2900", "297f"],
  },
  {
    category: "miscellaneous mathematical symbols-b",
    hexrange: ["2980", "29ff"],
  },
  {
    category: "supplemental mathematical operators",
    hexrange: ["2a00", "2aff"],
  },
  {
    category: "miscellaneous symbols and arrows",
    hexrange: ["2b00", "2bff"],
  },
  {
    category: "glagolitic",
    hexrange: ["2c00", "2c5f"],
  },
  {
    category: "latin extended-c",
    hexrange: ["2c60", "2c7f"],
  },
  {
    category: "coptic",
    hexrange: ["2c80", "2cff"],
  },
  {
    category: "georgian supplement",
    hexrange: ["2d00", "2d2f"],
  },
  {
    category: "tifinagh",
    hexrange: ["2d30", "2d7f"],
  },
  {
    category: "ethiopic extended",
    hexrange: ["2d80", "2ddf"],
  },
  {
    category: "cyrillic extended-a",
    hexrange: ["2de0", "2dff"],
  },
  {
    category: "supplemental punctuation",
    hexrange: ["2e00", "2e7f"],
  },
  {
    category: "cjk radicals supplement",
    hexrange: ["2e80", "2eff"],
  },
  {
    category: "kangxi radicals",
    hexrange: ["2f00", "2fdf"],
  },
  {
    category: "ideographic description characters",
    hexrange: ["2ff0", "2fff"],
  },
  {
    category: "cjk symbols and punctuation",
    hexrange: ["3000", "303f"],
  },
  {
    category: "hiragana",
    hexrange: ["3040", "309f"],
  },
  {
    category: "katakana",
    hexrange: ["30a0", "30ff"],
  },
  {
    category: "bopomofo",
    hexrange: ["3100", "312f"],
  },
  {
    category: "hangul compatibility jamo",
    hexrange: ["3130", "318f"],
  },
  {
    category: "kanbun",
    hexrange: ["3190", "319f"],
  },
  {
    category: "bopomofo extended",
    hexrange: ["31a0", "31bf"],
  },
  {
    category: "cjk strokes",
    hexrange: ["31c0", "31ef"],
  },
  {
    category: "katakana phonetic extensions",
    hexrange: ["31f0", "31ff"],
  },
  {
    category: "enclosed cjk letters and months",
    hexrange: ["3200", "32ff"],
  },
  {
    category: "cjk compatibility",
    hexrange: ["3300", "33ff"],
  },
  {
    category: "cjk unified ideographs extension a",
    hexrange: ["3400", "4dbf"],
  },
  {
    category: "yijing hexagram symbols",
    hexrange: ["4dc0", "4dff"],
  },
  {
    category: "cjk unified ideographs",
    hexrange: ["4e00", "9fff"],
  },
  {
    category: "yi syllables",
    hexrange: ["a000", "a48f"],
  },
  {
    category: "yi radicals",
    hexrange: ["a490", "a4cf"],
  },
  {
    category: "lisu",
    hexrange: ["a4d0", "a4ff"],
  },
  {
    category: "vai",
    hexrange: ["a500", "a63f"],
  },
  {
    category: "cyrillic extended-b",
    hexrange: ["a640", "a69f"],
  },
  {
    category: "bamum",
    hexrange: ["a6a0", "a6ff"],
  },
  {
    category: "modifier tone letters",
    hexrange: ["a700", "a71f"],
  },
  {
    category: "latin extended-d",
    hexrange: ["a720", "a7ff"],
  },
  {
    category: "syloti nagri",
    hexrange: ["a800", "a82f"],
  },
  {
    category: "common indic number forms",
    hexrange: ["a830", "a83f"],
  },
  {
    category: "phags-pa",
    hexrange: ["a840", "a87f"],
  },
  {
    category: "saurashtra",
    hexrange: ["a880", "a8df"],
  },
  {
    category: "devanagari extended",
    hexrange: ["a8e0", "a8ff"],
  },
  {
    category: "kayah li",
    hexrange: ["a900", "a92f"],
  },
  {
    category: "rejang",
    hexrange: ["a930", "a95f"],
  },
  {
    category: "hangul jamo extended-a",
    hexrange: ["a960", "a97f"],
  },
  {
    category: "javanese",
    hexrange: ["a980", "a9df"],
  },
  {
    category: "myanmar extended-b",
    hexrange: ["a9e0", "a9ff"],
  },
  {
    category: "cham",
    hexrange: ["aa00", "aa5f"],
  },
  {
    category: "myanmar extended-a",
    hexrange: ["aa60", "aa7f"],
  },
  {
    category: "tai viet",
    hexrange: ["aa80", "aadf"],
  },
  {
    category: "meetei mayek extensions",
    hexrange: ["aae0", "aaff"],
  },
  {
    category: "ethiopic extended-a",
    hexrange: ["ab00", "ab2f"],
  },
  {
    category: "latin extended-e",
    hexrange: ["ab30", "ab6f"],
  },
  {
    category: "cherokee supplement",
    hexrange: ["ab70", "abbf"],
  },
  {
    category: "meetei mayek",
    hexrange: ["abc0", "abff"],
  },
  {
    category: "hangul syllables",
    hexrange: ["ac00", "d7af"],
  },
  {
    category: "hangul jamo extended-b",
    hexrange: ["d7b0", "d7ff"],
  },
  {
    category: "high surrogates",
    hexrange: ["d800", "db7f"],
  },
  {
    category: "high private use surrogates",
    hexrange: ["db80", "dbff"],
  },
  {
    category: "low surrogates",
    hexrange: ["dc00", "dfff"],
  },
  {
    category: "private use area",
    hexrange: ["e000", "f8ff"],
  },
  {
    category: "cjk compatibility ideographs",
    hexrange: ["f900", "faff"],
  },
  {
    category: "alphabetic presentation forms",
    hexrange: ["fb00", "fb4f"],
  },
  {
    category: "arabic presentation forms-a",
    hexrange: ["fb50", "fdff"],
  },
  {
    category: "variation selectors",
    hexrange: ["fe00", "fe0f"],
  },
  {
    category: "vertical forms",
    hexrange: ["fe10", "fe1f"],
  },
  {
    category: "combining half marks",
    hexrange: ["fe20", "fe2f"],
  },
  {
    category: "cjk compatibility forms",
    hexrange: ["fe30", "fe4f"],
  },
  {
    category: "small form variants",
    hexrange: ["fe50", "fe6f"],
  },
  {
    category: "arabic presentation forms-b",
    hexrange: ["fe70", "feff"],
  },
  {
    category: "halfwidth and fullwidth forms",
    hexrange: ["ff00", "ffef"],
  },
  {
    category: "specials",
    hexrange: ["fff0", "ffff"],
  },
  {
    category: "linear b syllabary",
    hexrange: ["10000", "1007f"],
  },
  {
    category: "linear b ideograms",
    hexrange: ["10080", "100ff"],
  },
  {
    category: "aegean numbers",
    hexrange: ["10100", "1013f"],
  },
  {
    category: "ancient greek numbers",
    hexrange: ["10140", "1018f"],
  },
  {
    category: "ancient symbols",
    hexrange: ["10190", "101cf"],
  },
  {
    category: "phaistos disc",
    hexrange: ["101d0", "101ff"],
  },
  {
    category: "lycian",
    hexrange: ["10280", "1029f"],
  },
  {
    category: "carian",
    hexrange: ["102a0", "102df"],
  },
  {
    category: "coptic epact numbers",
    hexrange: ["102e0", "102ff"],
  },
  {
    category: "old italic",
    hexrange: ["10300", "1032f"],
  },
  {
    category: "gothic",
    hexrange: ["10330", "1034f"],
  },
  {
    category: "old permic",
    hexrange: ["10350", "1037f"],
  },
  {
    category: "ugaritic",
    hexrange: ["10380", "1039f"],
  },
  {
    category: "old persian",
    hexrange: ["103a0", "103df"],
  },
  {
    category: "deseret",
    hexrange: ["10400", "1044f"],
  },
  {
    category: "shavian",
    hexrange: ["10450", "1047f"],
  },
  {
    category: "osmanya",
    hexrange: ["10480", "104af"],
  },
  {
    category: "osage",
    hexrange: ["104b0", "104ff"],
  },
  {
    category: "elbasan",
    hexrange: ["10500", "1052f"],
  },
  {
    category: "caucasian albanian",
    hexrange: ["10530", "1056f"],
  },
  {
    category: "vithkuqi",
    hexrange: ["10570", "105bf"],
  },
  {
    category: "linear a",
    hexrange: ["10600", "1077f"],
  },
  {
    category: "latin extended-f",
    hexrange: ["10780", "107bf"],
  },
  {
    category: "cypriot syllabary",
    hexrange: ["10800", "1083f"],
  },
  {
    category: "imperial aramaic",
    hexrange: ["10840", "1085f"],
  },
  {
    category: "palmyrene",
    hexrange: ["10860", "1087f"],
  },
  {
    category: "nabataean",
    hexrange: ["10880", "108af"],
  },
  {
    category: "hatran",
    hexrange: ["108e0", "108ff"],
  },
  {
    category: "phoenician",
    hexrange: ["10900", "1091f"],
  },
  {
    category: "lydian",
    hexrange: ["10920", "1093f"],
  },
  {
    category: "meroitic hieroglyphs",
    hexrange: ["10980", "1099f"],
  },
  {
    category: "meroitic cursive",
    hexrange: ["109a0", "109ff"],
  },
  {
    category: "kharoshthi",
    hexrange: ["10a00", "10a5f"],
  },
  {
    category: "old south arabian",
    hexrange: ["10a60", "10a7f"],
  },
  {
    category: "old north arabian",
    hexrange: ["10a80", "10a9f"],
  },
  {
    category: "manichaean",
    hexrange: ["10ac0", "10aff"],
  },
  {
    category: "avestan",
    hexrange: ["10b00", "10b3f"],
  },
  {
    category: "inscriptional parthian",
    hexrange: ["10b40", "10b5f"],
  },
  {
    category: "inscriptional pahlavi",
    hexrange: ["10b60", "10b7f"],
  },
  {
    category: "psalter pahlavi",
    hexrange: ["10b80", "10baf"],
  },
  {
    category: "old turkic",
    hexrange: ["10c00", "10c4f"],
  },
  {
    category: "old hungarian",
    hexrange: ["10c80", "10cff"],
  },
  {
    category: "hanifi rohingya",
    hexrange: ["10d00", "10d3f"],
  },
  {
    category: "rumi numeral symbols",
    hexrange: ["10e60", "10e7f"],
  },
  {
    category: "yezidi",
    hexrange: ["10e80", "10ebf"],
  },
  {
    category: "arabic extended-c",
    hexrange: ["10ec0", "10eff"],
  },
  {
    category: "old sogdian",
    hexrange: ["10f00", "10f2f"],
  },
  {
    category: "sogdian",
    hexrange: ["10f30", "10f6f"],
  },
  {
    category: "old uyghur",
    hexrange: ["10f70", "10faf"],
  },
  {
    category: "chorasmian",
    hexrange: ["10fb0", "10fdf"],
  },
  {
    category: "elymaic",
    hexrange: ["10fe0", "10fff"],
  },
  {
    category: "brahmi",
    hexrange: ["11000", "1107f"],
  },
  {
    category: "kaithi",
    hexrange: ["11080", "110cf"],
  },
  {
    category: "sora sompeng",
    hexrange: ["110d0", "110ff"],
  },
  {
    category: "chakma",
    hexrange: ["11100", "1114f"],
  },
  {
    category: "mahajani",
    hexrange: ["11150", "1117f"],
  },
  {
    category: "sharada",
    hexrange: ["11180", "111df"],
  },
  {
    category: "sinhala archaic numbers",
    hexrange: ["111e0", "111ff"],
  },
  {
    category: "khojki",
    hexrange: ["11200", "1124f"],
  },
  {
    category: "multani",
    hexrange: ["11280", "112af"],
  },
  {
    category: "khudawadi",
    hexrange: ["112b0", "112ff"],
  },
  {
    category: "grantha",
    hexrange: ["11300", "1137f"],
  },
  {
    category: "newa",
    hexrange: ["11400", "1147f"],
  },
  {
    category: "tirhuta",
    hexrange: ["11480", "114df"],
  },
  {
    category: "siddham",
    hexrange: ["11580", "115ff"],
  },
  {
    category: "modi",
    hexrange: ["11600", "1165f"],
  },
  {
    category: "mongolian supplement",
    hexrange: ["11660", "1167f"],
  },
  {
    category: "takri",
    hexrange: ["11680", "116cf"],
  },
  {
    category: "ahom",
    hexrange: ["11700", "1174f"],
  },
  {
    category: "dogra",
    hexrange: ["11800", "1184f"],
  },
  {
    category: "warang citi",
    hexrange: ["118a0", "118ff"],
  },
  {
    category: "dives akuru",
    hexrange: ["11900", "1195f"],
  },
  {
    category: "nandinagari",
    hexrange: ["119a0", "119ff"],
  },
  {
    category: "zanabazar square",
    hexrange: ["11a00", "11a4f"],
  },
  {
    category: "soyombo",
    hexrange: ["11a50", "11aaf"],
  },
  {
    category: "unified canadian aboriginal syllabics extended-a",
    hexrange: ["11ab0", "11abf"],
  },
  {
    category: "pau cin hau",
    hexrange: ["11ac0", "11aff"],
  },
  {
    category: "devanagari extended-a",
    hexrange: ["11b00", "11b5f"],
  },
  {
    category: "bhaiksuki",
    hexrange: ["11c00", "11c6f"],
  },
  {
    category: "marchen",
    hexrange: ["11c70", "11cbf"],
  },
  {
    category: "masaram gondi",
    hexrange: ["11d00", "11d5f"],
  },
  {
    category: "gunjala gondi",
    hexrange: ["11d60", "11daf"],
  },
  {
    category: "makasar",
    hexrange: ["11ee0", "11eff"],
  },
  {
    category: "kawi",
    hexrange: ["11f00", "11f5f"],
  },
  {
    category: "lisu supplement",
    hexrange: ["11fb0", "11fbf"],
  },
  {
    category: "tamil supplement",
    hexrange: ["11fc0", "11fff"],
  },
  {
    category: "cuneiform",
    hexrange: ["12000", "123ff"],
  },
  {
    category: "cuneiform numbers and punctuation",
    hexrange: ["12400", "1247f"],
  },
  {
    category: "early dynastic cuneiform",
    hexrange: ["12480", "1254f"],
  },
  {
    category: "cypro-minoan",
    hexrange: ["12f90", "12fff"],
  },
  {
    category: "egyptian hieroglyphs",
    hexrange: ["13000", "1342f"],
  },
  {
    category: "egyptian hieroglyph format controls",
    hexrange: ["13430", "1345f"],
  },
  {
    category: "anatolian hieroglyphs",
    hexrange: ["14400", "1467f"],
  },
  {
    category: "bamum supplement",
    hexrange: ["16800", "16a3f"],
  },
  {
    category: "mro",
    hexrange: ["16a40", "16a6f"],
  },
  {
    category: "tangsa",
    hexrange: ["16a70", "16acf"],
  },
  {
    category: "bassa vah",
    hexrange: ["16ad0", "16aff"],
  },
  {
    category: "pahawh hmong",
    hexrange: ["16b00", "16b8f"],
  },
  {
    category: "medefaidrin",
    hexrange: ["16e40", "16e9f"],
  },
  {
    category: "miao",
    hexrange: ["16f00", "16f9f"],
  },
  {
    category: "ideographic symbols and punctuation",
    hexrange: ["16fe0", "16fff"],
  },
  {
    category: "tangut",
    hexrange: ["17000", "187ff"],
  },
  {
    category: "tangut components",
    hexrange: ["18800", "18aff"],
  },
  {
    category: "khitan small script",
    hexrange: ["18b00", "18cff"],
  },
  {
    category: "tangut supplement",
    hexrange: ["18d00", "18d7f"],
  },
  {
    category: "kana extended-b",
    hexrange: ["1aff0", "1afff"],
  },
  {
    category: "kana supplement",
    hexrange: ["1b000", "1b0ff"],
  },
  {
    category: "kana extended-a",
    hexrange: ["1b100", "1b12f"],
  },
  {
    category: "small kana extension",
    hexrange: ["1b130", "1b16f"],
  },
  {
    category: "nushu",
    hexrange: ["1b170", "1b2ff"],
  },
  {
    category: "duployan",
    hexrange: ["1bc00", "1bc9f"],
  },
  {
    category: "shorthand format controls",
    hexrange: ["1bca0", "1bcaf"],
  },
  {
    category: "znamenny musical notation",
    hexrange: ["1cf00", "1cfcf"],
  },
  {
    category: "byzantine musical symbols",
    hexrange: ["1d000", "1d0ff"],
  },
  {
    category: "musical symbols",
    hexrange: ["1d100", "1d1ff"],
  },
  {
    category: "ancient greek musical notation",
    hexrange: ["1d200", "1d24f"],
  },
  {
    category: "kaktovik numerals",
    hexrange: ["1d2c0", "1d2df"],
  },
  {
    category: "mayan numerals",
    hexrange: ["1d2e0", "1d2ff"],
  },
  {
    category: "tai xuan jing symbols",
    hexrange: ["1d300", "1d35f"],
  },
  {
    category: "counting rod numerals",
    hexrange: ["1d360", "1d37f"],
  },
  {
    category: "mathematical alphanumeric symbols",
    hexrange: ["1d400", "1d7ff"],
  },
  {
    category: "sutton signwriting",
    hexrange: ["1d800", "1daaf"],
  },
  {
    category: "latin extended-g",
    hexrange: ["1df00", "1dfff"],
  },
  {
    category: "glagolitic supplement",
    hexrange: ["1e000", "1e02f"],
  },
  {
    category: "cyrillic extended-d",
    hexrange: ["1e030", "1e08f"],
  },
  {
    category: "nyiakeng puachue hmong",
    hexrange: ["1e100", "1e14f"],
  },
  {
    category: "toto",
    hexrange: ["1e290", "1e2bf"],
  },
  {
    category: "wancho",
    hexrange: ["1e2c0", "1e2ff"],
  },
  {
    category: "nag mundari",
    hexrange: ["1e4d0", "1e4ff"],
  },
  {
    category: "ethiopic extended-b",
    hexrange: ["1e7e0", "1e7ff"],
  },
  {
    category: "mende kikakui",
    hexrange: ["1e800", "1e8df"],
  },
  {
    category: "adlam",
    hexrange: ["1e900", "1e95f"],
  },
  {
    category: "indic siyaq numbers",
    hexrange: ["1ec70", "1ecbf"],
  },
  {
    category: "ottoman siyaq numbers",
    hexrange: ["1ed00", "1ed4f"],
  },
  {
    category: "arabic mathematical alphabetic symbols",
    hexrange: ["1ee00", "1eeff"],
  },
  {
    category: "mahjong tiles",
    hexrange: ["1f000", "1f02f"],
  },
  {
    category: "domino tiles",
    hexrange: ["1f030", "1f09f"],
  },
  {
    category: "playing cards",
    hexrange: ["1f0a0", "1f0ff"],
  },
  {
    category: "enclosed alphanumeric supplement",
    hexrange: ["1f100", "1f1ff"],
  },
  {
    category: "enclosed ideographic supplement",
    hexrange: ["1f200", "1f2ff"],
  },
  {
    category: "miscellaneous symbols and pictographs",
    hexrange: ["1f300", "1f5ff"],
  },
  {
    category: "emoticons (emoji)",
    hexrange: ["1f600", "1f64f"],
  },
  {
    category: "ornamental dingbats",
    hexrange: ["1f650", "1f67f"],
  },
  {
    category: "transport and map symbols",
    hexrange: ["1f680", "1f6ff"],
  },
  {
    category: "alchemical symbols",
    hexrange: ["1f700", "1f77f"],
  },
  {
    category: "geometric shapes extended",
    hexrange: ["1f780", "1f7ff"],
  },
  {
    category: "supplemental arrows-c",
    hexrange: ["1f800", "1f8ff"],
  },
  {
    category: "supplemental symbols and pictographs",
    hexrange: ["1f900", "1f9ff"],
  },
  {
    category: "chess symbols",
    hexrange: ["1fa00", "1fa6f"],
  },
  {
    category: "symbols and pictographs extended-a",
    hexrange: ["1fa70", "1faff"],
  },
  {
    category: "symbols for legacy computing",
    hexrange: ["1fb00", "1fbff"],
  },
  {
    category: "cjk unified ideographs extension b",
    hexrange: ["20000", "2a6df"],
  },
  {
    category: "cjk unified ideographs extension c",
    hexrange: ["2a700", "2b73f"],
  },
  {
    category: "cjk unified ideographs extension d",
    hexrange: ["2b740", "2b81f"],
  },
  {
    category: "cjk unified ideographs extension e",
    hexrange: ["2b820", "2ceaf"],
  },
  {
    category: "cjk unified ideographs extension f",
    hexrange: ["2ceb0", "2ebef"],
  },
  {
    category: "cjk unified ideographs extension i",
    hexrange: ["2ebf0", "2ee5f"],
  },
  {
    category: "cjk compatibility ideographs supplement",
    hexrange: ["2f800", "2fa1f"],
  },
  {
    category: "cjk unified ideographs extension g",
    hexrange: ["30000", "3134f"],
  },
  {
    category: "cjk unified ideographs extension h",
    hexrange: ["31350", "323af"],
  },
  {
    category: "tags",
    hexrange: ["e0000", "e007f"],
  },
  {
    category: "variation selectors supplement",
    hexrange: ["e0100", "e01ef"],
  },
  {
    category: "supplementary private use area-a",
    hexrange: ["f0000", "fffff"],
  },
  {
    category: "supplementary private use area-b",
    hexrange: ["100000", "10ffff"],
  },
];
