export const profile = {
  name: "Sanjarbek Otabekov",
  shortName: "Sanjarbek",
  role: "Full-Stack Dasturchi & UI/UX Dizayner",
  email: "sanjarbekotabekov010@gmail.com",
  location: "Toshkent, O‘zbekiston",
  availability: "Freelance uchun bo‘shman",
  tagline: "Sodda. Kreativ. Samarali.",
  description:
    "Men zamonaviy, yuqori unumdorlikka ega va foydalanuvchiga yo‘naltirilgan veb-ilovalarni yarataman. Har bir loyihaga ijodiy yondashuv va texnik mukammallikni olib kiraman.",
  summary:
    "Dasturlash men uchun shunchaki kod yozish emas, balki insonlar hayotini yengillashtiruvchi vositalar yaratishdir. Har bir loyihada minimalizm, qulaylik va yuqori unumdorlikni birinchi o‘ringa qo‘yaman.",
  fullAbout:
    "Dasturlash men uchun shunchaki kod yozish jarayoni emas. Bu — insonlar duch keladigan muammolarni tushunish, ularga qulay va samarali yechimlar topish hamda hayotini yengillashtiradigan vositalar yaratishdir. Har bir yozilgan kod ortida insonlarga foyda keltirish, vaqtini tejash va ishlarini osonlashtirish maqsadi yotadi.",
  portrait: "/images/sanjarbek.jpg",
  resume: "https://sanjarme.uz/resume.pdf",
};

export const coreTechnologies = ["React", "Node.js", "TypeScript", "Tailwind CSS"];

export const navigation = [
  { label: "Men haqimda", href: "#about" },
  { label: "Ko‘nikmalar", href: "#skills" },
  { label: "Loyihalar", href: "#projects" },
  { label: "Tajriba", href: "#experience" },
  { label: "Bog‘lanish", href: "#contact" },
];

export const roles = [
  "Full-Stack Developer",
  "UI/UX Designer",
  "Frontend Engineer",
  "Creative Developer",
];

export const heroHighlights = [
  { value: "1+", label: "Yillik tajriba" },
  { value: "7", label: "Real loyihalar" },
  { value: "5/5", label: "Mijozlar bahosi" },
];

export const stats = [
  { value: "1+", label: "Yillik tajriba" },
  { value: "3+", label: "Tugallangan loyihalar" },
  { value: "3+", label: "Xursand mijozlar" },
  { value: "5/5", label: "Mijozlar bahosi" },
];

export const skills = [
  { name: "Firebase", mark: "Fb", color: "from-amber-400 to-orange-500" },
  { name: "HTML5", mark: "H5", color: "from-orange-500 to-red-500" },
  { name: "Python", mark: "Py", color: "from-blue-500 to-amber-300" },
  { name: "JavaScript", mark: "JS", color: "from-yellow-300 to-yellow-500" },
  { name: "Git", mark: "Gt", color: "from-orange-500 to-rose-500" },
  { name: "Node.js", mark: "Nd", color: "from-lime-500 to-emerald-500" },
  { name: "MongoDB", mark: "Mg", color: "from-emerald-500 to-green-600" },
  { name: "Figma", mark: "Fg", color: "from-fuchsia-500 to-cyan-400" },
  { name: "React", mark: "Re", color: "from-sky-400 to-cyan-300" },
  { name: "Tailwind CSS", mark: "Tw", color: "from-cyan-400 to-teal-300" },
  { name: "MySQL", mark: "My", color: "from-blue-500 to-cyan-500" },
  { name: "UI/UX Design", mark: "UX", color: "from-violet-500 to-pink-500" },
];

export const services = [
  {
    number: "01",
    title: "Web Dasturlash",
    description:
      "React, Node.js va boshqa ilg‘or texnologiyalar yordamida zamonaviy, tezkor va xavfsiz web ilovalar yaratish.",
  },
  {
    number: "02",
    title: "UI/UX Dizayn",
    description:
      "Figma va zamonaviy dizayn trendlari asosida foydalanuvchilar uchun qulay va chiroyli interfeyslar yaratish.",
  },
  {
    number: "03",
    title: "Mobil Moslashuv",
    description:
      "Barcha qurilmalarda mukammal ishlaydigan responsiv dizaynlar. Smartfon va planshetlar uchun optimizatsiya.",
  },
  {
    number: "04",
    title: "Backend & API",
    description:
      "Mustahkam va xavfsiz server qismi, RESTful API hamda ma’lumotlar bazasi arxitekturasini yaratish.",
  },
];

