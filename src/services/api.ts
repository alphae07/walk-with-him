/**
 * Walk With Him — API Services
 * 
 * All APIs have offline fallbacks using local data.
 * Primary: scripture.api.bible (free tier, no key needed for basic)
 * Backup: local static data in constants/data.ts
 */

import { VERSE_OF_DAY, QUIZ_QUESTIONS } from '../constants/data';

const BIBLE_API_BASE = 'https://bible-api.com';
const YOUVERSION_SEARCH = 'https://www.bible.com';

// ── Bible Verse Fetcher ────────────────────────────────────
export interface BibleVerse {
  text: string;
  reference: string;
  translation: string;
}

export async function fetchVerseByReference(ref: string): Promise<BibleVerse | null> {
  try {
    const encoded = encodeURIComponent(ref);
    const response = await fetch(`${BIBLE_API_BASE}/${encoded}?translation=kjv`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return {
      text: data.text?.trim() || '',
      reference: data.reference || ref,
      translation: 'KJV',
    };
  } catch {
    // Offline fallback — match from local store
    const local = VERSE_OF_DAY.find(v => v.ref.toLowerCase().includes(ref.toLowerCase().split(':')[0].toLowerCase()));
    if (local) return { text: local.text, reference: local.ref, translation: 'NIV' };
    return null;
  }
}

export async function fetchDailyVerse(): Promise<BibleVerse> {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const localVerse = VERSE_OF_DAY[dayOfYear % VERSE_OF_DAY.length];

  try {
    // Use bible-api.com for live verse
    const refs = ['John 15:5', 'Psalm 23:1', 'Jeremiah 29:11', 'Romans 8:28', 'Philippians 4:13'];
    const ref = refs[dayOfYear % refs.length];
    const verse = await fetchVerseByReference(ref);
    if (verse && verse.text) return verse;
  } catch {}

  return { text: localVerse.text, reference: localVerse.ref, translation: 'NIV' };
}

// ── Devotional Content ─────────────────────────────────────
export interface Devotional {
  title: string;
  verse: string;
  verseRef: string;
  body: string;
  prayer: string;
  date: string;
}

const DAILY_DEVOTIONALS: Devotional[] = [
  {
    title: 'The God Who Sees You',
    verse: 'You are the God who sees me.',
    verseRef: 'Genesis 16:13',
    body: "Hagar was alone in the wilderness. Abandoned. Afraid. Completely invisible to the world. And then God showed up — not to a king, not to a priest — to a servant girl in the desert. He called her by name. He saw her pain. He gave her a promise.\n\nYou are never invisible to God. On your worst day, in your loneliest moment, in the place where no one else thinks to look — He is there. He sees everything. Not to judge you, but to be with you.\n\nHe called Himself El Roi — the God who sees. That name wasn't given in a palace. It was spoken in a desert, to someone who thought she was forgotten. You are not forgotten.",
    prayer: 'God, I don\'t always feel seen. Sometimes I wonder if You notice what I\'m going through. Remind me today that You are El Roi — the God who sees me. Every struggle. Every tear. Every silent battle. You see it all. Let that be enough to keep me going.',
    date: '',
  },
  {
    title: 'You Don\'t Have to Earn Today',
    verse: 'His mercies are new every morning; great is your faithfulness.',
    verseRef: 'Lamentations 3:23',
    body: "You woke up this morning with no backlog of yesterday's failures. No debt carried over. No favour you used up that you now have to replace. God's mercies reset. Every. Single. Morning.\n\nThis isn't cheap grace — it's profound grace. It means you don't spend your day trying to earn back what you lost yesterday. You walk in today's mercy, freely given, fully available.\n\nThe question is never 'Am I worthy of today?' You're not. None of us are. The question is 'Will I receive today's mercy?' That's always the question. And the answer is yours to choose.",
    prayer: "Father, I come to You this morning without pretending yesterday was perfect. I come because Your mercies are new. I receive today's mercy — not because I earned it, but because You are faithful. Help me walk in today's grace without dragging yesterday's weight.",
    date: '',
  },
  {
    title: 'The Friend at Midnight',
    verse: 'Ask and it will be given to you; seek and you will find.',
    verseRef: 'Matthew 7:7',
    body: "Jesus told a story about a man who knocked on his neighbour's door at midnight, desperate and persistent. The neighbour didn't want to get up. But the man kept knocking — and eventually the neighbour got up, not because of friendship, but because of the man's boldness.\n\nJesus said: if even an irritated neighbour will respond to persistence, how much more will your Father — who loves you deeply and stays awake all night — respond to you?\n\nYou don't have to be polished when you pray. You don't have to wait for a better time or a cleaner heart. God invites the midnight knock. He responds to the desperate, persistent ask.",
    prayer: 'God, I\'m knocking tonight. I need You to answer. I\'m not going to pretend I have it figured out or that my request is perfectly worded. I\'m just asking. You said ask. I\'m asking. You said seek. I\'m seeking. You said knock. I\'m knocking.',
    date: '',
  },
  {
    title: 'When the Fire Doesn\'t Burn You',
    verse: 'When you walk through the fire, you will not be burned.',
    verseRef: 'Isaiah 43:2',
    body: "The promise isn't that you won't walk through fire. It's that the fire won't define you, destroy you, or own you. Shadrach, Meshach, and Abednego walked into the furnace and came out without even the smell of smoke on their clothes.\n\nGod didn't always prevent the fire. Sometimes He went in with them.\n\nThe most important line in that story isn't 'they survived.' It's what the king said when he looked in: 'I see four men walking around in the fire — and the fourth looks like a son of the gods.'\n\nIn your fire right now, you are not alone. The fourth man is there.",
    prayer: 'God, this feels like fire. I won\'t pretend it doesn\'t. But I\'m choosing to believe that You\'re in this with me — not watching from outside, but walking in it with me. I trust that I will come out of this. And when I do, it won\'t smell like smoke.',
    date: '',
  },
  {
    title: 'The Sound of Silence',
    verse: 'Be still, and know that I am God.',
    verseRef: 'Psalm 46:10',
    body: "The original Hebrew for 'be still' is raphah — it means to let go, to release, to stop striving. God isn't asking you to be passive. He's asking you to stop white-knuckling situations that are too big for your hands.\n\nNoise is the enemy of hearing God. Not just external noise — internal noise too. The noise of anxiety. The noise of plans. The noise of comparison and fear.\n\nWhen God says 'be still,' He's saying: I've got this. You can relax. Not because nothing is happening, but because I am in control of everything that's happening.",
    prayer: 'God, I release this. I release the plan I\'ve been holding onto. I release the timeline I\'ve built. I release the control I was never supposed to have. Be God. That\'s enough. I\'m still.',
    date: '',
  },
  {
    title: 'More Than You Can Imagine',
    verse: 'Now to him who is able to do immeasurably more than all we ask or imagine.',
    verseRef: 'Ephesians 3:20',
    body: "There is a limit to what you can ask for. There is a limit to what you can imagine. But there is no limit to what God can do. He doesn't work within your prayers — He works beyond them. He doesn't stop at your faith — He moves through it.\n\nPaul wrote this from prison. From a place where everything seemed limited and controlled. And he said: God can do more than all of this. More than all you're asking for in this moment. More than you've allowed yourself to hope for.\n\nWhat have you stopped asking for because it felt too big?",
    prayer: 'God, I confess I\'ve made you small. I\'ve prayed small prayers because I\'ve been afraid to be disappointed. Today I\'m asking for the big thing. The thing I\'ve been afraid to voice. I trust that You are able — even when I can\'t see how.',
    date: '',
  },
  {
    title: 'The Table in Enemy Territory',
    verse: 'You prepare a table before me in the presence of my enemies.',
    verseRef: 'Psalm 23:5',
    body: "David didn't say God removes all the enemies first. He said God sets up a feast while the enemies are still watching.\n\nThis is the kind of God you serve: He doesn't wait until your circumstances are perfect to bless you. He blesses you in the middle of the chaos, the attack, the uncertainty — and makes your enemies watch.\n\nThe provision isn't coming after the battle. The provision is in the battle. The peace isn't coming when the storm stops. The peace is in the storm. Don't wait to arrive somewhere better. The table is already set, right where you are.",
    prayer: 'God, I\'m in the middle of something hard. And I\'m asking You to show up here — not later, not when it\'s better — here. Set a table. Let me eat in peace in the middle of this. Let Your presence be so real that whatever is against me has to watch You bless me.',
    date: '',
  },
];

export function getDailyDevotional(): Devotional {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const devotional = DAILY_DEVOTIONALS[dayOfYear % DAILY_DEVOTIONALS.length];
  return { ...devotional, date: new Date().toISOString().split('T')[0] };
}

// ── Worship Songs (Curated — not religious ritual, relationship fuel) ──
export interface WorshipSong {
  id: string;
  title: string;
  artist: string;
  theme: string;
  why: string;
  searchQuery: string;
  youtubeSearchUrl: string;
  spotifySearchUrl: string;
  lyricTheme: string;
  emotionalContext: string;
}

export const WORSHIP_SONGS: WorshipSong[] = [
  // Intimacy & presence
  { id: 'w1', title: 'Goodness of God', artist: 'Bethel Music / CeCe Winans', theme: 'Gratitude', why: 'When you need to remember that His goodness is not dependent on your circumstances.', searchQuery: 'Goodness of God Bethel', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=goodness+of+god+bethel+music', spotifySearchUrl: 'https://open.spotify.com/search/Goodness%20of%20God%20Bethel', lyricTheme: 'His goodness follows you all the days of your life — not sometimes, all the time.', emotionalContext: 'Gratitude, healing, faith' },
  { id: 'w2', title: 'Way Maker', artist: 'Sinach', theme: 'Faithfulness', why: 'A declaration about who God is — even when you can\'t see Him moving.', searchQuery: 'Way Maker Sinach', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=way+maker+sinach+official', spotifySearchUrl: 'https://open.spotify.com/search/Way%20Maker%20Sinach', lyricTheme: 'He is still working, still moving, even in silence.', emotionalContext: 'Waiting, trust, declaration' },
  { id: 'w3', title: 'Oceans (Where Feet May Fail)', artist: 'Hillsong United', theme: 'Trust', why: 'For the moment when God is calling you into the deep and you\'re not sure you can do it.', searchQuery: 'Oceans Hillsong United', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=oceans+hillsong+united', spotifySearchUrl: 'https://open.spotify.com/search/Oceans%20Hillsong', lyricTheme: 'Keep my eyes above the waves. Lead me deeper than my feet could ever wander.', emotionalContext: 'Surrender, faith, calling' },
  { id: 'w4', title: 'What A Beautiful Name', artist: 'Hillsong Worship', theme: 'Adoration', why: 'Pure adoration — not asking for anything, just declaring who He is.', searchQuery: 'What A Beautiful Name Hillsong', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=what+a+beautiful+name+hillsong', spotifySearchUrl: 'https://open.spotify.com/search/What%20A%20Beautiful%20Name%20Hillsong', lyricTheme: 'His name above all names.', emotionalContext: 'Worship, adoration, reverence' },
  { id: 'w5', title: 'No Longer Slaves', artist: 'Bethel Music', theme: 'Freedom', why: 'For when fear is louder than faith. This song silences it.', searchQuery: 'No Longer Slaves Bethel', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=no+longer+slaves+bethel+music', spotifySearchUrl: 'https://open.spotify.com/search/No%20Longer%20Slaves%20Bethel', lyricTheme: 'I\'m no longer a slave to fear. I am a child of God.', emotionalContext: 'Fear, identity, freedom' },
  { id: 'w6', title: 'Reckless Love', artist: 'Cory Asbury', theme: 'God\'s Love', why: 'When you need to feel how far God will go to reach you. He chases you.', searchQuery: 'Reckless Love Cory Asbury', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=reckless+love+cory+asbury', spotifySearchUrl: 'https://open.spotify.com/search/Reckless%20Love%20Cory%20Asbury', lyricTheme: 'Nothing can separate you from His love. He chases you down.', emotionalContext: 'Shame, guilt, feeling lost' },
  { id: 'w7', title: 'O Come to the Altar', artist: 'Elevation Worship', theme: 'Confession & Surrender', why: 'An invitation to bring everything — the brokenness, the sin, the weight — and lay it down.', searchQuery: 'O Come to the Altar Elevation Worship', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=o+come+to+the+altar+elevation+worship', spotifySearchUrl: 'https://open.spotify.com/search/O%20Come%20to%20the%20Altar', lyricTheme: 'Leave behind your regrets and mistakes. Come today — there\'s no reason to wait.', emotionalContext: 'Repentance, surrender, cleansing' },
  { id: 'w8', title: 'Build My Life', artist: 'Housefires / Pat Barrett', theme: 'Surrender', why: 'Worth it all — this is the prayer of total surrender in worship form.', searchQuery: 'Build My Life Pat Barrett Housefires', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=build+my+life+housefires', spotifySearchUrl: 'https://open.spotify.com/search/Build%20My%20Life%20Housefires', lyricTheme: 'I will build my life upon Your love. It is a firm foundation.', emotionalContext: 'Rebuilding, surrender, devotion' },
  { id: 'w9', title: 'Jireh', artist: 'Elevation Worship & Maverick City', theme: 'Contentment', why: 'For the season where enough feels like not enough. He is Jireh — He provides.', searchQuery: 'Jireh Elevation Worship Maverick City', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=jireh+elevation+worship+maverick+city', spotifySearchUrl: 'https://open.spotify.com/search/Jireh%20Elevation%20Worship', lyricTheme: 'I\'ll never be more loved than I am right now.', emotionalContext: 'Contentment, provision, enough' },
  { id: 'w10', title: 'Graves Into Gardens', artist: 'Elevation Worship', theme: 'Resurrection', why: 'When something feels dead. When hope feels buried. This declares: He makes graves gardens.', searchQuery: 'Graves Into Gardens Elevation Worship', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=graves+into+gardens+elevation+worship', spotifySearchUrl: 'https://open.spotify.com/search/Graves%20Into%20Gardens', lyricTheme: 'He turns mourning to dancing. He gives beauty for ashes.', emotionalContext: 'Loss, grief, resurrection' },
  { id: 'w11', title: 'King of Kings', artist: 'Hillsong Worship', theme: 'The Gospel', why: 'The full story — creation, fall, cross, resurrection — sung as worship.', searchQuery: 'King of Kings Hillsong', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=king+of+kings+hillsong+worship', spotifySearchUrl: 'https://open.spotify.com/search/King%20of%20Kings%20Hillsong', lyricTheme: 'In the darkness, we were waiting. Without hope, without light. Till from Heaven You came running.', emotionalContext: 'The Gospel, awe, depth' },
  { id: 'w12', title: 'Surrounded (Fight My Battles)', artist: 'UPPERROOM / Michael W Smith', theme: 'Warfare', why: 'When you\'re overwhelmed. This is not a song about what you do — it\'s about what He does.', searchQuery: 'Surrounded Fight My Battles UPPERROOM', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=surrounded+fight+my+battles+upperroom', spotifySearchUrl: 'https://open.spotify.com/search/Surrounded%20Fight%20My%20Battles', lyricTheme: 'This is how I fight my battles — with praise, not panic.', emotionalContext: 'Spiritual warfare, overwhelmed, praise' },
  { id: 'w13', title: 'So Will I', artist: 'Hillsong United', theme: 'Creation & Praise', why: 'A deep meditation on how all creation praises God — and so will I.', searchQuery: 'So Will I Hillsong United', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=so+will+i+hillsong+united', spotifySearchUrl: 'https://open.spotify.com/search/So%20Will%20I%20Hillsong%20United', lyricTheme: 'If the stars were made to worship, so will I. If creation sings Your praises, so will I.', emotionalContext: 'Awe, creation, devotion' },
  { id: 'w14', title: 'Holy Forever', artist: 'Brian Johnson / Bethel', theme: 'Holiness', why: 'An encounter with the holiness of God — not fear, but awe and love.', searchQuery: 'Holy Forever Bethel Brian Johnson', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=holy+forever+bethel', spotifySearchUrl: 'https://open.spotify.com/search/Holy%20Forever%20Bethel', lyricTheme: 'Holy, holy, holy is the Lord God Almighty. Who was and is and is to come.', emotionalContext: 'Holiness, reverence, encounter' },
  // Nigerian Gospel
  { id: 'w15', title: 'Everything', artist: 'Timi Dakolo', theme: 'Total Surrender', why: 'A deeply personal, unhurried song of surrender. Perfect for quiet moments with God.', searchQuery: 'Everything Timi Dakolo', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=timi+dakolo+everything', spotifySearchUrl: 'https://open.spotify.com/search/Everything%20Timi%20Dakolo', lyricTheme: 'You are everything to me.', emotionalContext: 'Intimacy, devotion, quiet time' },
  { id: 'w16', title: 'Only You', artist: 'Nathaniel Bassey', theme: 'Intimacy', why: 'Nathaniel Bassey at his most personal — a song for the secret place.', searchQuery: 'Only You Nathaniel Bassey', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=nathaniel+bassey+only+you', spotifySearchUrl: 'https://open.spotify.com/search/Only%20You%20Nathaniel%20Bassey', lyricTheme: 'Only You can satisfy this longing in my soul.', emotionalContext: 'Longing, intimacy, satisfaction' },
  { id: 'w17', title: 'Imela (Thank You)', artist: 'Nathaniel Bassey ft. Enitan Adaba', theme: 'Gratitude', why: 'Pure gratitude in Igbo and English. For when words in your own language aren\'t enough.', searchQuery: 'Imela Nathaniel Bassey', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=imela+nathaniel+bassey', spotifySearchUrl: 'https://open.spotify.com/search/Imela%20Nathaniel%20Bassey', lyricTheme: 'Thank You Lord. Imela. There are no words adequate for Your goodness.', emotionalContext: 'Gratitude, testimony, overflow' },
  { id: 'w18', title: 'You Are Great', artist: 'Michael Smith / Various', theme: 'Exaltation', why: 'Simple, repeated truth. Sometimes the deepest prayers are the simplest ones.', searchQuery: 'You Are Great worship song', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=you+are+great+worship', spotifySearchUrl: 'https://open.spotify.com/search/You%20Are%20Great%20worship', lyricTheme: 'You are great. There is none like You.', emotionalContext: 'Adoration, simplicity, truth' },
  // Hymns reimagined — not religious ritual, but theologically deep
  { id: 'w19', title: 'It Is Well With My Soul', artist: 'Kristene DiMarco / Bethel', theme: 'Peace in Pain', why: 'Written by a man who lost his daughters at sea. Sung from the deepest place of surrender. For your hardest moments.', searchQuery: 'It Is Well Bethel Kristene DiMarco', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=it+is+well+bethel+kristene+dimarco', spotifySearchUrl: 'https://open.spotify.com/search/It%20Is%20Well%20Bethel', lyricTheme: 'Whatever my lot, Thou hast taught me to say: it is well.', emotionalContext: 'Grief, loss, peace, surrender' },
  { id: 'w20', title: 'Great is Thy Faithfulness', artist: 'Various modern versions', theme: 'God\'s Faithfulness', why: 'One of the most theologically rich declarations of God\'s character ever written. Morning by morning.', searchQuery: 'Great is Thy Faithfulness modern worship', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=great+is+thy+faithfulness+modern', spotifySearchUrl: 'https://open.spotify.com/search/Great%20Is%20Thy%20Faithfulness', lyricTheme: 'Morning by morning, new mercies I see. All I have needed Thy hand hath provided.', emotionalContext: 'Morning devotion, faithfulness, history with God' },
  { id: 'w21', title: 'Come Thou Fount', artist: 'Sufjan Stevens / Various', theme: 'Prone to Wander', why: 'The most honest hymn ever written. "Prone to wander, Lord I feel it, prone to leave the God I love." It names the struggle and surrenders it.', searchQuery: 'Come Thou Fount worship modern', youtubeSearchUrl: 'https://www.youtube.com/results?search_query=come+thou+fount+modern+worship', spotifySearchUrl: 'https://open.spotify.com/search/Come%20Thou%20Fount', lyricTheme: 'Here I raise my Ebenezer — hither by Thy help I\'m come.', emotionalContext: 'Honesty, struggle, returning to God' },
];

export function getSongsForMood(mood: string): WorshipSong[] {
  const map: Record<string, string[]> = {
    anxious: ['w5', 'w12', 'w2', 'w3'],
    grateful: ['w1', 'w17', 'w9', 'w20'],
    broken: ['w6', 'w7', 'w19', 'w10'],
    seeking: ['w3', 'w8', 'w21', 'w16'],
    adoring: ['w4', 'w11', 'w14', 'w13'],
    surrendering: ['w7', 'w8', 'w15', 'w3'],
    fighting: ['w12', 'w5', 'w2', 'w10'],
    still: ['w15', 'w16', 'w19', 'w20'],
  };
  const ids = map[mood] || Object.keys(WORSHIP_SONGS.reduce((a, s) => ({ ...a, [s.id]: true }), {})).slice(0, 4);
  return WORSHIP_SONGS.filter(s => ids.includes(s.id));
}

// ── Prayer Prompts API (extended) ──────────────────────────
export const EXTENDED_CALL_PROMPTS = [
  "What's been on your heart today that you haven't told Me?",
  "Where did you see Me working in your life this week?",
  "What fear are you still holding that you haven't given Me?",
  "If you heard My voice clearly right now, what would you want Me to say?",
  "What habit are you forming that's pulling you closer — or further — from Me?",
  "Who in your life needs you to show them My love right now?",
  "What are you grateful for that you haven't thanked Me for yet?",
  "Is there someone you need to forgive? Let's talk about it.",
  "What does holiness look like in your life this season?",
  "What dream have you been afraid to bring to Me?",
  "Where are you striving when I've asked you to rest?",
  "What's the last thing I said to you that you still haven't acted on?",
  "Tell Me about a moment this week where you felt My presence.",
  "What is confusing you about your faith right now? Be honest.",
  "Who are you becoming? Do you like who you're becoming?",
  "What would you do differently today if you truly believed I was watching?",
  "Is there a sin you've been carrying that you haven't confessed to Me?",
  "What does it mean to love Me with all your heart today, practically?",
  "Where do you need My wisdom most right now?",
  "If you had five minutes left to live, what would you want to say to Me?",
  "What conversation have you been avoiding — with Me or with someone I've put in your life?",
  "What does your prayer life tell you about how much you trust Me?",
  "Where are you bleeding right now that you haven't shown Me?",
  "What are you building? And have you asked Me if it's what I want built?",
  "When was the last time you were genuinely still in My presence?",
  "What lie are you believing about yourself that I need to correct?",
  "What would it look like for you to love your enemy today — specifically?",
  "Where are you performing for people instead of living for Me?",
  "What part of My character do you not fully trust yet?",
  "Is your ambition serving My kingdom or just your comfort?",
  "What does it mean to you today that I call you My child?",
  "Where is your treasure? Where is most of your mental energy going?",
  "What is the one thing I've been asking you to do that you keep delaying?",
  "How have you changed in the last year? What have I worked in you?",
  "Are you walking in the fruit of what I told you — or are you still waiting for more information?",
];

// ── God's Character Revelation (for daily 'Know Him' feature) ──
export const GOD_ATTRIBUTES = [
  {
    name: 'His Patience',
    verse: '2 Peter 3:9',
    verseText: 'The Lord is not slow in keeping his promise, as some understand slowness. Instead he is patient with you, not wanting anyone to perish.',
    reflection: 'God\'s delay is never abandonment. It\'s patience — the kind that leaves room for you to come back, to grow, to be ready. His timing isn\'t about your schedule. It\'s about His love.',
    question: 'Where in your life have you mistaken His patience for His absence?',
  },
  {
    name: 'His Jealousy',
    verse: 'Exodus 34:14',
    verseText: 'Do not worship any other god, for the Lord, whose name is Jealous, is a jealous God.',
    reflection: 'God\'s jealousy isn\'t insecurity — it\'s love that refuses to share you with things that will destroy you. He is jealous not for His reputation, but for your soul. He knows what happens when you give yourself to idols. He fights for you.',
    question: 'What in your life is receiving the devotion, trust, or time that belongs to God?',
  },
  {
    name: 'His Nearness',
    verse: 'Psalm 34:18',
    verseText: 'The Lord is close to the broken-hearted and saves those who are crushed in spirit.',
    reflection: 'God doesn\'t stand far away and watch you suffer. He runs toward the broken. His presence intensifies in pain, not retreats from it. The most crushed moments of your life are the moments He is closest.',
    question: 'In your current pain — can you feel Him near? If not, tell Him. He can handle the accusation.',
  },
  {
    name: 'His Faithfulness',
    verse: 'Lamentations 3:22-23',
    verseText: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning.',
    reflection: 'Faithfulness is the attribute that holds every other promise in place. He can\'t break His word. He can\'t change His mind about you. He can\'t run out of compassion. His faithfulness is the ground everything else stands on.',
    question: 'What promise of God have you been treating as conditional — as if He might change His mind?',
  },
  {
    name: 'His Creativity',
    verse: 'Genesis 1:1',
    verseText: 'In the beginning God created the heavens and the earth.',
    reflection: 'The first thing revealed about God is that He creates. Not because He needed to — but because creation is an expression of who He is. That same creative God made you. He is creative in your situation too. He doesn\'t use the same solution twice.',
    question: 'What "dead end" situation are you in that needs God\'s creativity — not your problem-solving?',
  },
  {
    name: 'His Holiness',
    verse: 'Isaiah 6:3',
    verseText: 'Holy, holy, holy is the Lord Almighty; the whole earth is full of his glory.',
    reflection: 'Holiness isn\'t a rule — it\'s a reality about who God is. He is completely set apart from everything that is corrupt, broken, or false. And when you come near Him, His holiness doesn\'t reject you — it transforms you. Isaiah walked in broken; he walked out commissioned.',
    question: 'What in your life would change if you truly believed God\'s holiness was as real as your daily routine?',
  },
  {
    name: 'His Gentleness',
    verse: 'Isaiah 42:3',
    verseText: 'A bruised reed he will not break, and a smouldering wick he will not snuff out.',
    reflection: 'He is the most powerful being in existence — and He handles bruised, barely-holding-on people with complete tenderness. He doesn\'t discard the almost-extinguished. He cups His hands around the flame and breathes life back into it.',
    question: 'What part of you feels like a bruised reed right now? Give it to His gentleness instead of hiding it from His power.',
  },
];

// ── Reflection Questions (for deeper intimacy) ────────────
export const DEEP_REFLECTION_QUESTIONS = [
  { category: 'Identity', question: 'If everything you\'ve built, earned, or become was stripped away tomorrow — who would you be before God?' },
  { category: 'Obedience', question: 'What is the clearest thing God has asked you to do that you haven\'t done yet? What\'s the real reason?' },
  { category: 'Prayer', question: 'If your prayer life was a relationship, what kind of relationship would it be — intimate, formal, distant, one-sided?' },
  { category: 'Sin', question: 'What sin feels comfortable enough that you\'ve stopped calling it sin? What would it mean to bring it fully into the light?' },
  { category: 'Forgiveness', question: 'Who are you holding a record against? What has holding it cost you?' },
  { category: 'Faith', question: 'What is the area of your life where you need faith most right now? What does trusting God there actually look like?' },
  { category: 'Purpose', question: 'What breaks your heart that you think also breaks God\'s? Could that be a clue to your calling?' },
  { category: 'Gratitude', question: 'What blessing in your life have you stopped noticing? When did it become background noise?' },
  { category: 'Community', question: 'Who is sharpening you right now? And who are you sharpening? Is iron meeting iron — or just comfort meeting comfort?' },
  { category: 'Eternity', question: 'If you knew you were meeting God in 30 days, what would you do differently tomorrow?' },
];
