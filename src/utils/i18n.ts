// ─────────────────────────────────────────────────────────────────────────────
//  Walk With Him — Internationalisation (i18n)
//  Supported: English, French, Spanish, Portuguese, Yoruba, Igbo, Hausa,
//             Swahili, Arabic, Hindi, German, Korean, Mandarin
// ─────────────────────────────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', flag: '🇧🇷' },
  { code: 'yo', label: 'Yoruba', nativeLabel: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', label: 'Igbo', nativeLabel: 'Igbo', flag: '🇳🇬' },
  { code: 'ha', label: 'Hausa', nativeLabel: 'Hausa', flag: '🇳🇬' },
  { code: 'sw', label: 'Swahili', nativeLabel: 'Kiswahili', flag: '🇰🇪' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: '🇮🇳' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어', flag: '🇰🇷' },
  { code: 'zh', label: 'Mandarin', nativeLabel: '普通话', flag: '🇨🇳' },
];

export type LangCode = typeof SUPPORTED_LANGUAGES[number]['code'];

// All UI string keys
export interface Strings {
  // Nav / Tabs
  home: string; grow: string; games: string; journal: string; more: string;
  // Home
  goodMorning: string; goodAfternoon: string; goodEvening: string;
  verseOfDay: string; tapToCollect: string; collected: string;
  quickAccess: string; todaysDisciplines: string;
  // Games
  gamesTitle: string; gamesSubtitle: string; play: string; exit: string;
  bibleQuiz: string; fillBlank: string; wordScramble: string;
  whoIsGod: string; prayerBuilder: string; fruitCheck: string;
  checkAnswer: string; nextQuestion: string; seeResults: string; backToGames: string;
  correct: string; incorrect: string;
  // Onboarding
  beginWalking: string; whatShallICall: string; enterName: string;
  selectCountry: string; selectLanguage: string; continue_: string;
  getStarted: string;
  // Profile
  yourProfile: string; yourJourney: string; walkingSince: string; youAreHere: string;
  // Settings
  settings: string; save: string; saving: string;
  callsPerDay: string; callWindowStart: string; callWindowEnd: string;
  morningReminder: string; middayCheckin: string; eveningReflection: string;
  enableNotifications: string; streakWarnings: string; ringtone: string;
  resetData: string; personal: string; godIsCalling: string;
  // Community
  community: string; globalChat: string; regionChat: string;
  personalMessages: string; partners: string; friends: string;
  joinCommunity: string; createAccount: string; addFriend: string; message: string;
  // Journal
  talkToGod: string; writeResponse: string; history: string; saveEntry: string;
  // Donate
  supportApp: string; oneTimeDonation: string; monthlySponsorship: string;
  donate: string; currency: string;
  // General
  back: string; close: string; cancel: string; confirm: string; submit: string;
  loading: string; error: string; success: string; amen: string;
}

const en: Strings = {
  home:'Home', grow:'Grow', games:'Games', journal:'Journal', more:'More',
  goodMorning:'Good morning', goodAfternoon:'Good afternoon', goodEvening:'Good evening',
  verseOfDay:'Verse of the Day', tapToCollect:'Tap to collect +5 XP', collected:'Collected',
  quickAccess:'Quick Access', todaysDisciplines:"Today's Disciplines",
  gamesTitle:'Games', gamesSubtitle:'Knowledge that sticks is knowledge you\'ve played with.',
  play:'Play', exit:'Exit',
  bibleQuiz:'Bible Quiz', fillBlank:'Fill the Blank', wordScramble:'Word Scramble',
  whoIsGod:'Who Is God?', prayerBuilder:'Prayer Builder', fruitCheck:'Fruit Check',
  checkAnswer:'Check Answer', nextQuestion:'Next Question', seeResults:'See Results', backToGames:'Back to Games',
  correct:'Correct!', incorrect:'Incorrect',
  beginWalking:'Begin Walking With Him', whatShallICall:'What shall I call you?',
  enterName:'Enter your name...', selectCountry:'Select your country',
  selectLanguage:'Choose your language', continue_:'Continue', getStarted:'Get Started',
  yourProfile:'Your Profile', yourJourney:'Your Journey', walkingSince:'Walking since',
  youAreHere:'YOU ARE HERE',
  settings:'Settings', save:'Save', saving:'Saving...',
  callsPerDay:'Calls per day', callWindowStart:'Call window start', callWindowEnd:'Call window end',
  morningReminder:'Morning reminder', middayCheckin:'Midday check-in', eveningReflection:'Evening reflection',
  enableNotifications:'Enable all notifications', streakWarnings:'Streak & penalty warnings',
  ringtone:'Ringtone', resetData:'Reset All Data', personal:'Personal', godIsCalling:'God Is Calling',
  community:'Community', globalChat:'Global', regionChat:'Region',
  personalMessages:'Personal', partners:'Partners', friends:'Friends',
  joinCommunity:'Join Community', createAccount:'Create Account',
  addFriend:'Add Friend', message:'Message',
  talkToGod:'Talk to God', writeResponse:'Write a response...', history:'History', saveEntry:'Save Entry',
  supportApp:'Support the App', oneTimeDonation:'One-Time Donation', monthlySponsorship:'Monthly Sponsorship',
  donate:'Donate', currency:'Currency',
  back:'Back', close:'Close', cancel:'Cancel', confirm:'Confirm', submit:'Submit',
  loading:'Loading...', error:'Error', success:'Success', amen:'Amen 🙏',
};

const fr: Strings = {
  home:'Accueil', grow:'Grandir', games:'Jeux', journal:'Journal', more:'Plus',
  goodMorning:'Bonjour', goodAfternoon:'Bon après-midi', goodEvening:'Bonsoir',
  verseOfDay:'Verset du Jour', tapToCollect:'Appuyez pour +5 XP', collected:'Collecté',
  quickAccess:'Accès Rapide', todaysDisciplines:"Disciplines d'Aujourd'hui",
  gamesTitle:'Jeux', gamesSubtitle:'La connaissance qui reste est celle avec laquelle vous avez joué.',
  play:'Jouer', exit:'Quitter',
  bibleQuiz:'Quiz Biblique', fillBlank:'Complète le Blanc', wordScramble:'Mots Mélangés',
  whoIsGod:'Qui Est Dieu?', prayerBuilder:'Constructeur de Prière', fruitCheck:'Vérification des Fruits',
  checkAnswer:'Vérifier', nextQuestion:'Question Suivante', seeResults:'Voir les Résultats', backToGames:'Retour aux Jeux',
  correct:'Correct!', incorrect:'Incorrect',
  beginWalking:'Commencer à Marcher Avec Lui', whatShallICall:'Comment dois-je vous appeler?',
  enterName:'Entrez votre nom...', selectCountry:'Sélectionnez votre pays',
  selectLanguage:'Choisissez votre langue', continue_:'Continuer', getStarted:'Commencer',
  yourProfile:'Votre Profil', yourJourney:'Votre Voyage', walkingSince:'En marche depuis',
  youAreHere:'VOUS ÊTES ICI',
  settings:'Paramètres', save:'Enregistrer', saving:'Enregistrement...',
  callsPerDay:'Appels par jour', callWindowStart:'Début de fenêtre', callWindowEnd:'Fin de fenêtre',
  morningReminder:'Rappel matin', middayCheckin:'Vérification midi', eveningReflection:'Réflexion du soir',
  enableNotifications:'Activer les notifications', streakWarnings:'Avertissements de série',
  ringtone:'Sonnerie', resetData:'Réinitialiser', personal:'Personnel', godIsCalling:'Dieu Appelle',
  community:'Communauté', globalChat:'Mondial', regionChat:'Région',
  personalMessages:'Personnel', partners:'Partenaires', friends:'Amis',
  joinCommunity:'Rejoindre', createAccount:'Créer un Compte',
  addFriend:'Ajouter', message:'Message',
  talkToGod:'Parler à Dieu', writeResponse:'Écrire une réponse...', history:'Historique', saveEntry:'Sauvegarder',
  supportApp:"Soutenir l'App", oneTimeDonation:'Don Unique', monthlySponsorship:'Parrainage Mensuel',
  donate:'Donner', currency:'Devise',
  back:'Retour', close:'Fermer', cancel:'Annuler', confirm:'Confirmer', submit:'Soumettre',
  loading:'Chargement...', error:'Erreur', success:'Succès', amen:'Amen 🙏',
};

const es: Strings = {
  home:'Inicio', grow:'Crecer', games:'Juegos', journal:'Diario', more:'Más',
  goodMorning:'Buenos días', goodAfternoon:'Buenas tardes', goodEvening:'Buenas noches',
  verseOfDay:'Versículo del Día', tapToCollect:'Toca para +5 XP', collected:'Recogido',
  quickAccess:'Acceso Rápido', todaysDisciplines:'Disciplinas de Hoy',
  gamesTitle:'Juegos', gamesSubtitle:'El conocimiento que permanece es el que has practicado.',
  play:'Jugar', exit:'Salir',
  bibleQuiz:'Quiz Bíblico', fillBlank:'Completa el Espacio', wordScramble:'Palabras Mezcladas',
  whoIsGod:'¿Quién Es Dios?', prayerBuilder:'Constructor de Oración', fruitCheck:'Revisión de Frutos',
  checkAnswer:'Verificar', nextQuestion:'Siguiente Pregunta', seeResults:'Ver Resultados', backToGames:'Volver a Juegos',
  correct:'¡Correcto!', incorrect:'Incorrecto',
  beginWalking:'Comenzar a Caminar Con Él', whatShallICall:'¿Cómo debo llamarte?',
  enterName:'Escribe tu nombre...', selectCountry:'Selecciona tu país',
  selectLanguage:'Elige tu idioma', continue_:'Continuar', getStarted:'Comenzar',
  yourProfile:'Tu Perfil', yourJourney:'Tu Viaje', walkingSince:'Caminando desde',
  youAreHere:'ESTÁS AQUÍ',
  settings:'Configuración', save:'Guardar', saving:'Guardando...',
  callsPerDay:'Llamadas por día', callWindowStart:'Inicio de ventana', callWindowEnd:'Fin de ventana',
  morningReminder:'Recordatorio matutino', middayCheckin:'Registro del mediodía', eveningReflection:'Reflexión vespertina',
  enableNotifications:'Activar notificaciones', streakWarnings:'Advertencias de racha',
  ringtone:'Tono', resetData:'Restablecer Datos', personal:'Personal', godIsCalling:'Dios Está Llamando',
  community:'Comunidad', globalChat:'Global', regionChat:'Región',
  personalMessages:'Personal', partners:'Socios', friends:'Amigos',
  joinCommunity:'Unirse', createAccount:'Crear Cuenta',
  addFriend:'Añadir Amigo', message:'Mensaje',
  talkToGod:'Hablar con Dios', writeResponse:'Escribe una respuesta...', history:'Historial', saveEntry:'Guardar',
  supportApp:'Apoyar la App', oneTimeDonation:'Donación Única', monthlySponsorship:'Patrocinio Mensual',
  donate:'Donar', currency:'Moneda',
  back:'Volver', close:'Cerrar', cancel:'Cancelar', confirm:'Confirmar', submit:'Enviar',
  loading:'Cargando...', error:'Error', success:'Éxito', amen:'Amén 🙏',
};

const pt: Strings = {
  home:'Início', grow:'Crescer', games:'Jogos', journal:'Diário', more:'Mais',
  goodMorning:'Bom dia', goodAfternoon:'Boa tarde', goodEvening:'Boa noite',
  verseOfDay:'Versículo do Dia', tapToCollect:'Toque para +5 XP', collected:'Coletado',
  quickAccess:'Acesso Rápido', todaysDisciplines:'Disciplinas de Hoje',
  gamesTitle:'Jogos', gamesSubtitle:'O conhecimento que fica é o que você praticou.',
  play:'Jogar', exit:'Sair',
  bibleQuiz:'Quiz Bíblico', fillBlank:'Complete o Espaço', wordScramble:'Palavras Embaralhadas',
  whoIsGod:'Quem É Deus?', prayerBuilder:'Construtor de Oração', fruitCheck:'Verificação de Frutos',
  checkAnswer:'Verificar', nextQuestion:'Próxima Pergunta', seeResults:'Ver Resultados', backToGames:'Voltar aos Jogos',
  correct:'Correto!', incorrect:'Incorreto',
  beginWalking:'Começar a Caminhar Com Ele', whatShallICall:'Como devo te chamar?',
  enterName:'Digite seu nome...', selectCountry:'Selecione seu país',
  selectLanguage:'Escolha seu idioma', continue_:'Continuar', getStarted:'Começar',
  yourProfile:'Seu Perfil', yourJourney:'Sua Jornada', walkingSince:'Caminhando desde',
  youAreHere:'VOCÊ ESTÁ AQUI',
  settings:'Configurações', save:'Salvar', saving:'Salvando...',
  callsPerDay:'Chamadas por dia', callWindowStart:'Início da janela', callWindowEnd:'Fim da janela',
  morningReminder:'Lembrete matinal', middayCheckin:'Check-in do meio-dia', eveningReflection:'Reflexão noturna',
  enableNotifications:'Ativar notificações', streakWarnings:'Avisos de sequência',
  ringtone:'Toque', resetData:'Redefinir Dados', personal:'Pessoal', godIsCalling:'Deus Está Chamando',
  community:'Comunidade', globalChat:'Global', regionChat:'Região',
  personalMessages:'Pessoal', partners:'Parceiros', friends:'Amigos',
  joinCommunity:'Entrar', createAccount:'Criar Conta',
  addFriend:'Adicionar Amigo', message:'Mensagem',
  talkToGod:'Falar com Deus', writeResponse:'Escreva uma resposta...', history:'Histórico', saveEntry:'Salvar',
  supportApp:'Apoiar o App', oneTimeDonation:'Doação Única', monthlySponsorship:'Patrocínio Mensal',
  donate:'Doar', currency:'Moeda',
  back:'Voltar', close:'Fechar', cancel:'Cancelar', confirm:'Confirmar', submit:'Enviar',
  loading:'Carregando...', error:'Erro', success:'Sucesso', amen:'Amém 🙏',
};

const yo: Strings = {
  home:'Ile', grow:'Dagba', games:'Ere', journal:'Iwe itan', more:'Siwaju',
  goodMorning:'E kaaro', goodAfternoon:'E kaasan', goodEvening:'E kaale',
  verseOfDay:'Ege Ojo Oni', tapToCollect:'Te lati gba +5 XP', collected:'Ti gba',
  quickAccess:'Iwọle Kiakia', todaysDisciplines:'Ibawi Oni',
  gamesTitle:'Ere', gamesSubtitle:'Imọ ti o duro ni eyiti o ti ṣere pẹlu.',
  play:'Ṣere', exit:'Jade',
  bibleQuiz:'Idanwo Bibeli', fillBlank:'Kun Aaye Ofo', wordScramble:'Awọn Ọrọ Daru',
  whoIsGod:'Tani Ọlọrun?', prayerBuilder:'Kọ Adura', fruitCheck:'Ṣayẹwo Eso',
  checkAnswer:'Ṣayẹwo', nextQuestion:'Ibeere Ti o Tẹle', seeResults:'Wo Abajade', backToGames:'Pada si Ere',
  correct:'Otitọ!', incorrect:'Aṣiṣe',
  beginWalking:'Bẹrẹ Ririn Pẹlu Rẹ', whatShallICall:'Kini emi o pe ọ?',
  enterName:'Tẹ orukọ rẹ...', selectCountry:'Yan orilẹ-ede rẹ',
  selectLanguage:'Yan ede rẹ', continue_:'Tẹsiwaju', getStarted:'Bẹrẹ',
  yourProfile:'Profaili Rẹ', yourJourney:'Irin-ajo Rẹ', walkingSince:'Ririn lati',
  youAreHere:'IWO WA NIBI',
  settings:'Eto', save:'Fi pamọ', saving:'Fipamọ...',
  callsPerDay:'Ipe fun ọjọ', callWindowStart:'Ibẹrẹ akoko', callWindowEnd:'Ipari akoko',
  morningReminder:'Iranti owurọ', middayCheckin:'Ayẹwo ọsan', eveningReflection:'Ifarakanra alẹ',
  enableNotifications:'Mu awọn iwifunni ṣiṣẹ', streakWarnings:'Awọn itaniji akọọlẹ',
  ringtone:'Orin oruka', resetData:'Tun ṣeto Gbogbo Data', personal:'Ti ara ẹni', godIsCalling:'Ọlọrun Ń Pe',
  community:'Agbegbe', globalChat:'Agbaye', regionChat:'Agbegbe',
  personalMessages:'Ti Ara Ẹni', partners:'Awọn Alabaṣiṣẹpọ', friends:'Awọn ọrẹ',
  joinCommunity:'Darapọ', createAccount:'Ṣẹda Akọọlẹ',
  addFriend:'Fi Ọrẹ Kun', message:'Ifiranṣẹ',
  talkToGod:'Sọrọ Pẹlu Ọlọrun', writeResponse:'Kọ idahun...', history:'Itan', saveEntry:'Fi pamọ',
  supportApp:'Ṣe atilẹyin App', oneTimeDonation:'Ẹbọ Igba Kan', monthlySponsorship:'Atilẹyin Oṣooṣu',
  donate:'Ṣe Ẹbọ', currency:'Owo',
  back:'Pada', close:'Pa', cancel:'Fagilee', confirm:'Jẹrisi', submit:'Firanṣẹ',
  loading:'Ń gba...', error:'Aṣiṣe', success:'Aṣeyọri', amen:'Amin 🙏',
};

const sw: Strings = {
  home:'Nyumbani', grow:'Kukua', games:'Michezo', journal:'Jarida', more:'Zaidi',
  goodMorning:'Habari za asubuhi', goodAfternoon:'Habari za mchana', goodEvening:'Habari za jioni',
  verseOfDay:'Mstari wa Leo', tapToCollect:'Gusa kupata +5 XP', collected:'Imekusanywa',
  quickAccess:'Ufikiaji wa Haraka', todaysDisciplines:'Nidhamu za Leo',
  gamesTitle:'Michezo', gamesSubtitle:'Maarifa yanayobaki ni yale uliyocheza nayo.',
  play:'Cheza', exit:'Toka',
  bibleQuiz:'Maswali ya Biblia', fillBlank:'Jaza Nafasi', wordScramble:'Maneno Yaliyochanganywa',
  whoIsGod:'Mungu ni Nani?', prayerBuilder:'Jenga Sala', fruitCheck:'Angalia Matunda',
  checkAnswer:'Angalia', nextQuestion:'Swali Linalofuata', seeResults:'Ona Matokeo', backToGames:'Rudi Michezo',
  correct:'Sahihi!', incorrect:'Makosa',
  beginWalking:'Anza Kutembea Naye', whatShallICall:'Nikuiite nini?',
  enterName:'Weka jina lako...', selectCountry:'Chagua nchi yako',
  selectLanguage:'Chagua lugha yako', continue_:'Endelea', getStarted:'Anza',
  yourProfile:'Wasifu Wako', yourJourney:'Safari Yako', walkingSince:'Kutembea tangu',
  youAreHere:'UKO HAPA',
  settings:'Mipangilio', save:'Hifadhi', saving:'Inahifadhi...',
  callsPerDay:'Simu kwa siku', callWindowStart:'Mwanzo wa dirisha', callWindowEnd:'Mwisho wa dirisha',
  morningReminder:'Ukumbusho wa asubuhi', middayCheckin:'Ukaguzi wa mchana', eveningReflection:'Tafakuri ya jioni',
  enableNotifications:'Wezesha arifa', streakWarnings:'Onyo la mfululizo',
  ringtone:'Mlio', resetData:'Weka upya Data', personal:'Binafsi', godIsCalling:'Mungu Anapigia Simu',
  community:'Jamii', globalChat:'Kimataifa', regionChat:'Mkoa',
  personalMessages:'Binafsi', partners:'Washirika', friends:'Marafiki',
  joinCommunity:'Jiunge', createAccount:'Fungua Akaunti',
  addFriend:'Ongeza Rafiki', message:'Ujumbe',
  talkToGod:'Zungumza na Mungu', writeResponse:'Andika jibu...', history:'Historia', saveEntry:'Hifadhi',
  supportApp:'Saidia App', oneTimeDonation:'Mchango wa Mara Moja', monthlySponsorship:'Udhamini wa Kila Mwezi',
  donate:'Changia', currency:'Sarafu',
  back:'Rudi', close:'Funga', cancel:'Ghairi', confirm:'Thibitisha', submit:'Wasilisha',
  loading:'Inapakia...', error:'Hitilafu', success:'Mafanikio', amen:'Amina 🙏',
};

// Stub remaining languages with English (can be expanded)
const makeStub = (overrides: Partial<Strings>): Strings => ({ ...en, ...overrides });

const ar: Strings = makeStub({ home:'الرئيسية', grow:'النمو', games:'الألعاب', journal:'اليوميات', more:'المزيد', goodMorning:'صباح الخير', goodAfternoon:'مساء الخير', goodEvening:'مساء النور', amen:'آمين 🙏', beginWalking:'ابدأ المسيرة معه', getStarted:'ابدأ', continue_:'تابع', back:'رجوع', save:'حفظ', settings:'الإعدادات', community:'المجتمع' });
const hi: Strings = makeStub({ home:'होम', grow:'बढ़ें', games:'खेल', journal:'डायरी', more:'अधिक', goodMorning:'सुप्रभात', goodAfternoon:'नमस्कार', goodEvening:'शुभ संध्या', amen:'आमीन 🙏', beginWalking:'उनके साथ चलना शुरू करें', getStarted:'शुरू करें', continue_:'जारी रखें', back:'वापस', save:'सहेजें', settings:'सेटिंग्स', community:'समुदाय' });
const de: Strings = makeStub({ home:'Startseite', grow:'Wachsen', games:'Spiele', journal:'Tagebuch', more:'Mehr', goodMorning:'Guten Morgen', goodAfternoon:'Guten Tag', goodEvening:'Guten Abend', amen:'Amen 🙏', beginWalking:'Beginne mit Ihm zu gehen', getStarted:'Loslegen', continue_:'Weiter', back:'Zurück', save:'Speichern', settings:'Einstellungen', community:'Gemeinschaft' });
const ko: Strings = makeStub({ home:'홈', grow:'성장', games:'게임', journal:'일지', more:'더보기', goodMorning:'좋은 아침', goodAfternoon:'안녕하세요', goodEvening:'좋은 저녁', amen:'아멘 🙏', beginWalking:'그와 함께 걷기 시작', getStarted:'시작하기', continue_:'계속', back:'뒤로', save:'저장', settings:'설정', community:'커뮤니티' });
const zh: Strings = makeStub({ home:'主页', grow:'成长', games:'游戏', journal:'日记', more:'更多', goodMorning:'早上好', goodAfternoon:'下午好', goodEvening:'晚上好', amen:'阿门 🙏', beginWalking:'开始与祂同行', getStarted:'开始', continue_:'继续', back:'返回', save:'保存', settings:'设置', community:'社区' });
const ig: Strings = makeStub({ home:'Ulo', grow:'Tuo', games:'Egwuregwu', journal:'Akwụkwọ ndetu', more:'Karị', goodMorning:'Ututu oma', goodAfternoon:'Ehihie oma', goodEvening:'Abalị oma', amen:'Amen 🙏', community:'Obodo' });
const ha: Strings = makeStub({ home:'Gida', grow:'Girma', games:'Wasanni', journal:'Littafin tarihi', more:'Ƙari', goodMorning:'Ina kwana', goodAfternoon:'Ina wuni', goodEvening:'Ina yini', amen:'Amin 🙏', community:'Al\'umma' });

const TRANSLATIONS: Record<LangCode, Strings> = { en, fr, es, pt, yo, sw, ar, hi, de, ko, zh, ig, ha };

// Cache current language
let _currentLang: LangCode = 'en';

export function setLanguage(code: LangCode) { _currentLang = code; }
export function getLanguage(): LangCode { return _currentLang; }
export function t(key: keyof Strings): string {
  return (TRANSLATIONS[_currentLang] ?? TRANSLATIONS.en)[key] ?? TRANSLATIONS.en[key] ?? key;
}
export function getStrings(): Strings { return TRANSLATIONS[_currentLang] ?? TRANSLATIONS.en; }