export type ProjectCategory = "Web ilova" | "PWA ilova" | "Telegram bot";

export type Project = {
  slug: string;
  title: string;
  description: string;
  category: ProjectCategory;
  stack: string[];
  accent: string;
  metric: string;
  year: string;
  role: string;
  challenge: string;
  solution: string;
  outcomes: string[];
  github: string;
  live: string;
  image: string;
  status?: "draft" | "published";
  order?: number;
  updatedAt?: unknown;
};

export const projects: Project[] = [
  {
    slug: "git-fast",
    title: "Git Fast",
    description: "Git’ga loyihalarni oson va tez yuborishga yordam beruvchi platforma.",
    category: "PWA ilova",
    stack: ["JavaScript", "Git", "PWA", "Responsive UI"],
    accent: "from-blue-600 via-cyan-500 to-violet-600",
    metric: "Deploy workflow",
    year: "2026",
    role: "Full-stack development & UI/UX",
    challenge: "Git bilan ishlashdagi takroriy qadamlarni yangi foydalanuvchilar uchun sodda qilish.",
    solution: "Loyihani Git’ga yuborish jarayonini tushunarli va ixcham oqimga birlashtirgan PWA platforma.",
    outcomes: ["Soddalashtirilgan Git jarayoni", "PWA tajribasi", "Mobil qurilmalarga mos"],
    github: "https://github.com/sanjarbek404/Git-Fast.git",
    live: "https://git-fast-depoy.onrender.com/",
    image: "/images/projects/git-fast.png",
  },
  {
    slug: "mebelmashhura",
    title: "mebelmashhura.uz",
    description: "Mebel do‘koni uchun mahsulotlarni chiroyli taqdim etuvchi zamonaviy web sayt.",
    category: "Web ilova",
    stack: ["React", "JavaScript", "Responsive UI", "SEO"],
    accent: "from-amber-500 via-orange-500 to-rose-600",
    metric: "Business website",
    year: "2026",
    role: "Web development & UI/UX",
    challenge: "Mebel katalogini mijozlar uchun tushunarli va ishonchli ko‘rinishda taqdim etish.",
    solution: "Mahsulotlarni tez topish va mobil qurilmada ham qulay ko‘rish mumkin bo‘lgan responsiv vitrina.",
    outcomes: ["Moslashuvchan katalog", "Tezkor interfeys", "Biznesga mos dizayn"],
    github: "",
    live: "https://mebelmashhura.uz/",
    image: "/images/projects/mebelmashhura.png",
  },
  {
    slug: "filmxbot",
    title: "FilmXBot",
    description:
      "Film va seriallarni qidirish, ular haqida ma’lumot olish hamda foydalanuvchiga mos tavsiyalar beruvchi Telegram bot.",
    category: "Telegram bot",
    stack: ["Telegram Bot API", "Node.js", "REST API", "Automation"],
    accent: "from-fuchsia-600 via-violet-500 to-indigo-600",
    metric: "Smart discovery",
    year: "2026",
    role: "Bot development",
    challenge: "Film qidiruvi va tavsiyalarini bitta sodda Telegram tajribasiga jamlash.",
    solution: "Nom, janr va foydalanuvchi qiziqishlari bo‘yicha tez ishlaydigan avtomatlashtirilgan bot oqimi.",
    outcomes: ["Tezkor film qidiruvi", "Batafsil ma’lumot", "Shaxsiy tavsiyalar"],
    github: "",
    live: "https://t.me/FilmXBot_bot",
    image: "/images/projects/filmxbot.png",
  },
  {
    slug: "ai-chatbot",
    title: "AI Chatbot",
    description: "Telegram ichida tezkor AI yordamchi tajribasini beruvchi chatbot.",
    category: "Telegram bot",
    stack: ["Node.js", "AI API", "Telegram Bot API", "JavaScript"],
    accent: "from-cyan-500 via-blue-500 to-indigo-600",
    metric: "AI assistant",
    year: "2026",
    role: "Bot development & integration",
    challenge: "AI bilan muloqotni Telegram ichida tez, sodda va barqaror qilish.",
    solution: "Foydalanuvchi so‘rovlarini AI servisiga ulaydigan ixcham va qulay chatbot.",
    outcomes: ["Tezkor AI javoblari", "Telegram integratsiyasi", "Ochiq manba kodi"],
    github: "https://github.com/sanjarbek404/ai-bot.git",
    live: "https://t.me/devzeroai_bot",
    image: "/images/projects/ai-chatbot.png",
  },
  {
    slug: "3d-earth",
    title: "3D EARTH",
    description: "Yer sharini interaktiv tarzda ko‘rsatadigan 3D web tajriba.",
    category: "Web ilova",
    stack: ["JavaScript", "3D Web", "HTML5", "CSS"],
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    metric: "Interactive 3D",
    year: "2026",
    role: "Frontend development",
    challenge: "Brauzerda yengil va qiziqarli 3D vizual tajriba yaratish.",
    solution: "Interaktiv boshqaruvlar va moslashuvchan sahna bilan yaratilgan Yerning 3D maketi.",
    outcomes: ["Interaktiv 3D sahna", "Brauzerda ishlaydi", "Ochiq manba kodi"],
    github: "https://github.com/sanjarbek404/3d-earth.git",
    live: "https://sanjarbek404.github.io/3d-earth/",
    image: "/images/projects/3d-earth.png",
  },
  {
    slug: "aura-habit-tracker",
    title: "Aura Habit Tracker",
    description: "Foydali odatlarni shakllantirish va muntazam kuzatib borish uchun PWA platforma.",
    category: "PWA ilova",
    stack: ["PWA", "JavaScript", "Local Storage", "Responsive UI"],
    accent: "from-violet-600 via-purple-500 to-pink-500",
    metric: "Habit building",
    year: "2026",
    role: "Product design & frontend",
    challenge: "Kundalik odatlarni kuzatishni ortiqcha murakkabliksiz yo‘lga qo‘yish.",
    solution: "Tez qayd qilish, progressni ko‘rish va qurilmaga o‘rnatish imkoniyatiga ega PWA.",
    outcomes: ["Odatlar monitoringi", "O‘rnatiladigan PWA", "Mobil-first dizayn"],
    github: "https://github.com/sanjarbek404/HabitTracker.git",
    live: "https://sanjarbek404.github.io/HabitTracker/",
    image: "/images/projects/aura-habit-tracker.png",
  },
  {
    slug: "it-quiz",
    title: "IT QUIZ",
    description: "IT bo‘yicha zamonaviy savollar orqali bilimni tekshiruvchi interaktiv web ilova.",
    category: "Web ilova",
    stack: ["JavaScript", "HTML5", "CSS", "Responsive UI"],
    accent: "from-sky-500 via-blue-600 to-violet-600",
    metric: "Interactive learning",
    year: "2026",
    role: "Frontend development",
    challenge: "IT bilimlarini tekshirishni sodda va qiziqarli tajribaga aylantirish.",
    solution: "Savollar, natijalar va tezkor fikr-mulohazani birlashtirgan responsiv quiz interfeysi.",
    outcomes: ["Interaktiv testlar", "Darhol natija", "Barcha qurilmalarga mos"],
    github: "",
    live: "https://itquizs.netlify.app/",
    image: "/images/projects/it-quiz.png",
  },
];

