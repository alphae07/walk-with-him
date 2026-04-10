// ────────────────────────────────────────────────────────────
//  WALK WITH HIM — Static Data
// ────────────────────────────────────────────────────────────

export const LEVELS = [
  { level: 1,  name: 'Seeker',             minXP: 0,       maxXP: 1000,    emoji: '🌱', color: '#6B8E73' },
  { level: 2,  name: 'Awakened',           minXP: 1000,    maxXP: 5000,    emoji: '🌤', color: '#7EB8D4' },
  { level: 3,  name: 'Walker',             minXP: 5000,    maxXP: 15000,   emoji: '🚶', color: '#87A96B' },
  { level: 4,  name: 'Disciple',           minXP: 15000,   maxXP: 35000,   emoji: '📖', color: '#5B9BD5' },
  { level: 5,  name: 'Faithful One',       minXP: 35000,   maxXP: 75000,   emoji: '🛡️', color: '#C8922A' },
  { level: 6,  name: 'Beloved',            minXP: 75000,   maxXP: 150000,  emoji: '❤️', color: '#E91E8C' },
  { level: 7,  name: 'Covenant Keeper',    minXP: 150000,  maxXP: 280000,  emoji: '🤝', color: '#9B59B6' },
  { level: 8,  name: 'Friend of God',      minXP: 280000,  maxXP: 500000,  emoji: '✨', color: '#F39C12' },
  { level: 9,  name: 'Son of Fire',        minXP: 500000,  maxXP: 800000,  emoji: '🔥', color: '#E74C3C' },
  { level: 10, name: 'Man After His Heart', minXP: 800000, maxXP: Infinity, emoji: '👑', color: '#FFD700' },
];

export const XP_REWARDS = {
  answerCall: 50,
  declineCall: -30,
  journalEntry: 80,
  godSighting: 40,
  bibleChapterRead: 35,
  verseOfDay: 20,
  purposeEntry: 45,
  miniGameWon: 60,
  fastCompleted: 150,
  bookSummary: 200,
  hourOfSilence: 100,
  prayerRetreat: 250,
  missedDay: -5,
};

export const CALL_PROMPTS = [
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
];

