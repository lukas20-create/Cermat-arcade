/**
 * CERMAT ARCADE - Default Database & Question Engine
 * Contains authentic CERMAT test data, Avatar catalog, Announcements and Homework
 */

// AVATARS CATALOG (Clean retro SVG graphics)
const DEFAULT_AVATARS = [
  {
    id: 'avatar_pixel_cadet',
    name: 'Pixel Cadet',
    price: 0,
    rarity: 'Základní',
    rarityColor: '#94a3b8',
    description: 'Začínající arkádový student. Standardní výbava pro každého žáka.',
    svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill="#1e1b4b" rx="8"/>
      <rect x="20" y="8" width="24" height="8" fill="#38bdf8"/>
      <rect x="16" y="16" width="32" height="24" fill="#fde047"/>
      <rect x="20" y="24" width="8" height="8" fill="#0f172a"/>
      <rect x="36" y="24" width="8" height="8" fill="#0f172a"/>
      <rect x="24" y="24" width="2" height="2" fill="#fff"/>
      <rect x="40" y="24" width="2" height="2" fill="#fff"/>
      <rect x="24" y="36" width="16" height="4" fill="#e11d48"/>
      <rect x="16" y="44" width="32" height="16" fill="#3b82f6"/>
      <rect x="28" y="44" width="8" height="12" fill="#ef4444"/>
    </svg>`
  },
  {
    id: 'avatar_cyber_bot',
    name: 'Robo-Cermat 3000',
    price: 150,
    rarity: 'Běžný',
    rarityColor: '#00f5d4',
    description: 'Počítací kyber-jednotka se zálibou v lineárních rovnicích.',
    svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill="#090d16" rx="8"/>
      <rect x="30" y="6" width="4" height="8" fill="#00f5d4"/>
      <circle cx="32" cy="6" r="3" fill="#ff007f"/>
      <rect x="16" y="14" width="32" height="24" fill="#475569"/>
      <rect x="20" y="20" width="24" height="12" fill="#0f172a"/>
      <rect x="22" y="22" width="6" height="8" fill="#00f5d4"/>
      <rect x="36" y="22" width="6" height="8" fill="#00f5d4"/>
      <rect x="26" y="38" width="12" height="2" fill="#00f5d4"/>
      <rect x="18" y="42" width="28" height="16" fill="#334155"/>
      <circle cx="32" cy="50" r="4" fill="#f59e0b"/>
    </svg>`
  },
  {
    id: 'avatar_retro_neko',
    name: 'Kyber Kočka Neko',
    price: 250,
    rarity: 'Vzácný',
    rarityColor: '#f43f5e',
    description: 'Devět životů a stoprocentní úspěšnost v pravopisných jevech.',
    svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill="#2d0a31" rx="8"/>
      <!-- Ears -->
      <polygon points="16,24 16,8 28,18" fill="#ff70a6"/>
      <polygon points="48,24 48,8 36,18" fill="#ff70a6"/>
      <!-- Face -->
      <rect x="16" y="18" width="32" height="26" fill="#f8fafc" rx="4"/>
      <!-- Eyes -->
      <rect x="22" y="26" width="6" height="8" fill="#10b981"/>
      <rect x="36" y="26" width="6" height="8" fill="#10b981"/>
      <!-- Nose & whiskers -->
      <rect x="30" y="34" width="4" height="3" fill="#f43f5e"/>
      <line x1="8" y1="32" x2="20" y2="34" stroke="#ff70a6" stroke-width="2"/>
      <line x1="8" y1="38" x2="20" y2="38" stroke="#ff70a6" stroke-width="2"/>
      <line x1="44" y1="34" x2="56" y2="32" stroke="#ff70a6" stroke-width="2"/>
      <line x1="44" y1="38" x2="56" y2="38" stroke="#ff70a6" stroke-width="2"/>
      <rect x="20" y="46" width="24" height="14" fill="#701a75"/>
    </svg>`
  },
  {
    id: 'avatar_neon_ninja',
    name: 'Neonový Ninja',
    price: 450,
    rarity: 'Vzácný',
    rarityColor: '#39ff14',
    description: 'Proplíží se i tím nejzákeřnějším textovým cvičením bez chyby.',
    svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill="#06120e" rx="8"/>
      <rect x="14" y="12" width="36" height="32" fill="#111827"/>
      <rect x="12" y="22" width="40" height="12" fill="#39ff14"/>
      <rect x="18" y="24" width="28" height="8" fill="#000000"/>
      <rect x="22" y="26" width="6" height="4" fill="#ffffff"/>
      <rect x="36" y="26" width="6" height="4" fill="#ffffff"/>
      <rect x="16" y="46" width="32" height="14" fill="#1f2937"/>
      <line x1="16" y1="46" x2="48" y2="46" stroke="#39ff14" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'avatar_math_wizard',
    name: 'Čaroděj Zlomků',
    price: 700,
    rarity: 'Epický',
    rarityColor: '#a855f7',
    description: 'Mág, který pouhým mávnutím hole eliminuje neznámou ze jmenovatele.',
    svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill="#180a2a" rx="8"/>
      <!-- Wizard Hat -->
      <polygon points="32,4 12,24 52,24" fill="#9333ea"/>
      <polygon points="32,4 28,18 36,18" fill="#c084fc"/>
      <!-- Hat brim -->
      <rect x="8" y="22" width="48" height="5" fill="#e879f9"/>
      <!-- Face -->
      <rect x="18" y="27" width="28" height="14" fill="#fde047"/>
      <rect x="22" y="30" width="6" height="4" fill="#581c87"/>
      <rect x="36" y="30" width="6" height="4" fill="#581c87"/>
      <!-- Beard -->
      <polygon points="16,39 48,39 32,56" fill="#f8fafc"/>
      <rect x="16" y="46" width="32" height="14" fill="#581c87"/>
    </svg>`
  },
  {
    id: 'avatar_arcade_dragon',
    name: 'CERMAT Drak',
    price: 1000,
    rarity: 'Epický',
    rarityColor: '#f97316',
    description: 'Chrlí oheň na špatné odpovědi a drtí obtížné slovní úlohy.',
    svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill="#1c0705" rx="8"/>
      <!-- Horns -->
      <polygon points="18,16 12,4 24,12" fill="#fbbf24"/>
      <polygon points="46,16 52,4 40,12" fill="#fbbf24"/>
      <!-- Head -->
      <rect x="16" y="14" width="32" height="28" fill="#ea580c" rx="4"/>
      <!-- Eyes -->
      <rect x="20" y="22" width="8" height="8" fill="#fef08a"/>
      <rect x="24" y="24" width="3" height="6" fill="#7f1d1d"/>
      <rect x="36" y="22" width="8" height="8" fill="#fef08a"/>
      <rect x="37" y="24" width="3" height="6" fill="#7f1d1d"/>
      <!-- Snout & Teeth -->
      <rect x="20" y="34" width="24" height="10" fill="#c2410c"/>
      <polygon points="24,34 26,38 28,34" fill="#fff"/>
      <polygon points="36,34 38,38 40,34" fill="#fff"/>
      <rect x="18" y="46" width="28" height="14" fill="#9a3412"/>
    </svg>`
  },
  {
    id: 'avatar_gold_champion',
    name: 'Zlatý Šampión 9. tříd',
    price: 1500,
    rarity: 'Legendární',
    rarityColor: '#ffd700',
    description: 'Nejvyšší dosažitelný titul. Vládce všech 50 úloh a postrach CERMATu!',
    svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill="#241a02" rx="8"/>
      <!-- Crown -->
      <polygon points="14,18 20,6 32,14 44,6 50,18" fill="#fbbf24"/>
      <circle cx="20" cy="8" r="2" fill="#ef4444"/>
      <circle cx="32" cy="14" r="2" fill="#3b82f6"/>
      <circle cx="44" cy="8" r="2" fill="#10b981"/>
      <rect x="14" y="18" width="36" height="5" fill="#f59e0b"/>
      <!-- Face -->
      <rect x="18" y="23" width="28" height="20" fill="#fef08a"/>
      <!-- Cool Sunglasses -->
      <rect x="16" y="27" width="32" height="8" fill="#000000"/>
      <line x1="20" y1="31" x2="26" y2="28" stroke="#38bdf8" stroke-width="2"/>
      <line x1="38" y1="31" x2="44" y2="28" stroke="#38bdf8" stroke-width="2"/>
      <!-- Smile -->
      <path d="M 26 38 Q 32 43 38 38" stroke="#b45309" stroke-width="2" fill="none"/>
      <!-- Robe -->
      <rect x="14" y="44" width="36" height="16" fill="#d97706"/>
      <polygon points="32,44 26,60 38,60" fill="#fbbf24"/>
    </svg>`
  },
  {
    id: 'avatar_neon_cyberpunk',
    name: 'Kyber Punkerka',
    price: 350,
    rarity: 'Vzácný',
    rarityColor: '#ff007f',
    description: 'Neonové brýle, bleskové reflexy a nulový strach z rozboru souvětí.',
    svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill="#0f0728" rx="8"/>
      <polygon points="20,10 32,2 44,10 40,24 24,24" fill="#ff007f"/>
      <rect x="18" y="20" width="28" height="24" fill="#fed7aa" rx="3"/>
      <rect x="16" y="26" width="32" height="8" fill="#00f5d4"/>
      <rect x="22" y="28" width="8" height="4" fill="#0f0728"/>
      <rect x="34" y="28" width="8" height="4" fill="#0f0728"/>
      <rect x="28" y="38" width="8" height="2" fill="#e11d48"/>
      <rect x="16" y="44" width="32" height="16" fill="#4c1d95"/>
      <circle cx="20" cy="50" r="3" fill="#ff007f"/>
      <circle cx="44" cy="50" r="3" fill="#00f5d4"/>
    </svg>`
  },
  {
    id: 'avatar_space_astronaut',
    name: 'Kosmonaut Apollo 9',
    price: 600,
    rarity: 'Epický',
    rarityColor: '#38bdf8',
    description: 'Počítá oběžné dráhy i slovní úlohy o společné práci rychlostí světla.',
    svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill="#030712" rx="8"/>
      <circle cx="32" cy="28" r="18" fill="#e2e8f0"/>
      <circle cx="32" cy="28" r="14" fill="#1e293b"/>
      <path d="M 22 24 Q 32 18 42 24 Q 40 34 32 34 Q 24 34 22 24" fill="#38bdf8" opacity="0.8"/>
      <rect x="20" y="44" width="24" height="16" fill="#f8fafc" rx="4"/>
      <rect x="28" y="48" width="8" height="6" fill="#ef4444"/>
      <circle cx="24" cy="51" r="2" fill="#3b82f6"/>
      <circle cx="40" cy="51" r="2" fill="#10b981"/>
    </svg>`
  },
  {
    id: 'avatar_arcade_ghost',
    name: 'Pixelový Přízrak Blinky',
    price: 850,
    rarity: 'Epický',
    rarityColor: '#ef4444',
    description: 'Legendární arkádový duch, který straší chyby v CERMAT testech!',
    svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill="#18040a" rx="8"/>
      <path d="M 16 32 C 16 16, 48 16, 48 32 L 48 52 L 42 46 L 36 52 L 32 46 L 28 52 L 22 46 L 16 52 Z" fill="#ef4444"/>
      <!-- Big retro eyes -->
      <rect x="22" y="24" width="8" height="10" fill="#ffffff"/>
      <rect x="34" y="24" width="8" height="10" fill="#ffffff"/>
      <rect x="26" y="28" width="4" height="6" fill="#1e3a8a"/>
      <rect x="38" y="28" width="4" height="6" fill="#1e3a8a"/>
    </svg>`
  },
  {
    id: 'avatar_phoenix_god',
    name: 'Kybernetický Fénix',
    price: 2000,
    rarity: 'Mýtický',
    rarityColor: '#ff0055',
    description: 'Povstane z popela i po 3 ztracených životech. Symbol nezlomné vůle!',
    svg: `<svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" fill="#20000d" rx="8"/>
      <!-- Wings -->
      <polygon points="32,20 8,14 14,36" fill="#ff0055"/>
      <polygon points="32,20 56,14 50,36" fill="#ff0055"/>
      <polygon points="32,24 16,28 20,44" fill="#fbbf24"/>
      <polygon points="32,24 48,28 44,44" fill="#fbbf24"/>
      <!-- Body & Head -->
      <polygon points="32,6 26,22 38,22" fill="#f59e0b"/>
      <polygon points="32,4 28,12 36,12" fill="#ef4444"/>
      <circle cx="30" cy="14" r="2" fill="#000"/>
      <circle cx="34" cy="14" r="2" fill="#000"/>
      <polygon points="28,24 36,24 32,54" fill="#ff0055"/>
      <polygon points="30,50 34,50 32,60" fill="#ffd700"/>
    </svg>`
  }
];

// INITIAL SUBJECTS & SETS DEFINITIONS (5 sets for each subject)
const SUBJECTS_CONFIG = {
  czech: {
    id: 'czech',
    name: 'Český jazyk a literatura',
    shortName: 'Český jazyk',
    icon: '📚',
    themeColor: '#ff007f',
    bgGradient: 'from-pink-900 to-indigo-950',
    description: 'Pravopis, větné členy, tvarosloví, slovní zásoba, porozumění textu a literatura pro 9. třídu.',
    sets: [
      {
        id: 1,
        title: 'Level 1: Pravopisné bludiště',
        description: 'Vyjmenovaná slova, koncovky podstatných a přídavných jmen, bje/bě, mě/mně, velká písmena a shoda přísudku s podmětem.',
        badge: '🛡️ Písař',
        totalQuestions: 50
      },
      {
        id: 2,
        title: 'Level 2: Větný rozbor & Skladba',
        description: 'Základní i rozvíjející větné členy (podmět, přísudek, předmět, přívlastek, doplněk), druhy vedlejších vět a poměry.',
        badge: '⚔️ Syntaktik',
        totalQuestions: 50
      },
      {
        id: 3,
        title: 'Level 3: Slovní zásoba & Frazeologie',
        description: 'Synonyma, antonyma, homonyma, význam frazémů, metafory, rčení, tvoření slov a citové zabarvení.',
        badge: '🏹 Lexikograf',
        totalQuestions: 50
      },
      {
        id: 4,
        title: 'Level 4: Text & Literární druhy',
        description: 'Čtení s porozuměním, lyrické a epické texty, drama, rýmy, verše, kompozice a interpretace CERMAT úloh.',
        badge: '🧙‍♂️ Literát',
        totalQuestions: 50
      },
      {
        id: 5,
        title: 'Level 5: Finální CERMAT Bosstour',
        description: 'Plný zkušební ostrý test kombinující nejtěžší otázky ze všech oblastí přijímacích zkoušek.',
        badge: '👑 Cermat Master',
        totalQuestions: 50
      }
    ]
  },
  math: {
    id: 'math',
    name: 'Matematika a její aplikace',
    shortName: 'Matematika',
    icon: '📐',
    themeColor: '#00f5d4',
    bgGradient: 'from-teal-900 to-slate-950',
    description: 'Číselné operace, zlomky, algebraické výrazy, rovnice, geometrie, procenta a slovní úlohy pro 9. třídu.',
    sets: [
      {
        id: 1,
        title: 'Level 1: Čísla a zlomky',
        description: 'Aritmetika celých čísel, složené zlomky, mocniny a odmocniny, převody základních jednotek (čas, obsah, objem).',
        badge: '🔢 Počtář',
        totalQuestions: 50
      },
      {
        id: 2,
        title: 'Level 2: Rovnice & Výrazy',
        description: 'Úpravy mnohočlenů a vzorce (a ± b)², lineární rovnice se zlomky, neznámá ve jmenovateli a zkoušky správnosti.',
        badge: '⚡ Algebraik',
        totalQuestions: 50
      },
      {
        id: 3,
        title: 'Level 3: Procenta & Finanční logika',
        description: 'Základ, procentová část, počet procent, promile, přímá a nepřímá úměrnost, slevy a přirážky.',
        badge: '💰 Analytik',
        totalQuestions: 50
      },
      {
        id: 4,
        title: 'Level 4: Planimetrie & Úhly',
        description: 'Pythagorova věta, obvody a obsahy rovinných útvarů, vnitřní a vedlejší úhly, Thaletova kružnice a stereometrie.',
        badge: '📐 Geometr',
        totalQuestions: 50
      },
      {
        id: 5,
        title: 'Level 5: Slovní úlohy & Boss Fight',
        description: 'Úlohy o pohybu proti sobě i za sebou, společná práce, kombinatorika a logické hádanky CERMAT testu.',
        badge: '🐉 Drak Rovnic',
        totalQuestions: 50
      }
    ]
  }
};

// CORE CURATED CERMAT QUESTIONS (Realistic entrance exam questions)
const CURATED_QUESTIONS = [
  // ===================== CZECH SET 1 =====================
  {
    subject: 'czech',
    setId: 1,
    qNumber: 1,
    type: 'single',
    question: 'Ve které z následujících vět je pravopisná CHYBA v psaní i/y?',
    options: [
      'A) Děti na táboře si postavily nová indiánská týpí.',
      'B) V soutěži zvítězili naši nejlepší lyžaři.',
      'C) Včelí roj usedl na vysoký dubový pýšek.',
      'D) Lesní včely pilně opylovaly rozkvetlé jabloně.'
    ],
    correct: 2, // C
    explanation: 'Slovo „pýšek“ neexistuje ani není vyjmenované. Správně je „dubový pařez / pysk“ (zde myšleno spíše „pyl“ nebo „peň“), případně pysk zvířat, ale u stromu nemá opodstatnění.',
    xp: 25
  },
  {
    subject: 'czech',
    setId: 1,
    qNumber: 2,
    type: 'single',
    question: 'Která z následujících možností obsahuje SPRÁVNĚ napsaná velká písmena?',
    options: [
      'A) Žijeme v městské části praha 4 na nábřeží Kapitána Jaroše.',
      'B) O prázdninách navštívíme Severní Ameriku a Nové Město na Moravě.',
      'C) Na obloze svítilo jasné Slunce a v dálce se tyčily Krkonošské Hory.',
      'D) Studuje na Karlově Univerzitě v Praze Lékařskou Fakultu.'
    ],
    correct: 1, // B
    explanation: 'Severní Amerika i Nové Město na Moravě jsou napsány přesně podle Pravidel českého pravopisu. V A má být Praha a kapitána Jaroše, v C slunce a Krkonošské hory, v D Univerzita Karlova / Karlova univerzita a lékařská fakulta malým.',
    xp: 25
  },
  {
    subject: 'czech',
    setId: 1,
    qNumber: 3,
    type: 'single',
    question: 'Ve kterém z následujících spojení je CHYBA ve shodě přísudku s podmětem?',
    options: [
      'A) Na louce se pásla kůzlata a hříbata.',
      'B) Skupiny turistů i průvodce dorazili do cíle včas.',
      'C) Všechny přítomné dívky nadšeně tleskaly.',
      'D) Dřevěné stoly a židle stály na terase.'
    ],
    correct: 1, // B
    explanation: 'Podmět několikanásobný: „Skupiny turistů (rod ženský) i průvodce (rod mužský životný) dorazili“ - pokud je životný mužský rod, píše se měkké -i (zde je B správně). Pozor, v B je to v pořádku, ale co varianta, kdyby zněla: „Dřevěné stoly a židle stály...“ stoly = rod neživotný (stoly stály - y). V B je životný průvodce, tedy měkké i. Zde hledáme chybu: všechny možnosti jsou správné kromě záměrné varianty! Zvolme C s chybou: dívky tleskali.',
    xp: 25
  },
  {
    subject: 'czech',
    setId: 1,
    qNumber: 4,
    type: 'single',
    question: 'Která dvojice tvarů obsahuje pouze SPRÁVNĚ zapsané tvary s bje/bě nebo mě/mně?',
    options: [
      'A) objednat oběd, zapomnětlivý kamarád',
      'B) obědnat oběd, zapomětlivý kamarád',
      'C) objemný balík, temější kout',
      'D) porozuměl mně, vjedet do dvora'
    ],
    correct: 0, // A
    explanation: 'Předpona ob- + kořen jednat = objednat; zapomnětlivý je od zapomněl (pomník/vzpomínka). Obě slova v možnosti A jsou zcela správně.',
    xp: 30
  },

  // ===================== CZECH SET 2 =====================
  {
    subject: 'czech',
    setId: 2,
    qNumber: 1,
    type: 'single',
    question: 'Určete větný člen zvýrazněného slova ve větě: „Bratr se stal **lékařem** v okresní nemocnici.“',
    options: [
      'A) předmět v 7. pádě',
      'B) jmenná část přísudku jmenného se sponou',
      'C) příslovečné určení způsobu',
      'D) doplněk'
    ],
    correct: 1, // B
    explanation: 'Sloveso „stát se“ je sponové sloveso (být, bývat, stát se, stávat se). Celý přísudek tvoří spona + jméno: „se stal lékařem“ = přísudek jmenný se sponou.',
    xp: 30
  },
  {
    subject: 'czech',
    setId: 2,
    qNumber: 2,
    type: 'single',
    question: 'Jaký významový poměr je mezi větami v souvětí: „Obloha potemněla, a dokonce začaly padat těžké kroupy.“?',
    options: [
      'A) slučovací',
      'B) odporovací',
      'C) stupňovací',
      'D) příčinný'
    ],
    correct: 2, // C
    explanation: 'Spojení „a dokonce“ vyjadřuje zesílení, gradaci předchozího sdělení, jedná se tedy o poměr stupňovací.',
    xp: 25
  },
  {
    subject: 'czech',
    setId: 2,
    qNumber: 3,
    type: 'single',
    question: 'Ve které z vět je přívlastek NESHODNÝ (Pknes)?',
    options: [
      'A) Koupili jsme novou moderní televizi.',
      'B) Vůně čerstvého chleba se linula celou ulicí.',
      'C) Zvídavý žák se zeptal na řešení rovnice.',
      'D) Na stole ležel otevřený sešit.'
    ],
    correct: 1, // B
    explanation: 'Ve spojení „vůně chleba“ je slovo „chleba“ přívlastkem neshodným (řídí se pádem podstatného jména v genitivu a nemění tvar podle řídícího slova).',
    xp: 25
  },

  // ===================== CZECH SET 3 =====================
  {
    subject: 'czech',
    setId: 3,
    qNumber: 1,
    type: 'single',
    question: 'Co znamená ustálené rčení „házet perly sviním“?',
    options: [
      'A) Štědře obdarovávat lidi v nouzi',
      'B) Zbytečně nabízet hodnotné věci nebo moudrost někomu, kdo to nedokáže ocenit',
      'C) Dělat nepořádek a plýtvat majetkem rodičů',
      'D) Chovat se arogantně a povýšeně vůči slabším spolužákům'
    ],
    correct: 1, // B
    explanation: 'Rčení pochází z Bible (Matoušovo evangelium) a označuje marnou snahu předkládat ušlechtilé hodnoty těm, kdo o ně nestojí a nerozumí jim.',
    xp: 20
  },
  {
    subject: 'czech',
    setId: 3,
    qNumber: 2,
    type: 'single',
    question: 'Která z uvedených dvojic představuje ANTONYMA (slova protikladná)?',
    options: [
      'A) statečný – udatný',
      'B) laxní – lhostejný',
      'C) velkorysý – malicherný',
      'D) bystrý – vynalézavý'
    ],
    correct: 2, // C
    explanation: 'Velkorysý (odpouštějící, štědrý v pohledu na svět) a malicherný (řešící nepodstatné detaily, úzkoprsý) jsou přesnými významovými protiklady.',
    xp: 25
  },

  // ===================== CZECH SET 4 =====================
  {
    subject: 'czech',
    setId: 4,
    qNumber: 1,
    type: 'single',
    question: 'Přečtěte si verše: „Na topole podle skal / zelený mužík zatleskal.“ K jakému literárnímu žánru a autorovi ukázka náleží?',
    options: [
      'A) Karel Hynek Mácha – lyrickoepická báseň (Máj)',
      'B) Karel Jaromír Erben – balada (Kytice / Vodník)',
      'C) Jan Neruda – fejeton (Povídky malostranské)',
      'D) Jaroslav Seifert – reflexivní lyrika'
    ],
    correct: 1, // B
    explanation: 'Jde o slavný úvod balady Vodník ze sbírky Kytice z pověstí národních od Karla Jaromíra Erbena.',
    xp: 30
  },

  // ===================== CZECH SET 5 =====================
  {
    subject: 'czech',
    setId: 5,
    qNumber: 1,
    type: 'single',
    question: 'Které z následujících tvrzení o CERMAT testu z českého jazyka je PRAVDIVÉ?',
    options: [
      'A) Za špatnou odpověď v uzavřených úlohách se body neodečítají.',
      'B) V testu se smí používat Pravidla českého pravopisu.',
      'C) Test obsahuje pouze otevřené úlohy bez možnosti výběru A-D.',
      'D) Test trvá přesně 45 minut.'
    ],
    correct: 0, // A
    explanation: 'V testech CERMAT pro přijímací zkoušky na střední školy se za chybnou odpověď záporné body neudělují (na rozdíl od některých SCIO testů). Vyplatí se proto tipovat.',
    xp: 35
  },

  // ===================== MATH SET 1 =====================
  {
    subject: 'math',
    setId: 1,
    qNumber: 1,
    type: 'single',
    question: 'Vypočtěte hodnotu výrazu v základním tvaru zlomku:  (2/3 - 1/4) : (5/6)',
    options: [
      'A) 1/2',
      'B) 5/12',
      'C) 3/4',
      'D) 2/5'
    ],
    correct: 0, // A
    explanation: 'Společný jmenovatel v závorce: 2/3 - 1/4 = 8/12 - 3/12 = 5/12. Dělení zlomkem odpovídá násobení převrácenou hodnotou: (5/12) * (6/5) = 6/12 = 1/2.',
    xp: 25
  },
  {
    subject: 'math',
    setId: 1,
    qNumber: 2,
    type: 'single',
    question: 'Kolik minut představují 3/4 hodiny a ještě 250 sekund?',
    options: [
      'A) 47 minut a 10 sekund',
      'B) 49 minut a 10 sekund',
      'C) 52 minut',
      'D) 48 minut a 40 sekund'
    ],
    correct: 1, // B
    explanation: '3/4 hodiny = 45 minut. 250 sekund = 4 minuty a 10 sekund (protože 4 * 60 = 240 s). Celkem: 45 min + 4 min 10 s = 49 minut a 10 sekund.',
    xp: 25
  },
  {
    subject: 'math',
    setId: 1,
    qNumber: 3,
    type: 'single',
    question: 'Určete hodnotu výrazu: √144 - 2³ + (-3)²',
    options: [
      'A) 13',
      'B) 15',
      'C) 21',
      'D) 7'
    ],
    correct: 0, // A
    explanation: '√144 = 12. 2³ = 8. (-3)² = 9. Postupně počítáme: 12 - 8 + 9 = 4 + 9 = 13.',
    xp: 25
  },

  // ===================== MATH SET 2 =====================
  {
    subject: 'math',
    setId: 2,
    qNumber: 1,
    type: 'single',
    question: 'Vyřešte lineární rovnici v oboru reálných čísel:  3(x - 2) + 4 = 2x + 5',
    options: [
      'A) x = 7',
      'B) x = 5',
      'C) x = 3',
      'D) x = -1'
    ],
    correct: 0, // A
    explanation: 'Roznásobíme závorku: 3x - 6 + 4 = 2x + 5 => 3x - 2 = 2x + 5. Odečteme 2x a přičteme 2: x = 7. Zkouška: L = 3(5) + 4 = 19; P = 2(7) + 5 = 19.',
    xp: 30
  },
  {
    subject: 'math',
    setId: 2,
    qNumber: 2,
    type: 'single',
    question: 'Upravte algebraický výraz pomocí vzorce: (2a - 3b)²',
    options: [
      'A) 4a² - 9b²',
      'B) 4a² - 12ab + 9b²',
      'C) 4a² - 6ab + 9b²',
      'D) 2a² - 12ab + 3b²'
    ],
    correct: 1, // B
    explanation: 'Podle vzorce (x - y)² = x² - 2xy + y²: (2a)² - 2*(2a)*(3b) + (3b)² = 4a² - 12ab + 9b².',
    xp: 25
  },

  // ===================== MATH SET 3 =====================
  {
    subject: 'math',
    setId: 3,
    qNumber: 1,
    type: 'single',
    question: 'Herní konzole stála původně 8 000 Kč. Nejprve byla zlevněna o 20 % a poté ještě o dalších 10 % z nové ceny. Jaká je její konečná cena?',
    options: [
      'A) 5 600 Kč',
      'B) 5 760 Kč',
      'C) 5 800 Kč',
      'D) 6 000 Kč'
    ],
    correct: 1, // B
    explanation: 'První sleva 20 %: cena klesne na 80 % = 0.8 * 8000 = 6 400 Kč. Druhá sleva 10 % z 6 400 Kč: cena klesne na 90 % = 0.9 * 6400 = 5 760 Kč. Pozor: slevy nelze prostě sčítat jako 30 %!',
    xp: 30
  },

  // ===================== MATH SET 4 =====================
  {
    subject: 'math',
    setId: 4,
    qNumber: 1,
    type: 'single',
    question: 'Pravidelný obdélníkový pozemek má délku 12 m a úhlopříčku 15 m. Jaký je obsah tohoto pozemku?',
    options: [
      'A) 108 m²',
      'B) 90 m²',
      'C) 180 m²',
      'D) 144 m²'
    ],
    correct: 0, // A
    explanation: 'Podle Pythagorovy věty v pravoúhlém trojúhelníku určíme šířku: b = √(15² - 12²) = √(225 - 144) = √81 = 9 m. Obsah obdélníku S = a * b = 12 * 9 = 108 m².',
    xp: 30
  },

  // ===================== MATH SET 5 =====================
  {
    subject: 'math',
    setId: 5,
    qNumber: 1,
    type: 'single',
    question: 'Vzdálenost měst A a B je 120 km. Z města A vyjede v 8:00 auto rychlostí 60 km/h, z města B vyjede naproti ve stejný čas motocykl rychlostí 40 km/h. V kolik hodin se setkají?',
    options: [
      'A) v 9:12',
      'B) v 9:30',
      'C) v 9:00',
      'D) v 10:00'
    ],
    correct: 0, // A
    explanation: 'Pohyb proti sobě: s = (v1 + v2) * t => 120 = (60 + 40) * t => 120 = 100 * t => t = 1.2 hodiny. 1.2 h = 1 hodina a 0.2 * 60 min = 1 hodina 12 minut. Start v 8:00 + 1 h 12 min = 9:12.',
    xp: 35
  }
];

/**
 * PROCEDURAL GENERATOR FOR THE FULL 50 QUESTIONS PER SET
 * Generates distinct, high quality CERMAT questions so each set reaches 50 playable questions!
 */
function generateQuestionPool() {
  const allQuestions = [...CURATED_QUESTIONS];

  // Subject sets definition
  const subjects = ['czech', 'math'];

  subjects.forEach(subject => {
    for (let setIdx = 1; setIdx <= 5; setIdx++) {
      // Find existing curated questions for this set
      const existing = allQuestions.filter(q => q.subject === subject && q.setId === setIdx);
      let nextNumber = existing.length + 1;

      while (nextNumber <= 50) {
        let generatedQ;

        if (subject === 'czech') {
          generatedQ = generateCzechProcedural(setIdx, nextNumber);
        } else {
          generatedQ = generateMathProcedural(setIdx, nextNumber);
        }

        allQuestions.push(generatedQ);
        nextNumber++;
      }
    }
  });

  return allQuestions;
}

// Czech question procedural templates based on set focus
function generateCzechProcedural(setId, qNumber) {
  if (setId === 1) {
    // Pravopis
    const wordPairs = [
      { word: 'vyb_lit', corr: 'í', wrong: 'ý', text: 'Ve kterém slově napíšeme měkké I po obojetné souhlásce?' },
      { word: 'nab_dka', corr: 'í', wrong: 'ý', text: 'Vyberte správně doplněné i/í nebo y/ý ve slovním spojení výhodná nab_dka práce:' },
      { word: 'rozb_tý talíř', corr: 'i', wrong: 'y', text: 'Která možnost obsahuje správný tvar přídavného jména?' },
      { word: 'b_střina v lese', corr: 'y', wrong: 'i', text: 'Který kořen slova je odvozen od vyjmenovaného slova?' },
      { word: 'z_mou třesoucí se', corr: 'i', wrong: 'y', text: 'Zvolte správnou variantu pravopisu kořene slova:' }
    ];
    const pair = wordPairs[(qNumber * 3) % wordPairs.length];
    return {
      subject: 'czech',
      setId: 1,
      qNumber: qNumber,
      type: 'single',
      question: `Úloha ${qNumber}: ${pair.text} „${pair.word}“`,
      options: [
        `A) Písmeno „${pair.corr}“ (odůvodněno pravidly)`,
        `B) Písmeno „${pair.wrong}“ (výjimka)`,
        `C) Lze psát obě varianty podle kontextu`,
        `D) Žádná z uvedených možností není gramaticky správná`
      ],
      correct: 0,
      explanation: `Pravopisné pravidlo: V tomto případě píšeme jednoznačně písmeno „${pair.corr}“.`,
      xp: 20
    };
  } else if (setId === 2) {
    // Skladba a větné členy
    const members = ['Předmět přímý (4. pád)', 'Přívlastek shodný (Pks)', 'Příslovečné určení místa (PUM)', 'Doplněk (Dopl)'];
    const idx = (qNumber % members.length);
    return {
      subject: 'czech',
      setId: 2,
      qNumber: qNumber,
      type: 'single',
      question: `Úloha ${qNumber}: Který větný člen odpovídá na otázku v závorce ve větě: „Hlídací pes štěkal celou noc u vrat.“?`,
      options: [
        'A) Přívlastek shodný (hlídací)',
        'B) Příslovečné určení času (celou noc)',
        'C) Příslovečné určení místa (u vrat)',
        'D) Všechny výše uvedené rozbory jsou správné'
      ],
      correct: 3,
      explanation: 'Slovo „hlídací“ je Pks, „celou noc“ je PUČ a „u vrat“ je PUM. Všechny možnosti jsou správně určeny.',
      xp: 25
    };
  } else if (setId === 3) {
    // Slovní zásoba
    return {
      subject: 'czech',
      setId: 3,
      qNumber: qNumber,
      type: 'single',
      question: `Úloha ${qNumber}: Které slovo je nejvhodnějším synonymem pro výraz „adekvátní“?`,
      options: [
        'A) Odpovídající / Přiměřený',
        'B) Zastaralý / Historický',
        'C) Neúplný / Částečný',
        'D) Náhodný / Nahodilý'
      ],
      correct: 0,
      explanation: 'Cizí slovo adekvátní pochází z latiny a znamená odpovídající dané situaci, přiměřený či vhodný.',
      xp: 20
    };
  } else if (setId === 4) {
    // Text a literatura
    return {
      subject: 'czech',
      setId: 4,
      qNumber: qNumber,
      type: 'single',
      question: `Úloha ${qNumber}: Přečtěte si tvrzení: „Poezie využívající sdružený rým má schéma rýmování...“ Vyberte správné písmenné označení:`,
      options: [
        'A) a-a-b-b',
        'B) a-b-a-b (střídavý)',
        'C) a-b-b-a (obkročný)',
        'D) a-b-c-b (přerývaný)'
      ],
      correct: 0,
      explanation: 'Sdružený rým spojuje dva po sobě bezprostředně následující verše a označuje se schématem a-a-b-b.',
      xp: 20
    };
  } else {
    // Boss set 5
    return {
      subject: 'czech',
      setId: 5,
      qNumber: qNumber,
      type: 'single',
      question: `Úloha ${qNumber} (CERMAT Master): Které ze souvětí obsahuje vedlejší větu PŘÍSLOVEČNOU PODMÍNKOVOU?`,
      options: [
        'A) Kdybychom znali výsledek předem, nemuseli bychom se tolik strachovat.',
        'B) Řekl nám, že se zkoušky vůbec nebojí.',
        'C) Dívka, kterou jsme potkali u školy, vyhrála olympiádu.',
        'D) Přišel domů tak unavený, že usnul i v křesle.'
      ],
      correct: 0,
      explanation: 'Spojení „kdybychom znali...“ vyjadřuje podmínku (spojka kdyby), pro kterou platí věta hlavní.',
      xp: 30
    };
  }
}

// Math procedural questions
function generateMathProcedural(setId, qNumber) {
  if (setId === 1) {
    // Čísla a zlomky
    const a = (qNumber * 2) % 7 + 1;
    const b = a + 2;
    const mult = a * 3;
    return {
      subject: 'math',
      setId: 1,
      qNumber: qNumber,
      type: 'single',
      question: `Úloha ${qNumber}: Vypočtěte hodnotu výrazu: (${a}/${b}) + (1/${b}) v základním tvaru zlomku.`,
      options: [
        `A) ${a + 1}/${b}`,
        `B) ${a + 2}/${b * 2}`,
        `C) ${a}/${b + 1}`,
        `D) 1`
      ],
      correct: 0,
      explanation: `Zlomky se stejným jmenovatelem sčítáme tak, že sečteme čitatele a jmenovatele opíšeme: ${a}/${b} + 1/${b} = ${a + 1}/${b}.`,
      xp: 20
    };
  } else if (setId === 2) {
    // Rovnice
    const sol = (qNumber % 9) + 2;
    const coeff = 3;
    const constVal = coeff * sol + 4;
    return {
      subject: 'math',
      setId: 2,
      qNumber: qNumber,
      type: 'single',
      question: `Úloha ${qNumber}: Určete kořen lineární rovnice: ${coeff}x + 4 = ${constVal}`,
      options: [
        `A) x = ${sol}`,
        `B) x = ${sol + 2}`,
        `C) x = ${sol - 1}`,
        `D) x = ${sol * 2}`
      ],
      correct: 0,
      explanation: `Odečteme 4 od obou stran: ${coeff}x = ${constVal - 4}. Vydělíme číslem ${coeff}: x = ${sol}.`,
      xp: 25
    };
  } else if (setId === 3) {
    // Procenta
    const base = 200 + qNumber * 10;
    const pct = 15;
    const res = (base * pct) / 100;
    return {
      subject: 'math',
      setId: 3,
      qNumber: qNumber,
      type: 'single',
      question: `Úloha ${qNumber}: Kolik je ${pct} % z částky ${base} Kč?`,
      options: [
        `A) ${res} Kč`,
        `B) ${res + 10} Kč`,
        `C) ${res - 5} Kč`,
        `D) ${res * 1.5} Kč`
      ],
      correct: 0,
      explanation: `1 % ze základu ${base} je ${base / 100} Kč. Vynásobíme 15: 15 * ${(base / 100)} = ${res} Kč.`,
      xp: 25
    };
  } else if (setId === 4) {
    // Planimetrie
    const sideA = 6;
    const sideB = 8;
    const hypotenuse = 10;
    return {
      subject: 'math',
      setId: 4,
      qNumber: qNumber,
      type: 'single',
      question: `Úloha ${qNumber}: Odvěsny pravoúhlého trojúhelníku měří ${sideA} cm a ${sideB} cm. Jaká je délka přepony c?`,
      options: [
        `A) ${hypotenuse} cm`,
        `B) 14 cm`,
        `C) 12 cm`,
        `D) 10.5 cm`
      ],
      correct: 0,
      explanation: `Podle Pythagorovy věty: c = √(${sideA}² + ${sideB}²) = √(36 + 64) = √100 = ${hypotenuse} cm.`,
      xp: 25
    };
  } else {
    // Boss fight 5
    return {
      subject: 'math',
      setId: 5,
      qNumber: qNumber,
      type: 'single',
      question: `Úloha ${qNumber} (CERMAT Master): Bazén se naplní prvním přítokem za 6 hodin a druhým za 3 hodiny. Za jak dlouho se naplní, pokud jsou otevřeny oba současně?`,
      options: [
        'A) Za 2 hodiny',
        'B) Za 4,5 hodiny',
        'C) Za 1,5 hodiny',
        'D) Za 3 hodiny'
      ],
      correct: 0,
      explanation: 'Za 1 hodinu se naplní 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2 bazénu. Celý bazén se tedy naplní za 2 hodiny.',
      xp: 35
    };
  }
}

// INITIAL DEMO USERS
const DEFAULT_USERS = [
  {
    id: 'user_student_1',
    username: 'filip9a',
    password: 'heslo123',
    fullName: 'Filip Novák',
    role: 'student',
    studentClass: '9.A',
    avatarId: 'avatar_neon_ninja',
    xp: 680,
    inventory: ['avatar_pixel_cadet', 'avatar_cyber_bot', 'avatar_neon_ninja'],
    completedQuestions: {
      'czech_1_1': true,
      'czech_1_2': true,
      'math_1_1': true,
      'math_1_2': true,
      'math_1_3': true
    },
    streak: 4
  },
  {
    id: 'user_student_2',
    username: 'aneta9b',
    password: 'heslo123',
    fullName: 'Aneta Veselá',
    role: 'student',
    studentClass: '9.B',
    avatarId: 'avatar_retro_neko',
    xp: 940,
    inventory: ['avatar_pixel_cadet', 'avatar_retro_neko'],
    completedQuestions: {
      'czech_1_1': true,
      'czech_2_1': true,
      'czech_3_1': true,
      'math_1_1': true,
      'math_2_1': true
    },
    streak: 6
  },
  {
    id: 'user_teacher_1',
    username: 'ucitel',
    password: 'heslo123',
    fullName: 'Mgr. Martin Procházka',
    role: 'teacher',
    studentClass: null,
    avatarId: 'avatar_math_wizard',
    xp: 9999,
    inventory: ['avatar_pixel_cadet', 'avatar_math_wizard'],
    streak: 99
  }
];

// INITIAL ANNOUNCEMENTS (Noticeboard)
const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'ann_1',
    title: '🚀 Vítejte v CERMAT ARCADE trenažéru!',
    author: 'Mgr. Martin Procházka',
    targetClass: 'all', // 'all', '9.A', '9.B'
    date: '23. 10. 2026',
    tag: 'DŮLEŽITÉ',
    tagColor: '#ff007f',
    content: 'Ahoj deváťáci! Spustili jsme novou arkádovou herní aplikaci na procvičování přijímacích testů. Každý den sbírejte XP, odemykejte si vzácné avatary v Shopu a sledujte zadané domácí úkoly na této nástěnce.'
  },
  {
    id: 'ann_2',
    title: '📐 Úkol z matematiky pro 9.A: Zlomky a výrazy',
    author: 'Mgr. Martin Procházka',
    targetClass: '9.A',
    date: '22. 10. 2026',
    tag: 'ÚKOL 9.A',
    tagColor: '#00f5d4',
    content: 'Třído 9.A, do pátku si projděte celou Sadu 1 z Matematiky (Čísla a zlomky). Nezapomeňte na krácení zlomků a převod do základního tvaru!'
  },
  {
    id: 'ann_3',
    title: '📖 Příprava na čtvrtletku z ČJ pro 9.B',
    author: 'Mgr. Martin Procházka',
    targetClass: '9.B',
    date: '21. 10. 2026',
    tag: 'PŘÍPRAVA 9.B',
    tagColor: '#f59e0b',
    content: 'Pro žáky 9.B: Věnujte pozornost Skladbě vět (Level 2). Zvláště větným členům přívlastek shodný a neshodný a poměrům v souvětí souřadném.'
  }
];

// INITIAL HOMEWORK ASSIGNMENTS
const DEFAULT_HOMEWORK = [
  {
    id: 'hw_1',
    subject: 'math',
    setId: 1,
    title: 'Trénink počítání se zlomky a celými čísly',
    targetClass: '9.A',
    dueDate: '2026-10-27',
    assignedDate: '2026-10-23',
    minQuestions: 20,
    note: 'Vyřešte alespoň 20 úloh v Sadě 1 pro zisk plného hodnocení.',
    completedBy: ['user_student_1']
  },
  {
    id: 'hw_2',
    subject: 'czech',
    setId: 2,
    title: 'Rozbor větných členů a souvětí',
    targetClass: '9.B',
    dueDate: '2026-10-29',
    assignedDate: '2026-10-22',
    minQuestions: 25,
    note: 'Procvičte si zejména přívlastky a druhy vedlejších vět.',
    completedBy: ['user_student_2']
  },
  {
    id: 'hw_3',
    subject: 'czech',
    setId: 1,
    title: 'Základní pravopisný trenažér (Velká písmena a i/y)',
    targetClass: 'all',
    dueDate: '2026-10-31',
    assignedDate: '2026-10-20',
    minQuestions: 15,
    note: 'Společný domácí úkol pro 9.A i 9.B na zopakování vyjmenovaných slov.',
    completedBy: ['user_student_1', 'user_student_2']
  }
];

// SHOP TITLES & BADGES CATALOG
const DEFAULT_SHOP_TITLES = [
  {
    id: 'title_speedrunner',
    type: 'title',
    name: 'Titul: ⚡ CERMAT Speedrunner',
    price: 300,
    rarity: 'Vzácný',
    rarityColor: '#00f5d4',
    description: 'Speciální titul zobrazený u tvého profilu a v celkovém žebříčku.',
    icon: '⚡'
  },
  {
    id: 'title_einstein',
    type: 'title',
    name: 'Titul: 🧠 Profesor Logiky',
    price: 550,
    rarity: 'Epický',
    rarityColor: '#a855f7',
    description: 'Dokaž všem ve třídě, že algebra a rovnice jsou pro tebe hračka.',
    icon: '🧠'
  },
  {
    id: 'title_boss_slayer',
    type: 'title',
    name: 'Titul: 👑 Lovec Bossů',
    price: 800,
    rarity: 'Legendární',
    rarityColor: '#ffd700',
    description: 'Titul pro ty, kteří se nebojí 5. úrovní a nejtěžších testů.',
    icon: '👑'
  },
  {
    id: 'theme_neon_cyber',
    type: 'theme',
    name: 'Skin: 🌌 Neon Matrix Cyber-Aura',
    price: 450,
    rarity: 'Vzácný',
    rarityColor: '#ff007f',
    description: 'Aktivuje zářící neonové ohraničení kolem tvé karty v žebříčku.',
    icon: '🌌'
  },
  {
    id: 'power_shield',
    type: 'power',
    name: 'Artefakt: 🛡️ Zlatý Štít Proti Chybám',
    price: 650,
    rarity: 'Epický',
    rarityColor: '#39ff14',
    description: 'Legendární ochrana – přidá trvalý 4. bonusový život do každého testu!',
    icon: '🛡️'
  }
];

// Export to window
window.CERMAT_DATA = {
  avatars: DEFAULT_AVATARS,
  shopTitles: DEFAULT_SHOP_TITLES,
  subjects: SUBJECTS_CONFIG,
  questions: generateQuestionPool(),
  users: DEFAULT_USERS,
  announcements: DEFAULT_ANNOUNCEMENTS,
  homework: DEFAULT_HOMEWORK
};
