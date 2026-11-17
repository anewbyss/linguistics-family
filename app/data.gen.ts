// GENERATED from content/*.json by scripts/build-data.mjs — do not edit by hand.
// Every entry's src field points at the community source it came from.
export type Src = { url?: string; name: string; attribution?: string; date?: string };
export type Vocab = { t: string; en: string; note?: string; src: Src; audio?: string };
export type QuizItem = { q: string; options: string[]; answer: number; explain: string; src: Src };
export type Lesson = {
  id: string; title: string; band: 'kids' | 'youth' | 'adult'; nativeTitle?: string; emoji?: string;
  vocab: Vocab[]; grammarNotes?: string[]; culture?: { text: string; src: Src }[]; quiz: QuizItem[];
};
export type LangDoc = {
  lang: string; title: string; orthography: string;
  lessons: Lesson[]; phrasebook?: Vocab[];
};
export const DATA: LangDoc[] = [
  {
    "lang": "potawatomi",
    "title": "Bodéwadmimwen",
    "orthography": "CPN (Citizen Potawatomi Nation) orthography, per the CPN Language Department.",
    "lessons": [
      {
        "id": "pw-summer-1",
        "title": "Summer words",
        "band": "kids",
        "nativeTitle": "Niben kedwnen",
        "emoji": "🌞",
        "vocab": [
          {
            "t": "Niben",
            "en": "summer (literally a time of plenty)",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
              "name": "CPN Language Update, August 2026"
            }
          },
          {
            "t": "Waskonédo",
            "en": "flower",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
              "name": "CPN Language Update, August 2026"
            }
          },
          {
            "t": "Waskonédoyen",
            "en": "flowers",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
              "name": "CPN Language Update, August 2026"
            }
          },
          {
            "t": "Gmowen",
            "en": "It is raining",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
              "name": "CPN Language Update, August 2026"
            }
          },
          {
            "t": "Gshatemget",
            "en": "It is hot",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
              "name": "CPN Language Update, August 2026"
            }
          },
          {
            "t": "Dékyak",
            "en": "ice cream",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
              "name": "CPN Language Update, August 2026"
            }
          },
          {
            "t": "Dékyak nde-mijen",
            "en": "I am eating ice cream",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
              "name": "CPN Language Update, August 2026"
            }
          },
          {
            "t": "Bgezo",
            "en": "he/she swims (older usage: also bathes)",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
              "name": "CPN Language Update, August 2026"
            }
          },
          {
            "t": "Bmatega",
            "en": "he/she wades (today often used for swims)",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
              "name": "CPN Language Update, August 2026"
            }
          }
        ],
        "grammarNotes": [
          "CPN notes pronunciation in parentheses in its updates: Waskonédoyen (wahs cone neh doe), Gmowen (guh mow in), Dékyak (deck ee yack).",
          "Bgezo and Bmatega: old-school bgezo covered swimming and bathing because people bathed as they swam; today some use bmatega for swim and bgezo for bath."
        ],
        "culture": [
          {
            "text": "The CPN Language Department posts a new set of seasonal words every month and asks families to use them at home with the children (penojeyek).",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
              "name": "CPN Language Update, August 2026"
            }
          }
        ],
        "quiz": [
          {
            "q": "Which word means 'flower'?",
            "options": [
              "Niben",
              "Waskonédo",
              "Gmowen"
            ],
            "answer": 1,
            "explain": "Niben is summer, Waskonédo is flower (Waskonédoyen is flowers), Gmowen is it is raining.",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
              "name": "CPN Language Update, August 2026"
            }
          }
        ]
      },
      {
        "id": "pw-home-1",
        "title": "Kitchen questions",
        "band": "youth",
        "nativeTitle": "Mtek wigwam: mkesnen",
        "emoji": "🍲",
        "vocab": [
          {
            "t": "Gbekte ne?",
            "en": "Are you hungry?",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/07/28/language-update-july-2026",
              "name": "CPN Language Update, July 2026 (7000.org course phrases)"
            }
          },
          {
            "t": "Gishdemget ne?",
            "en": "Is it done cooking?",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/07/28/language-update-july-2026",
              "name": "CPN Language Update, July 2026 (7000.org course phrases)"
            }
          },
          {
            "t": "Wegni je wjandayen?",
            "en": "What are you cooking?",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/07/28/language-update-july-2026",
              "name": "CPN Language Update, July 2026 (7000.org course phrases)"
            }
          }
        ],
        "grammarNotes": [
          "These sentence-based phrases come from CPN's 7000.org course, which teaches by rooms of the house — phrases you would actually say in the kitchen.",
          "ne is the question marker that turns a statement into a yes/no question."
        ],
        "quiz": [
          {
            "q": "What does 'Gbekte ne?' ask?",
            "options": [
              "Is it done cooking?",
              "Are you hungry?",
              "What are you cooking?"
            ],
            "answer": 1,
            "explain": "Per CPN's July 2026 update, gbekte ne? asks 'Are you hungry?' — gishdemget ne? asks if the cooking is done.",
            "src": {
              "url": "https://www.potawatomi.org/blog/2026/07/28/language-update-july-2026",
              "name": "CPN Language Update, July 2026"
            }
          }
        ]
      }
    ],
    "phrasebook": [
      {
        "t": "Bozho jayek",
        "en": "Hello everyone",
        "src": {
          "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
          "name": "CPN Language Update, August 2026"
        }
      },
      {
        "t": "Bozho",
        "en": "Hello",
        "src": {
          "url": "https://www.potawatomi.org/blog/2026/01/20/language-update-january-2026",
          "name": "CPN Language Update, January 2026"
        }
      },
      {
        "t": "Migwetch",
        "en": "Thank you",
        "src": {
          "url": "https://www.potawatomi.org/blog/2026/09/01/language-update-august-2026",
          "name": "CPN Language Update, August 2026"
        }
      },
      {
        "t": "penojeyek",
        "en": "children",
        "src": {
          "url": "https://www.potawatomi.org/blog/2026/07/28/language-update-july-2026",
          "name": "CPN Language Update, July 2026"
        }
      },
      {
        "t": "dawewgemek",
        "en": "store",
        "src": {
          "url": "https://www.potawatomi.org/blog/2026/07/28/language-update-july-2026",
          "name": "CPN Language Update, July 2026"
        }
      },
      {
        "t": "nibi",
        "en": "water",
        "src": {
          "name": "CPN Language Department dictionary",
          "attribution": "Common Potawatomi, per CPN materials",
          "date": "2026-11"
        }
      }
    ]
  },
  {
    "lang": "tongan",
    "title": "Lea faka-Tonga",
    "orthography": "Standard Tongan orthography: fakauʻa (ʻ, glottal stop) and toloi (macron, long vowel).",
    "lessons": [
      {
        "id": "to-greet-1",
        "title": "Greetings & Farewells",
        "band": "kids",
        "nativeTitle": "Ngaahi lea fakafeʻiloaki",
        "emoji": "👋",
        "vocab": [
          {
            "t": "Mālō e lelei",
            "en": "Hello (informal)",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 4"
            }
          },
          {
            "t": "Mālō ʻetau lava",
            "en": "Hello (formal)",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 4"
            }
          },
          {
            "t": "Fēfē hake?",
            "en": "How are you? (idiomatic)",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 4"
            }
          },
          {
            "t": "Sai pē, mālō",
            "en": "Fine, thank you",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 4"
            }
          },
          {
            "t": "ʻAlu ā",
            "en": "Goodbye (to someone who is going)",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 4"
            }
          },
          {
            "t": "Nofo ā",
            "en": "Goodbye (to someone who is staying)",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 4"
            }
          },
          {
            "t": "Toki sio",
            "en": "See you later",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 4"
            }
          }
        ],
        "grammarNotes": [
          "Tongan is phonetic: words are spelled the way they are pronounced. Stress normally falls on the second-to-last syllable; a toloi (long vowel, e.g. kumā) takes the stress instead.",
          "The fakauʻa (ʻ) is a glottal stop and changes meaning: anga (behavior) vs ʻanga (shark). It is written in front of a vowel or between two vowels."
        ],
        "culture": [
          {
            "text": "Tongan farewells differ by who is leaving: ʻAlu ā to the person going, Nofo ā to the person staying. Answering both is ʻIo!",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 4"
            }
          }
        ],
        "quiz": [
          {
            "q": "Which greeting is formal?",
            "options": [
              "Mālō e lelei",
              "Mālō ʻetau lava",
              "Toki sio"
            ],
            "answer": 1,
            "explain": "The Peace Corps lesson lists Mālō ʻetau lava as the formal hello and Mālō e lelei as the informal one.",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 4"
            }
          },
          {
            "q": "Someone is leaving and you are staying. What do you say?",
            "options": [
              "Nofo ā",
              "ʻAlu ā",
              "Fēfē hake?"
            ],
            "answer": 1,
            "explain": "ʻAlu ā is said to the person who is going; Nofo ā is for the person who stays.",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 4"
            }
          }
        ]
      },
      {
        "id": "to-sound-1",
        "title": "The fakauʻa and toloi",
        "band": "adult",
        "nativeTitle": "Fakauʻa mo e toloi",
        "emoji": "🔊",
        "vocab": [
          {
            "t": "anga",
            "en": "behavior / attitude",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 1"
            }
          },
          {
            "t": "ʻanga",
            "en": "shark",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 1"
            }
          },
          {
            "t": "kaka",
            "en": "to climb",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 1"
            }
          },
          {
            "t": "kākā",
            "en": "to cheat",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 1"
            }
          },
          {
            "t": "laʻā",
            "en": "sun / sunny",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 1"
            }
          }
        ],
        "grammarNotes": [
          "Each of the five vowels has four forms: plain, with fakauʻa, with toloi, and with both. The fakauʻa is an abrupt glottal stop; the toloi holds the vowel twice as long. Both change word meanings.",
          "No Tongan word ends in a consonant, and two consonants never meet without a vowel between them. ng is one sound, as in English 'singer'."
        ],
        "quiz": [
          {
            "q": "What does the fakauʻa (ʻ) do?",
            "options": [
              "Lengthens the vowel",
              "Adds a glottal stop",
              "Moves the stress"
            ],
            "answer": 1,
            "explain": "The fakauʻa is the glottal stop; the toloi is what lengthens a vowel.",
            "src": {
              "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
              "name": "Peace Corps Tonga Language Lessons, Lesson 1"
            }
          }
        ]
      }
    ],
    "phrasebook": [
      {
        "t": "ʻIo",
        "en": "Yes",
        "src": {
          "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
          "name": "Peace Corps Tonga Language Lessons, Lesson 5"
        }
      },
      {
        "t": "ʻikai",
        "en": "No",
        "src": {
          "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
          "name": "Peace Corps Tonga Language Lessons, Lesson 5"
        }
      },
      {
        "t": "mālō",
        "en": "Thank you",
        "src": {
          "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
          "name": "Peace Corps Tonga Language Lessons, Lesson 5"
        }
      },
      {
        "t": "mālō ʻaupito",
        "en": "Thank you very much",
        "src": {
          "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
          "name": "Peace Corps Tonga Language Lessons, Lesson 5"
        }
      },
      {
        "t": "tulou",
        "en": "Excuse me (passing in front of someone)",
        "src": {
          "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
          "name": "Peace Corps Tonga Language Lessons, Lesson 5"
        }
      },
      {
        "t": "kātaki",
        "en": "Please",
        "src": {
          "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
          "name": "Peace Corps Tonga Language Lessons, Lesson 5"
        }
      },
      {
        "t": "fakamolemole",
        "en": "Sorry",
        "src": {
          "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
          "name": "Peace Corps Tonga Language Lessons, Lesson 5"
        }
      },
      {
        "t": "Fakamolemole, ʻikai mahino",
        "en": "Sorry, I don't understand",
        "src": {
          "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
          "name": "Peace Corps Tonga Language Lessons, Lesson 5"
        }
      },
      {
        "t": "Ko fē e falemālōlō?",
        "en": "Where is the toilet?",
        "src": {
          "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
          "name": "Peace Corps Tonga Language Lessons, Lesson 5"
        }
      },
      {
        "t": "Tau kamata",
        "en": "Let's begin",
        "src": {
          "url": "https://files.peacecorps.gov/multimedia/audio/languagelessons/tonga/TN_Tonga_Language_Lessons.pdf",
          "name": "Peace Corps Tonga Language Lessons, Lesson 5"
        }
      }
    ]
  }
] as unknown as LangDoc[];

export const TRACKS = [
  { id: 'kids', label: 'Kids (with a grown-up)', blurb: 'Short and playful. A parent reads along.' },
  { id: 'youth', label: 'Youth', blurb: 'A bit more at a time, still friendly.' },
  { id: 'adult', label: 'Adult', blurb: 'Adds the grammar notes from the sources.' },
] as const;