export const VERSE_OF_DAY = [
  { text: "For I know the plans I have for you, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" },
  { text: "I can do all this through him who gives me strength.", ref: "Philippians 4:13" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
  { text: "The Lord is my shepherd, I lack nothing.", ref: "Psalm 23:1" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", ref: "Joshua 1:9" },
  { text: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
  { text: "For God so loved the world that he gave his one and only Son.", ref: "John 3:16" },
  { text: "And we know that in all things God works for the good of those who love him.", ref: "Romans 8:28" },
  { text: "The Lord your God is with you, the Mighty Warrior who saves.", ref: "Zephaniah 3:17" },
  { text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", ref: "Romans 12:2" },
  { text: "No weapon forged against you will prevail, and you will refute every tongue that accuses you.", ref: "Isaiah 54:17" },
  { text: "Seek first his kingdom and his righteousness, and all these things will be given to you as well.", ref: "Matthew 6:33" },
  { text: "The name of the Lord is a fortified tower; the righteous run to it and are safe.", ref: "Proverbs 18:10" },
  { text: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.", ref: "2 Timothy 1:7" },
  { text: "Cast all your anxiety on him because he cares for you.", ref: "1 Peter 5:7" },
  { text: "Draw near to God and he will draw near to you.", ref: "James 4:8" },
  { text: "My grace is sufficient for you, for my power is made perfect in weakness.", ref: "2 Corinthians 12:9" },
  { text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.", ref: "Isaiah 40:31" },
  { text: "The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full.", ref: "John 10:10" },
  { text: "Greater is he that is in you, than he that is in the world.", ref: "1 John 4:4" },
  { text: "For I am convinced that neither death nor life... will be able to separate us from the love of God.", ref: "Romans 8:38-39" },
  { text: "The Lord is close to the broken-hearted and saves those who are crushed in spirit.", ref: "Psalm 34:18" },
  { text: "Delight yourself in the Lord, and he will give you the desires of your heart.", ref: "Psalm 37:4" },
  { text: "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit.", ref: "John 15:5" },
  { text: "You will seek me and find me when you seek me with all your heart.", ref: "Jeremiah 29:13" },
  { text: "The heart of man plans his way, but the Lord establishes his steps.", ref: "Proverbs 16:9" },
  { text: "Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God.", ref: "Philippians 4:6" },
  { text: "He who began a good work in you will carry it on to completion until the day of Christ Jesus.", ref: "Philippians 1:6" },
  { text: "Taste and see that the Lord is good; blessed is the one who takes refuge in him.", ref: "Psalm 34:8" },
  { text: "Every good and perfect gift is from above, coming down from the Father of heavenly lights.", ref: "James 1:17" },
];

// ── BOOKS OF THE MONTH (2024–2030) ──────────────────────────
export const BOOKS_OF_MONTH: Record<string, { title: string; author: string; description: string; prompt: string }> = {
  '2024-01': { title: 'Knowing God', author: 'J.I. Packer', description: 'A foundational exploration of who God really is — His nature, attributes, and how to know Him personally.', prompt: 'What attribute of God impacted you most, and how will you live differently because of it?' },
  '2024-02': { title: 'The Practice of the Presence of God', author: 'Brother Lawrence', description: 'Simple, profound. A monk\'s secret to finding God in the ordinary moments of life.', prompt: 'What routine in your day could become a moment of God\'s presence?' },
  '2024-03': { title: 'Mere Christianity', author: 'C.S. Lewis', description: 'The most reasonable, airtight case for Christian faith ever written. Lewis answers the hardest questions.', prompt: 'Which argument in the book surprised or challenged you most?' },
  '2024-04': { title: 'The Pursuit of God', author: 'A.W. Tozer', description: 'A cry for deeper fellowship with God. Tozer tears away the religious and shows what hunger for God looks like.', prompt: 'What is one veil between you and God that this book named?' },
  '2024-05': { title: 'Experiencing God', author: 'Henry Blackaby', description: 'How to know and do the will of God by recognising where He is already at work.', prompt: 'Where do you see God working around you that He may be inviting you to join?' },
  '2024-06': { title: 'The Cross and the Switchblade', author: 'David Wilkerson', description: 'An electrifying true story of a pastor who followed God into New York\'s most violent streets. Faith in action.', prompt: 'What "impossible" situation is God asking you to step into with only His Word as backup?' },
  '2024-07': { title: 'Abide in Christ', author: 'Andrew Murray', description: 'Day-by-day meditations on what it means to remain in Jesus. The fruit comes from staying connected to the vine.', prompt: 'What distracts you most from simply staying in Christ? What one thing will you do about it?' },
  '2024-08': { title: 'The Holy Spirit', author: 'Billy Graham', description: 'Clear, Bible-anchored teaching on the person and work of the Holy Spirit in a believer\'s daily life.', prompt: 'How has your understanding of the Holy Spirit changed? How does this change how you pray?' },
  '2024-09': { title: 'The Screwtape Letters', author: 'C.S. Lewis', description: 'Letters from a senior demon to a junior tempter. Wickedly funny and terrifyingly accurate about spiritual warfare.', prompt: 'Which "tactic" described in the book have you noticed the enemy using in your life?' },
  '2024-10': { title: 'God Came Near', author: 'Max Lucado', description: 'The Incarnation made personal — Jesus chose to enter our mess. This book makes the Gospel feel new again.', prompt: 'How does knowing Jesus lived as a human change the way you approach Him in prayer?' },
  '2024-11': { title: 'Wild at Heart', author: 'John Eldredge', description: 'What does God say about your masculinity (or femininity)? This book goes deep into identity and calling.', prompt: 'What wound in your past have you not yet brought to God? What does He say about it?' },
  '2024-12': { title: 'A Long Obedience in the Same Direction', author: 'Eugene Peterson', description: 'Discipleship is not a sprint. Peterson uses the Psalms of Ascent to trace the slow, steady walk of faith.', prompt: 'What does sustained, undramatic faithfulness look like in your life right now?' },
  '2025-01': { title: 'Sit, Walk, Stand', author: 'Watchman Nee', description: 'The Christian life in three postures — rest in grace, walk in the Spirit, withstand the enemy.', prompt: 'Which posture — sitting, walking, or standing — do you find hardest? Why?' },
  '2025-02': { title: 'The Attributes of God', author: 'A.W. Pink', description: 'A deep doctrinal study of God\'s sovereignty, holiness, wisdom, and more. Not easy — but transforming.', prompt: 'Which attribute of God do you most need to embrace in your current season?' },
  '2025-03': { title: 'Radical', author: 'David Platt', description: 'A provocative challenge to the comfortable, consumer-driven faith that has infected modern Christianity.', prompt: 'What comfortable thing is God asking you to give up for the sake of His kingdom?' },
  '2025-04': { title: 'The God Who Hears', author: 'W. Bingham Hunter', description: 'A practical, honest guide to prayer — why God sometimes seems silent and how to keep praying anyway.', prompt: 'What have you been praying for that feels unanswered? What does this book say about that?' },
  '2025-05': { title: 'Destined to Reign', author: 'Joseph Prince', description: 'Grace — not effort — is the key to living above sin and experiencing God\'s abundance. A controversial but powerful read.', prompt: 'How has your view of grace changed? How does it change how you approach failure?' },
  '2025-06': { title: 'The Bondage Breaker', author: 'Neil T. Anderson', description: 'Find and break free from the spiritual strongholds and lies that have controlled your thinking and behavior.', prompt: 'What lie about yourself or God have you been believing? What is the truth?' },
  '2025-07': { title: 'Knowing Him by Name', author: 'Tony Evans', description: 'Every name of God in the Bible reveals a dimension of His character that meets a real need in your life.', prompt: 'Which name of God speaks most to your current need, and why?' },
  '2025-08': { title: 'Fervent', author: 'Priscilla Shirer', description: 'A strategic prayer guide — written from a woman\'s heart — to do spiritual warfare in every area of life.', prompt: 'What area of your life needs the most targeted, strategic prayer right now?' },
  '2025-09': { title: 'Deeper', author: 'Dane Ortlund', description: 'How the Christian actually grows — not by trying harder, but by sinking deeper into Christ\'s gentleness and grace.', prompt: 'What does Ortlund say about the heart of Jesus that you most needed to hear?' },
  '2025-10': { title: 'The Prodigal God', author: 'Timothy Keller', description: 'The parable of the prodigal son retold — with the shocking insight that the elder brother is just as lost.', prompt: 'Which son do you identify with most right now — and what does the Father say to you?' },
  '2025-11': { title: 'When God Doesn\'t Make Sense', author: 'James Dobson', description: 'For those walking through pain, confusion, and unanswered questions. Honest, biblical, deeply comforting.', prompt: 'What trial or confusion in your life has this book brought light to?' },
  '2025-12': { title: 'Let God Be God', author: 'Ray Pritchard', description: 'A call to stop managing God and start trusting Him completely — even when you don\'t understand His ways.', prompt: 'In what area of your life have you been managing God rather than trusting Him?' },
  '2026-01': { title: 'The Normal Christian Life', author: 'Watchman Nee', description: 'What does an ordinary Christian life actually look like if you live by the Spirit, not the flesh?', prompt: 'What part of your daily life feels least surrendered to the Spirit? What\'s one step to change that?' },
  '2026-02': { title: 'Confessions', author: 'Augustine', description: 'The most famous autobiography in Christian history. A restless soul finding rest only in God. Brutally honest.', prompt: 'What statement from Augustine\'s journey resonates most with your own?' },
  '2026-03': { title: 'Forgotten God', author: 'Francis Chan', description: 'The Holy Spirit is the most neglected member of the Trinity. Chan calls us back to a Spirit-filled life.', prompt: 'What would change in your daily life if you truly gave the Holy Spirit control?' },
  '2026-04': { title: 'The Life You\'ve Always Wanted', author: 'John Ortberg', description: 'Spiritual disciplines not as duties but as training for the life of joy and freedom God intends.', prompt: 'Which spiritual discipline has the most potential to change you in this season?' },
  '2026-05': { title: 'The Weight of Glory', author: 'C.S. Lewis', description: 'A collection of essays that expand your imagination of God\'s glory and what we were made for.', prompt: 'How has this book expanded your vision of what heaven and glory actually mean?' },
  '2026-06': { title: 'New Morning Mercies', author: 'Paul Tripp', description: '365 devotionals that meet you in ordinary days with gospel grace. Daily and grounding.', prompt: 'Which month\'s devotions spoke most directly into your current season, and why?' },
  '2026-07': { title: 'Surprised by Joy', author: 'C.S. Lewis', description: 'Lewis\'s account of his conversion — from atheism to the most reluctant believer in all of England.', prompt: 'What moments of longing or "joy" in your own life were actually God calling you to Himself?' },
  '2026-08': { title: 'Keep Your Love On', author: 'Danny Silk', description: 'How to maintain powerful connections even in difficult relationships, the way God loves us.', prompt: 'Which relationship in your life needs you to "keep your love on" regardless of how they respond?' },
  '2026-09': { title: 'The Power of the Blood Covenant', author: 'Malcolm Smith', description: 'Understanding God\'s covenant promises unlocks a boldness and security most Christians never experience.', prompt: 'How does understanding covenant change how you approach God and His promises?' },
  '2026-10': { title: 'Jesus Calling', author: 'Sarah Young', description: 'Daily devotionals written from God\'s perspective — intimate, personal, scripture-saturated.', prompt: 'Which devotional this month felt like God was speaking directly to your situation?' },
  '2026-11': { title: 'Daring Greatly', author: 'Brené Brown', description: 'Vulnerability as strength — and how shame keeps us from the deep connection God designed us for.', prompt: 'What area of your life do you most need to bring into the light — with God and with safe people?' },
  '2026-12': { title: 'The Gospel in a Pluralist Society', author: 'Lesslie Newbigin', description: 'How do you hold to truth in a world that says all religions are equal? Newbigin\'s answer is brilliant.', prompt: 'How has this book strengthened your confidence in the uniqueness of Christ?' },
  '2027-01': { title: 'Emotionally Healthy Spirituality', author: 'Pete Scazzero', description: 'The startling truth: you can\'t be spiritually mature while remaining emotionally immature.', prompt: 'What emotional wound or pattern have you spiritualised away rather than truly healing?' },
  '2027-02': { title: 'The Holiness of God', author: 'R.C. Sproul', description: 'God\'s holiness is the most foundational thing about Him. Sproul\'s masterpiece changes how you see God and yourself.', prompt: 'How does a clearer view of God\'s holiness change how you approach worship and sin?' },
  '2027-03': { title: 'In His Image', author: 'Jen Wilkin', description: 'Ten attributes of God — and how becoming like Him is the core call of the Christian life.', prompt: 'Which attribute of God are you most unlike right now, and what is one way to change that?' },
  '2027-04': { title: 'God Is Able', author: 'Priscilla Shirer', description: 'Ephesians 3:20 unpacked — God can do more than you ask or imagine. A faith-expanding, prayer-igniting read.', prompt: 'What have you stopped asking God for because you decided it was impossible?' },
  '2027-05': { title: 'The Freedom of Self-Forgetfulness', author: 'Timothy Keller', description: 'A short, brilliant essay on true humility — not thinking less of yourself but thinking of yourself less.', prompt: 'How does self-forgetfulness change how you handle criticism, comparison, and ambition?' },
  '2027-06': { title: 'The Cost of Discipleship', author: 'Dietrich Bonhoeffer', description: 'Cheap grace vs. costly grace. Written by a man who died for his faith. The ultimate call to follow Christ.', prompt: 'What would it cost you personally to fully obey what Christ is asking of you right now?' },
  '2027-07': { title: 'Hinds\' Feet on High Places', author: 'Hannah Hurnard', description: 'An allegory of the soul\'s journey with the Shepherd through pain into the high places of love.', prompt: 'Which character or stage of Much-Afraid\'s journey most mirrors your current walk with God?' },
  '2027-08': { title: 'The Reason for God', author: 'Timothy Keller', description: 'Keller engages the sharpest critics of Christianity with clarity, intelligence, and grace.', prompt: 'Which objection to Christianity did this book answer most convincingly for you?' },
  '2027-09': { title: 'My Utmost for His Highest', author: 'Oswald Chambers', description: 'The classic daily devotional that has shaped more Christian leaders than almost any other book.', prompt: 'Which September devotional set the tone for your relationship with God this month?' },
  '2027-10': { title: 'Sacred Fire', author: 'Ronald Rolheiser', description: 'What does mature, long-haul discipleship look like? This is the faith of someone who has followed Christ for decades.', prompt: 'What does faithful discipleship look like in middle life, not just in the early fire of conversion?' },
  '2027-11': { title: 'Boundaries with God', author: 'Henry Cloud & John Townsend', description: 'Honest, liberating truth about how God relates to us — not as a controlling parent but as a loving Father.', prompt: 'What false belief about God\'s nature has been affecting the way you relate to Him?' },
  '2027-12': { title: 'Love Does', author: 'Bob Goff', description: 'What if faith was less about believing the right things and more about doing the loving thing? Wildly inspiring.', prompt: 'What one act of love has God been prompting you toward that you\'ve been overthinking?' },
  '2028-01': { title: 'God in the Dark', author: 'Os Guinness', description: 'A guide to wrestling with doubt honestly — and why doubt, handled well, leads to deeper faith.', prompt: 'What honest doubt have you been afraid to bring to God? What does this book say about that?' },
  '2028-02': { title: 'The Message of the Psalms', author: 'Walter Brueggemann', description: 'The Psalms are the prayer book of the Bible. Brueggemann shows how to use them to express every human emotion.', prompt: 'Which Psalm has God used to meet you in a real emotion this month?' },
  '2028-03': { title: 'Not a Fan', author: 'Kyle Idleman', description: 'The difference between a fan of Jesus and an actual follower. A convicting, clear challenge.', prompt: 'In which specific area of your life are you more of a fan than a follower?' },
  '2028-04': { title: 'True Spirituality', author: 'Francis Schaeffer', description: 'What does authentic Christianity look like — not culturally, but truly, personally, moment by moment?', prompt: 'What does "true spirituality" look like in your most ordinary hours?' },
  '2028-05': { title: 'The Ruthless Elimination of Hurry', author: 'John Mark Comer', description: 'Hurry is the enemy of spiritual life. This is a manifesto for slow, intentional, God-centred living.', prompt: 'What would you have to say no to in order to say yes to a life of unhurried presence with God?' },
  '2028-06': { title: 'Spirit-Led Prayer', author: 'Mike Bickle', description: 'An advanced guide to intercession, prophetic prayer, and partnering with the Holy Spirit in prayer.', prompt: 'What area of prayer feels dry or mechanical? What does this book suggest about why — and how to change it?' },
  '2028-07': { title: 'Renovation of the Heart', author: 'Dallas Willard', description: 'How every dimension of your human nature — mind, will, body, soul — can be transformed into Christlikeness.', prompt: 'Which dimension of your person (mind, will, body, emotions, relationships) most needs renovation right now?' },
  '2028-08': { title: 'When Heaven Invades Earth', author: 'Bill Johnson', description: 'A vision of the Kingdom of God breaking into the present — and your role in bringing it.', prompt: 'What "kingdom moment" have you experienced that this book helped you understand?' },
  '2028-09': { title: 'Hearing God', author: 'Dallas Willard', description: 'A definitive, grounded guide to how God speaks — through Scripture, circumstances, community, and inner witness.', prompt: 'What has God been saying to you lately through each of the four channels Willard describes?' },
  '2028-10': { title: 'The Presence of God', author: 'Jim Cymbala', description: 'What happens when the local church — and individual believers — truly hunger for God\'s manifest presence?', prompt: 'What does your hunger for God\'s presence look like, practically, in your daily life?' },
  '2028-11': { title: 'Surprised by the Voice of God', author: 'Jack Deere', description: 'Biblically rooted exploration of how God still speaks today through prophecy, dreams, and inner voice.', prompt: 'What has God spoken to you this month through an unexpected channel?' },
  '2028-12': { title: 'The Divine Conspiracy', author: 'Dallas Willard', description: 'The Kingdom of the Heavens is available now. Willard\'s masterwork on what discipleship in this world actually means.', prompt: 'How has this book changed your understanding of what Jesus was actually teaching?' },
  '2029-01': { title: 'You Are What You Love', author: 'James K.A. Smith', description: 'We are shaped more by our habits and desires than our beliefs. What are you actually training yourself to love?', prompt: 'What habit in your daily life is shaping what you love — for better or worse?' },
  '2029-02': { title: 'The God of All Comfort', author: 'Hannah Whitall Smith', description: 'God is not merely a God who comforts — He is comfort itself. For those in pain, this is deeply healing.', prompt: 'What grief or pain is God meeting you in right now, and what do you hear Him saying?' },
  '2029-03': { title: 'Face to Face', author: 'Kenneth Boa', description: 'Praying the Scriptures and experiencing intimacy with God beyond information-based Christianity.', prompt: 'What does it mean to you, personally, to seek God\'s face rather than His hand?' },
  '2029-04': { title: 'The Deeply Formed Life', author: 'Rich Villodas', description: 'Five hidden things that form a Christ-like character — solitude, sexuality, racial justice, reconciliation, and mission.', prompt: 'Which of the five hidden rhythms is most absent from your life, and what\'s one step toward it?' },
  '2029-05': { title: 'Moses: A Man of Selfless Dedication', author: 'Charles Swindoll', description: 'Moses\'s life as a map for yours — from brokenness to purpose to legacy. For anyone in transition.', prompt: 'Which season of Moses\'s life mirrors where you are right now? What did God do in that season for Moses?' },
  '2029-06': { title: 'The God I Never Knew', author: 'Robert Morris', description: 'The Holy Spirit — not as theological concept but as real, personal Presence in everyday life.', prompt: 'What part of the Holy Spirit\'s personality surprised you most in this book?' },
  '2029-07': { title: 'Intimate with God', author: 'Andrew Murray', description: 'A call to daily, deep, uninterrupted fellowship with God — and how to cultivate it practically.', prompt: 'What one discipline will you commit to this month to deepen your daily intimacy with God?' },
  '2029-08': { title: 'Letters to the Church', author: 'Francis Chan', description: 'A brutally honest look at what the church has become versus what Jesus intended — and a vision for something better.', prompt: 'What is God asking you to contribute to the church\'s return to its first love?' },
  '2029-09': { title: 'The Prayer of Jabez', author: 'Bruce Wilkinson', description: 'One ancient prayer that unlocked a life of extraordinary blessing. Simple. Powerful. Transforming.', prompt: 'What "territory" is God asking you to expand into — and are you willing to ask for it?' },
  '2029-10': { title: 'Every Good Endeavor', author: 'Timothy Keller', description: 'Theology of work — why your job matters to God, how the gospel transforms work, and what you\'re really called to.', prompt: 'How does seeing your work as a vocation rather than just a job change how you show up this week?' },
  '2029-11': { title: 'The Gift of Being Yourself', author: 'David Benner', description: 'True self-knowledge is inseparable from knowing God. This book integrates psychology and spirituality beautifully.', prompt: 'What false self do you perform that God is inviting you to lay down in His presence?' },
  '2029-12': { title: 'A Praying Life', author: 'Paul Miller', description: 'The most practical, honest, and transforming book on prayer in a generation. For everyone who struggles to pray.', prompt: 'What \"prayer card\" would you write for the most important thing in your life right now?' },
  '2030-01': { title: 'The Explicit Gospel', author: 'Matt Chandler', description: 'The Gospel is not the door into Christianity — it\'s the whole house. Chandler shows why we must never move beyond it.', prompt: 'What part of the Gospel have you assumed rather than lived out this past year?' },
  '2030-02': { title: 'The Furious Longing of God', author: 'Brennan Manning', description: 'God is not disappointed in you. He is furiously, relentlessly, wildly in love with you. This book dismantles shame.', prompt: 'What shame or failure have you been hiding from God? What does He say about it in this book?' },
  '2030-03': { title: 'Unceasing Prayer', author: 'Roy Hession', description: 'Practical teaching on the life of constant fellowship with God, not just set prayer times.', prompt: 'What does "praying without ceasing" actually look like for you, today?' },
  '2030-04': { title: 'God Without Religion', author: 'Andrew Farley', description: 'What if the religious performance is actually the thing keeping you from God? A liberation theology of grace.', prompt: 'What religious habit do you practice out of duty that God is asking you to replace with desire?' },
  '2030-05': { title: 'The Spirit of the Disciplines', author: 'Dallas Willard', description: 'Why spiritual disciplines actually work — the mechanics behind transformation into Christlikeness.', prompt: 'Which discipline has been most transforming for you, and why?' },
  '2030-06': { title: 'Walking with God', author: 'John Eldredge', description: 'A year of daily conversations with God. The journal of a man learning to hear God in his ordinary life.', prompt: 'What has God said to you specifically in a "walking moment" — a regular, unhurried time — recently?' },
  '2030-07': { title: 'Live No Lies', author: 'John Mark Comer', description: 'Three enemies of the soul — the world, the flesh, and the devil — and how to defeat them with truth.', prompt: 'Which lie (from the world, the flesh, or the devil) has the most grip on your life right now?' },
  '2030-08': { title: 'Celebration of Discipline', author: 'Richard Foster', description: 'The classic. 12 disciplines. Three categories — inward, outward, corporate. The roadmap to Christian freedom.', prompt: 'Which of the 12 disciplines is most underdeveloped in your spiritual life, and what would developing it look like?' },
  '2030-09': { title: 'The Sacred Romance', author: 'Brent Curtis & John Eldredge', description: 'Your heart is not too much — it was made for a great romance with God. This book recovers the story.', prompt: 'What desire of your heart have you buried because it felt too big or too dangerous?' },
  '2030-10': { title: 'Simply Christian', author: 'N.T. Wright', description: 'Christianity\'s core claims — examined with rigor, clarity, and hope. For doubters, seekers, and committed believers.', prompt: 'What makes Christianity beautiful and distinct from all other worldviews, in your own words?' },
  '2030-11': { title: 'The Way of the Dragon or the Way of the Lamb', author: 'Jamin Goggin & Kyle Strobel', description: 'Power. The world\'s way is force. God\'s way is weakness. This book reorients everything.', prompt: 'Where in your life are you pursuing power in the world\'s way rather than God\'s?' },
  '2030-12': { title: 'Here I Am to Worship', author: 'Tim Hughes', description: 'Worship is not a Sunday service — it\'s a whole life. This book recovers what it means to live as a worshipper.', prompt: 'What would your life look like if everything — work, rest, relationships — was an act of worship?' },
};

// ── SERMONS ────────────────────────────────────────────────
export const SERMONS = [
  // Apostle Joshua Selman
  { id: 's1', preacher: 'Apostle Joshua Selman', title: 'The Mystery of the Kingdom', url: 'https://www.youtube.com/results?search_query=apostle+joshua+selman+mystery+kingdom', thumbnail: '🔥', category: 'Kingdom' },
  { id: 's2', preacher: 'Apostle Joshua Selman', title: 'Knowing God Personally', url: 'https://www.youtube.com/results?search_query=apostle+joshua+selman+knowing+god+personally', thumbnail: '✨', category: 'Intimacy' },
  { id: 's3', preacher: 'Apostle Joshua Selman', title: 'Grace and Truth', url: 'https://www.youtube.com/results?search_query=apostle+joshua+selman+grace+and+truth', thumbnail: '🙏', category: 'Grace' },
  { id: 's4', preacher: 'Apostle Joshua Selman', title: 'The Place of Prayer', url: 'https://www.youtube.com/results?search_query=apostle+joshua+selman+place+of+prayer', thumbnail: '💫', category: 'Prayer' },
  { id: 's5', preacher: 'Apostle Joshua Selman', title: 'Walking in the Spirit', url: 'https://www.youtube.com/results?search_query=apostle+joshua+selman+walking+in+the+spirit', thumbnail: '🌬️', category: 'Holy Spirit' },
  { id: 's6', preacher: 'Apostle Joshua Selman', title: 'Dimensions of Faith', url: 'https://www.youtube.com/results?search_query=apostle+joshua+selman+dimensions+of+faith', thumbnail: '🛡️', category: 'Faith' },
  { id: 's7', preacher: 'Apostle Joshua Selman', title: 'The Fire of God', url: 'https://www.youtube.com/results?search_query=apostle+joshua+selman+fire+of+god', thumbnail: '🔥', category: 'Revival' },
  // E.A. Adeboye
  { id: 's8', preacher: 'Pastor E.A. Adeboye', title: 'Open Heavens Devotional', url: 'https://www.youtube.com/results?search_query=adeboye+open+heavens+2024', thumbnail: '☁️', category: 'Devotional' },
  { id: 's9', preacher: 'Pastor E.A. Adeboye', title: 'When God Speaks', url: 'https://www.youtube.com/results?search_query=adeboye+when+god+speaks', thumbnail: '📢', category: 'Prophetic' },
  // Chris Oyakhilome
  { id: 's10', preacher: 'Pastor Chris Oyakhilome', title: 'The Holy Spirit in You', url: 'https://www.youtube.com/results?search_query=pastor+chris+oyakhilome+holy+spirit', thumbnail: '🌬️', category: 'Holy Spirit' },
  { id: 's11', preacher: 'Pastor Chris Oyakhilome', title: 'Your Rights in Christ', url: 'https://www.youtube.com/results?search_query=pastor+chris+oyakhilome+rights+in+christ', thumbnail: '✊', category: 'Identity' },
  // David Ibiyeomie
  { id: 's12', preacher: 'Pastor David Ibiyeomie', title: 'Divine Wisdom for Life', url: 'https://www.youtube.com/results?search_query=david+ibiyeomie+divine+wisdom', thumbnail: '💡', category: 'Wisdom' },
  // Sam Adeyemi
  { id: 's13', preacher: 'Sam Adeyemi', title: 'Purpose and Destiny', url: 'https://www.youtube.com/results?search_query=sam+adeyemi+purpose+destiny', thumbnail: '🎯', category: 'Purpose' },
  // Femi Lazarus
  { id: 's14', preacher: 'Femi Lazarus', title: 'Intimacy with God', url: 'https://www.youtube.com/results?search_query=femi+lazarus+intimacy+with+god', thumbnail: '❤️', category: 'Intimacy' },
  // Tobi Adegboyega
  { id: 's15', preacher: 'Pastor Tobi Adegboyega', title: 'Faith that Works', url: 'https://www.youtube.com/results?search_query=tobi+adegboyega+faith', thumbnail: '⚡', category: 'Faith' },
  // Touré Roberts
  { id: 's16', preacher: 'Touré Roberts', title: 'Wholeness', url: 'https://www.youtube.com/results?search_query=toure+roberts+wholeness', thumbnail: '🌟', category: 'Healing' },
  // Steven Furtick
  { id: 's17', preacher: 'Steven Furtick', title: 'Greater', url: 'https://www.youtube.com/results?search_query=steven+furtick+greater', thumbnail: '📈', category: 'Faith' },
  // Francis Chan
  { id: 's18', preacher: 'Francis Chan', title: 'Multiply', url: 'https://www.youtube.com/results?search_query=francis+chan+multiply+discipleship', thumbnail: '✖️', category: 'Discipleship' },
  { id: 's19', preacher: 'Francis Chan', title: 'Forgotten God', url: 'https://www.youtube.com/results?search_query=francis+chan+forgotten+god+holy+spirit', thumbnail: '🌬️', category: 'Holy Spirit' },
  // T.D. Jakes
  { id: 's20', preacher: 'Bishop T.D. Jakes', title: 'Crushing — God Turns Pressure Into Power', url: 'https://www.youtube.com/results?search_query=td+jakes+crushing+pressure+power', thumbnail: '💎', category: 'Faith' },
  { id: 's21', preacher: 'Bishop T.D. Jakes', title: 'Instinct — The Power to Unleash Your Inborn Drive', url: 'https://www.youtube.com/results?search_query=td+jakes+instinct+inborn+drive', thumbnail: '🦁', category: 'Purpose' },
  { id: 's22', preacher: 'Bishop T.D. Jakes', title: 'Woman Thou Art Loosed', url: 'https://www.youtube.com/results?search_query=td+jakes+woman+thou+art+loosed', thumbnail: '🕊️', category: 'Healing' },
  // Timothy Keller
  { id: 's23', preacher: 'Timothy Keller', title: 'The Prodigal God', url: 'https://www.youtube.com/results?search_query=timothy+keller+prodigal+god+sermon', thumbnail: '🏃', category: 'Grace' },
  { id: 's24', preacher: 'Timothy Keller', title: 'The Meaning of Marriage', url: 'https://www.youtube.com/results?search_query=timothy+keller+meaning+marriage+sermon', thumbnail: '💍', category: 'Relationships' },
  { id: 's25', preacher: 'Timothy Keller', title: 'Making Sense of God', url: 'https://www.youtube.com/results?search_query=timothy+keller+making+sense+of+god', thumbnail: '🧠', category: 'Apologetics' },
  // John Piper
  { id: 's26', preacher: 'John Piper', title: 'Desiring God', url: 'https://www.youtube.com/results?search_query=john+piper+desiring+god+sermon', thumbnail: '😍', category: 'Worship' },
  { id: 's27', preacher: 'John Piper', title: "Don't Waste Your Life", url: 'https://www.youtube.com/results?search_query=john+piper+dont+waste+your+life', thumbnail: '⏳', category: 'Purpose' },
  { id: 's28', preacher: 'John Piper', title: 'Future Grace', url: 'https://www.youtube.com/results?search_query=john+piper+future+grace+faith', thumbnail: '🌅', category: 'Faith' },
  // Bill Johnson
  { id: 's29', preacher: 'Bill Johnson', title: 'The Supernatural Power of a Transformed Mind', url: 'https://www.youtube.com/results?search_query=bill+johnson+supernatural+power+transformed+mind', thumbnail: '⚡', category: 'Holy Spirit' },
  { id: 's30', preacher: 'Bill Johnson', title: 'When Heaven Invades Earth', url: 'https://www.youtube.com/results?search_query=bill+johnson+when+heaven+invades+earth+sermon', thumbnail: '🌩️', category: 'Kingdom' },
  // Priscilla Shirer
  { id: 's31', preacher: 'Priscilla Shirer', title: 'Fervent — Prayer as a Weapon', url: 'https://www.youtube.com/results?search_query=priscilla+shirer+fervent+prayer+weapon', thumbnail: '⚔️', category: 'Prayer' },
  { id: 's32', preacher: 'Priscilla Shirer', title: 'The Armor of God', url: 'https://www.youtube.com/results?search_query=priscilla+shirer+armor+of+god+sermon', thumbnail: '🛡️', category: 'Spiritual Warfare' },
  // Rick Warren
  { id: 's33', preacher: 'Rick Warren', title: 'The Purpose Driven Life', url: 'https://www.youtube.com/results?search_query=rick+warren+purpose+driven+life+sermon', thumbnail: '🎯', category: 'Purpose' },
  { id: 's34', preacher: 'Rick Warren', title: 'What On Earth Am I Here For?', url: 'https://www.youtube.com/results?search_query=rick+warren+what+on+earth+am+i+here+for', thumbnail: '🌍', category: 'Identity' },
  // Jentezen Franklin
  { id: 's35', preacher: 'Jentezen Franklin', title: 'Fasting — Opening the Door to Spiritual Power', url: 'https://www.youtube.com/results?search_query=jentezen+franklin+fasting+spiritual+power', thumbnail: '🌿', category: 'Disciplines' },
  { id: 's36', preacher: 'Jentezen Franklin', title: 'Right People Right Places', url: 'https://www.youtube.com/results?search_query=jentezen+franklin+right+people+right+places', thumbnail: '🤝', category: 'Relationships' },
  // Paul Enenche
  { id: 's37', preacher: 'Pastor Paul Enenche', title: 'Power of the Midnight Cry', url: 'https://www.youtube.com/results?search_query=paul+enenche+midnight+cry+power', thumbnail: '🌙', category: 'Prayer' },
  { id: 's38', preacher: 'Pastor Paul Enenche', title: 'Uncommon Wisdom for an Uncommon Life', url: 'https://www.youtube.com/results?search_query=paul+enenche+uncommon+wisdom', thumbnail: '💡', category: 'Wisdom' },
  // Jerry Eze
  { id: 's39', preacher: 'Pastor Jerry Eze', title: 'New Season Prophetic Prayers', url: 'https://www.youtube.com/results?search_query=jerry+eze+new+season+prophetic+prayers', thumbnail: '🌄', category: 'Prayer' },
  { id: 's40', preacher: 'Pastor Jerry Eze', title: 'The Making of a Champion', url: 'https://www.youtube.com/results?search_query=jerry+eze+making+of+a+champion', thumbnail: '🏆', category: 'Purpose' },
  // Andy Stanley
  { id: 's41', preacher: 'Andy Stanley', title: 'Your Move — Live with the End in Mind', url: 'https://www.youtube.com/results?search_query=andy+stanley+your+move+live+with+end+in+mind', thumbnail: '♟️', category: 'Purpose' },
  { id: 's42', preacher: 'Andy Stanley', title: 'Better Decisions, Fewer Regrets', url: 'https://www.youtube.com/results?search_query=andy+stanley+better+decisions+fewer+regrets', thumbnail: '⚖️', category: 'Wisdom' },
  // Charles Stanley
  { id: 's43', preacher: 'Dr. Charles Stanley', title: 'The Reason for My Hope', url: 'https://www.youtube.com/results?search_query=charles+stanley+reason+for+hope+sermon', thumbnail: '🌟', category: 'Faith' },
  { id: 's44', preacher: 'Dr. Charles Stanley', title: 'Walking Wisely', url: 'https://www.youtube.com/results?search_query=charles+stanley+walking+wisely', thumbnail: '🦉', category: 'Wisdom' },
  // Kong Hee
  { id: 's45', preacher: 'Pastor Kong Hee', title: 'The Presence of God', url: 'https://www.youtube.com/results?search_query=kong+hee+presence+of+god+sermon', thumbnail: '✨', category: 'Intimacy' },
  // Sunday Adelaja
  { id: 's46', preacher: 'Pastor Sunday Adelaja', title: 'How Mightily God Can Use a Person', url: 'https://www.youtube.com/results?search_query=sunday+adelaja+how+god+uses+a+person', thumbnail: '🌍', category: 'Purpose' },
  // Myles Munroe
  { id: 's47', preacher: 'Dr. Myles Munroe', title: 'Understanding the Purpose and Power of Prayer', url: 'https://www.youtube.com/results?search_query=myles+munroe+purpose+power+of+prayer', thumbnail: '🙏', category: 'Prayer' },
  { id: 's48', preacher: 'Dr. Myles Munroe', title: 'The Principles of Kingdom', url: 'https://www.youtube.com/results?search_query=myles+munroe+principles+of+kingdom', thumbnail: '👑', category: 'Kingdom' },
  // Benny Hinn
  { id: 's49', preacher: 'Benny Hinn', title: 'Good Morning Holy Spirit', url: 'https://www.youtube.com/results?search_query=benny+hinn+good+morning+holy+spirit+sermon', thumbnail: '🕊️', category: 'Holy Spirit' },
  // Lou Engle
  { id: 's50', preacher: 'Lou Engle', title: 'TheCall — Fasting and Prayer', url: 'https://www.youtube.com/results?search_query=lou+engle+thecall+fasting+prayer', thumbnail: '🔔', category: 'Prayer' },
];

// ── BIBLE QUIZ QUESTIONS ────────────────────────────────────
export const QUIZ_QUESTIONS = [
  { question: "How many books are in the Bible?", options: ["60", "66", "72", "73"], answer: 1, explanation: "The Bible has 66 books — 39 in the Old Testament and 27 in the New Testament." },
  { question: "Who wrote most of the Psalms?", options: ["Solomon", "Moses", "David", "Asaph"], answer: 2, explanation: "King David wrote at least 73 of the 150 Psalms. He was called 'a man after God's own heart.'" },
  { question: "What does 'Jehovah Jireh' mean?", options: ["God Heals", "God is Peace", "God Provides", "God is Present"], answer: 2, explanation: "Jehovah Jireh means 'The Lord Will Provide.' Abraham named the mountain this after God provided a ram (Genesis 22:14)." },
  { question: "Which book comes right after John in the New Testament?", options: ["Romans", "Galatians", "Acts", "Hebrews"], answer: 2, explanation: "Acts (The Acts of the Apostles) follows the Gospel of John and documents the early church." },
  { question: "How many days did it rain during Noah's flood?", options: ["20 days", "40 days", "100 days", "365 days"], answer: 1, explanation: "It rained for 40 days and 40 nights (Genesis 7:12). The floodwaters prevailed for 150 days." },
  { question: "What fruit did the serpent tempt Eve with?", options: ["Apple", "Fig", "The Bible doesn't specify", "Pomegranate"], answer: 2, explanation: "The Bible says 'the fruit of the tree' (Genesis 3) but never specifies the type. The 'apple' is tradition, not Scripture." },
  { question: "What is the shortest verse in the Bible?", options: ["Rejoice!", "Amen.", "Jesus wept.", "Pray."], answer: 2, explanation: "'Jesus wept.' (John 11:35) is the shortest verse in the English Bible. He wept at Lazarus's tomb." },
  { question: "Who was the first king of Israel?", options: ["David", "Solomon", "Saul", "Samuel"], answer: 2, explanation: "Saul was Israel's first king, anointed by Samuel. Though he started well, he ended in disobedience." },
  { question: "What does 'El Shaddai' mean?", options: ["God Most High", "God Almighty", "Everlasting God", "God Who Sees"], answer: 1, explanation: "El Shaddai means 'God Almighty' — the all-sufficient, all-powerful God who nourishes and sustains." },
  { question: "In Revelation, how many letters are written to churches?", options: ["5", "6", "7", "12"], answer: 2, explanation: "Seven letters are written to seven churches in Asia Minor in Revelation chapters 2 and 3." },
  { question: "Which apostle denied Jesus three times?", options: ["John", "James", "Peter", "Thomas"], answer: 2, explanation: "Peter denied Jesus three times before the rooster crowed, just as Jesus predicted (Matthew 26:34)." },
  { question: "What was Paul's name before his conversion?", options: ["Barnabas", "Saul", "Simon", "Stephen"], answer: 1, explanation: "Paul's original name was Saul of Tarsus. He was a Pharisee who persecuted Christians before his Damascus road encounter." },
  { question: "How many lepers did Jesus heal at once in Luke 17?", options: ["3", "7", "10", "12"], answer: 2, explanation: "Jesus healed ten lepers, but only one — a Samaritan — returned to give thanks (Luke 17:11-19)." },
  { question: "Which book of the Bible never mentions God by name?", options: ["Psalms", "Esther", "Proverbs", "Job"], answer: 1, explanation: "The book of Esther never directly mentions God, yet His fingerprint is visible throughout the entire story." },
  { question: "What is the last word of the Bible?", options: ["Amen", "Jesus", "Forever", "Lord"], answer: 0, explanation: "'Amen' is the final word of Revelation 22:21 — and of the entire Bible. A fitting seal on God's Word." },
];

// ── FILL-IN-THE-BLANK VERSES ───────────────────────────────
export const FILL_BLANK_VERSES = [
  { verse: "For God so loved the world that he gave his one and only ___", answer: "Son", ref: "John 3:16" },
  { verse: "I can do all things through ___ who gives me strength", answer: "Christ", ref: "Philippians 4:13" },
  { verse: "The Lord is my shepherd, I shall not ___", answer: "want", ref: "Psalm 23:1" },
  { verse: "Trust in the Lord with all your heart and lean not on your own ___", answer: "understanding", ref: "Proverbs 3:5" },
  { verse: "Be still and know that I am ___", answer: "God", ref: "Psalm 46:10" },
  { verse: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our ___", answer: "Lord", ref: "Romans 6:23" },
  { verse: "Your word is a lamp to my feet and a ___ to my path", answer: "light", ref: "Psalm 119:105" },
  { verse: "Greater is he that is in you than he that is in the ___", answer: "world", ref: "1 John 4:4" },
  { verse: "The joy of the Lord is your ___", answer: "strength", ref: "Nehemiah 8:10" },
  { verse: "And we know that in all things God works for the ___ of those who love him", answer: "good", ref: "Romans 8:28" },
];

// ── GOD'S NAMES ────────────────────────────────────────────
export const GODS_NAMES = [
  { name: 'Jehovah Jireh', meaning: 'The Lord Will Provide', scripture: 'Genesis 22:14', context: 'When Abraham was about to sacrifice Isaac, God provided a ram.' },
  { name: 'Jehovah Rapha', meaning: 'The Lord Who Heals', scripture: 'Exodus 15:26', context: 'God promised Israel — if you obey me, I will heal you of every disease.' },
  { name: 'Jehovah Nissi', meaning: 'The Lord My Banner', scripture: 'Exodus 17:15', context: 'After victory over Amalek, Moses built an altar and named it The Lord is My Banner.' },
  { name: 'Jehovah Shalom', meaning: 'The Lord Is Peace', scripture: 'Judges 6:24', context: 'Gideon named the altar The Lord Is Peace after the angel of the Lord brought him peace.' },
  { name: 'Jehovah Rohi', meaning: 'The Lord My Shepherd', scripture: 'Psalm 23:1', context: 'The foundational image of God caring for, guiding, and protecting His people.' },
  { name: 'El Shaddai', meaning: 'God Almighty', scripture: 'Genesis 17:1', context: 'When Abram was 99, God appeared as El Shaddai and gave him the covenant of circumcision.' },
  { name: 'El Elyon', meaning: 'God Most High', scripture: 'Genesis 14:18', context: 'Melchizedek blessed Abram in the name of God Most High, maker of heaven and earth.' },
  { name: 'El Roi', meaning: 'The God Who Sees', scripture: 'Genesis 16:13', context: 'Hagar, abandoned and alone, met God in the wilderness. You are a God who sees me.' },
  { name: 'Jehovah Sabaoth', meaning: 'Lord of Hosts (Armies)', scripture: '1 Samuel 1:3', context: 'God as the commander of angelic armies, the defender of His people.' },
  { name: 'Jehovah Tsidkenu', meaning: 'The Lord Our Righteousness', scripture: 'Jeremiah 23:6', context: 'The coming king — Jesus — who would be the righteousness of His people.' },
  { name: 'Abba', meaning: 'Father (Daddy)', scripture: 'Romans 8:15', context: 'By the Spirit, we cry out Abba — the most intimate, personal name for God.' },
  { name: 'Emmanuel', meaning: 'God with Us', scripture: 'Matthew 1:23', context: 'The name given to Jesus — God became flesh and dwelt among us.' },
];

// ── WORD SCRAMBLE VERSES ───────────────────────────────────
export const WORD_SCRAMBLE_VERSES = [
  { words: ['Trust', 'in', 'the', 'Lord', 'with', 'all', 'your', 'heart'], ref: 'Proverbs 3:5' },
  { words: ['The', 'Lord', 'is', 'my', 'shepherd'], ref: 'Psalm 23:1' },
  { words: ['I', 'can', 'do', 'all', 'things', 'through', 'Christ'], ref: 'Philippians 4:13' },
  { words: ['Be', 'still', 'and', 'know', 'that', 'I', 'am', 'God'], ref: 'Psalm 46:10' },
  { words: ['Draw', 'near', 'to', 'God', 'and', 'he', 'will', 'draw', 'near'], ref: 'James 4:8' },
];

// ── FRUITS OF THE SPIRIT ───────────────────────────────────
export const FRUITS_OF_SPIRIT = [
  { fruit: 'Love', description: 'Choosing others\' good above your own — even when it costs you.', verse: 'Galatians 5:22', question: 'Who in your life did you choose to love this week even when you didn\'t feel like it?' },
  { fruit: 'Joy', description: 'A settled confidence in God\'s goodness that circumstances cannot shake.', verse: 'Galatians 5:22', question: 'How did your joy hold up this week when things didn\'t go your way?' },
  { fruit: 'Peace', description: 'Rest in God\'s sovereignty — the absence of inner war.', verse: 'Galatians 5:22', question: 'What anxious thought did you successfully bring to God this week?' },
  { fruit: 'Patience', description: 'Enduring difficulty or people without reacting in the flesh.', verse: 'Galatians 5:22', question: 'Who or what required patience from you this week? How did you do?' },
  { fruit: 'Kindness', description: 'Warm, practical action toward others\' needs.', verse: 'Galatians 5:22', question: 'What specific act of kindness did you perform for someone this week?' },
  { fruit: 'Goodness', description: 'Moral integrity — doing right when no one is watching.', verse: 'Galatians 5:22', question: 'Was there a moment this week when no one was watching but you still chose rightly?' },
  { fruit: 'Faithfulness', description: 'Reliability and loyalty — to God and to others.', verse: 'Galatians 5:23', question: 'What commitment did you honour this week even when it was inconvenient?' },
  { fruit: 'Gentleness', description: 'Strength held under control — power expressed with care.', verse: 'Galatians 5:23', question: 'When did you hold back your full reaction this week and respond gently instead?' },
  { fruit: 'Self-Control', description: 'Mastery over your impulses, desires, and tongue.', verse: 'Galatians 5:23', question: 'What temptation or impulse did you overcome this week? Where did you fail and need grace?' },
];

// ── PRAYER CATEGORIES ─────────────────────────────────────
export const PRAYER_CATEGORIES = [
  { id: 'adoration', label: 'Adoration', icon: '👑', prompt: 'Tell God who He is. Not what He does — who He IS. His character, His names, His nature.', color: '#C8922A' },
  { id: 'confession', label: 'Confession', icon: '🙏', prompt: 'Come clean. What have you done — or not done — that you know wasn\'t right? Be specific.', color: '#7C3AED' },
  { id: 'thanksgiving', label: 'Thanksgiving', icon: '🌟', prompt: 'What has God done? Name specific things. Small things, big things, things you almost missed.', color: '#2E8B5A' },
  { id: 'supplication', label: 'Supplication', icon: '💫', prompt: 'Now ask. Boldly. Specifically. What do you need from Him? Don\'t hint — come boldly to the throne.', color: '#4A90D9' },
];

// ── MORNING DEVOTIONAL PROMPTS ─────────────────────────────
export const MORNING_PROMPTS = [
  "Good morning. Before you scroll — give Me 60 seconds. What's the one thing you need from Me today?",
  "Today belongs to Me. What are you carrying into it that I want to take from you?",
  "Before today begins, let Me show you something about who I am. Ask Me one question.",
  "You are not behind. You are not late. You are exactly where you are, and I am here with you.",
  "What song is in your heart this morning? Hum it. Sing it. Let it be your first offering.",
  "Tell Me your plan for today. I want to be part of every hour — not just the hard ones.",
  "One fear you face today — bring it. Don't carry it alone. What is it?",
  "Let\'s start with gratitude. Name 3 things from yesterday — even small ones — that were My gift to you.",
];

export const EVENING_PROMPTS = [
  "Where did you see Me today? Don't let the day end without naming it.",
  "What moment today are you most grateful for? Let's end with that.",
  "Where did you fall short today? Come bring it. There's grace for everything.",
  "What surprised you today? I was in that surprise.",
  "Rest now. You don't have to fix what isn't done. I am still working.",
  "Before you sleep — is there anyone you need to forgive? Even yourself?",
  "What did today teach you about yourself? About Me?",
  "Give Me the weight of tomorrow. You don't have to carry it to sleep.",
];

export const MIDDAY_PROMPTS = [
  "Pause. Take three breaths. I'm still here, in the middle of your day.",
  "How's your soul doing right now — honestly?",
  "Is there anything today that's trying to steal your peace? Give it to Me.",
  "What's one kind thing you can do in the next hour for someone around you?",
  "You've been going. Good. Now just be — with Me — for 2 minutes.",
  "What's worrying you right now? Say it out loud. I'm listening.",
];