export const certificates = [
  { title: "Meta Frontend Developer", issuer: "Meta", year: "2026", image: "https://i.ibb.co/Txq102hn/Screenshot-2026-04-16-114509.png", href: "https://www.coursera.org/account/accomplishments/specialization/C54O8ZTSKJIQ" },
  { title: "Certified Ethical Hacker", issuer: "Pearson", year: "2025", image: "https://i.ibb.co/9HryvfXY/Screenshot-2026-05-18-214427.png", href: "https://www.coursera.org/account/accomplishments/specialization/9IMPH143RVW1" },
  { title: "Git and GitHub Complete Master Class", issuer: "Packt", year: "2025", image: "https://i.ibb.co/s9fJXGjk/Screenshot-2026-05-18-220304.png", href: "https://www.coursera.org/account/accomplishments/specialization/3B0CS1JKDHU2" },
  { title: "Cybersecurity in Modern Organizations", issuer: "Coursera", year: "2025", image: "https://i.ibb.co/5hrz6nZf/Screenshot-2026-05-18-215217.png", href: "https://www.coursera.org/account/accomplishments/specialization/XS5P97I39JMV" },
  { title: "Google AI", issuer: "Google", year: "2026", image: "https://i.ibb.co/WNrPwr4g/Screenshot-2026-04-26-134421.png", href: "https://coursera.org/verify/professional-cert/FLHNOQPCAX7V" },
  { title: "Meta Full Stack Developer", issuer: "Meta", year: "2026", image: "https://i.ibb.co/bjGbFJ22/Screenshot-2026-04-26-134653.png", href: "https://coursera.org/verify/specialization/HMSLCW4X6WZ7" },
  { title: "Learn English: Beginning Grammar", issuer: "UC Irvine", year: "2025", image: "https://i.ibb.co/1tY8MkbP/Screenshot-2026-05-18-215418.png", href: "https://www.coursera.org/account/accomplishments/specialization/3MC10AFSQ0NK" },
  { title: "JavaScript from Beginner to Expert 2.0", issuer: "Packt", year: "2025", image: "https://i.ibb.co/20fd16C0/Screenshot-2026-05-18-220121.png", href: "https://www.coursera.org/account/accomplishments/specialization/KQ31TMD7P02Q" },
  { title: "CompTIA IT Fundamentals", issuer: "Coursera", year: "2025", image: "https://i.ibb.co/hFzGBdXb/Screenshot-2026-05-18-215853.png", href: "https://www.coursera.org/account/accomplishments/specialization/4J1E2B489XZM" },
  { title: "Google Prompting Essentials", issuer: "Google", year: "2025", image: "https://i.ibb.co/VW8rWNkX/Screenshot-2026-05-18-215050.png", href: "https://www.coursera.org/account/accomplishments/specialization/1U0E3OMLWJWR" },
  { title: "Cyber Security: Leadership", issuer: "Coursera", year: "2025", image: "https://i.ibb.co/DPd1R0CK/Screenshot-2026-05-18-214804.png", href: "https://www.coursera.org/account/accomplishments/specialization/2SOJVQULTEE8" },
];

export const workflow = [
  { number: "01", title: "Tahlil va Rejalashtirish", description: "Loyiha talablarini o‘rganish, maqsadlarni belgilash va texnik yechimlarni tanlash." },
  { number: "02", title: "Dizayn va Prototip", description: "UI/UX dizaynini yaratish va interaktiv prototiplarni tayyorlash." },
  { number: "03", title: "Dasturlash", description: "Tasdiqlangan dizayn asosida frontend va backend qismlarini kodlash, ma’lumotlar bazasini ulash." },
  { number: "04", title: "Testlash va Ishga tushirish", description: "Barcha funksiyalarni tekshirish, xatolarni to‘g‘rilash va loyihani ommaga taqdim etish." },
];

export const timeline = [
  {
    period: "2025 — hozirgacha",
    title: "Full Stack Dasturchi",
    company: "IT-PARK · Al Xorazmiy Vorislari",
    description:
      "Al Xorazmiy Vorislari loyihasida ta’lim olib, JavaScript, Node.js, React, Python va MongoDB texnologiyalarini o‘rgandim.",
    type: "education",
  },
];

export const faq = [
  { question: "Siz qanday texnologiyalar bilan ishlaysiz?", answer: "Men asosan React, TypeScript, Node.js, Tailwind CSS va Firebase bilan ishlayman. Loyiha talabiga ko‘ra boshqa zamonaviy vositalarni ham tez o‘zlashtira olaman." },
  { question: "Bitta loyiha qancha vaqt oladi?", answer: "Loyihaning hajmi va murakkabligiga qarab 1 haftadan 2 oygacha vaqt olishi mumkin. Aniq muddat talablar muhokamasidan keyin belgilanadi." },
  { question: "Loyiha tugagandan keyin qo‘llab-quvvatlaysizmi?", answer: "Ha. Loyiha topshirilgandan keyin ham kelishuv asosida texnik xizmat, yangilanish va qo‘llab-quvvatlashni davom ettiraman." },
  { question: "To‘lovlar qanday amalga oshiriladi?", answer: "Odatda to‘lov 2 yoki 3 qismga bo‘linadi: 30–50% oldindan, qolgan qismi esa loyiha bosqichlari yoki yakuniy topshirishda to‘lanadi." },
];

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/sanjarbek404" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sanjarbek-otabekov-0600733bb/" },
  { label: "Telegram", href: "https://t.me/sanjarbek_404" },
];
