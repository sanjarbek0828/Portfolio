"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "UZ" | "RU" | "EN";

const dictionaries: Record<Language, Record<string, string>> = {
  UZ: {
    "nav.about": "Men haqimda", "nav.skills": "Ko‘nikmalar", "nav.projects": "Loyihalar", "nav.experience": "Tajriba", "nav.contact": "Bog‘lanish",
    "hero.greeting": "Salom, men", "hero.description": "Zamonaviy texnologiyalar yordamida tezkor, responsiv va foydalanuvchiga qulay web tajribalar yarataman.", "hero.stack": "Tech stack", "hero.capabilities": "Nimalar qilaman", "hero.cta": "Bog‘lanish", "hero.projects": "Loyihalarni ko‘rish", "hero.available": "Freelance uchun bo‘shman", "hero.responsive": "Responsiv web dizayn", "hero.fullstack": "Full-stack dasturlash", "hero.uiux": "UI/UX implementatsiya", "hero.clean": "Toza va barqaror kod",
    "about.label": "Men haqimda", "about.text": "Dasturlash men uchun shunchaki kod yozish jarayoni emas. Bu — insonlar duch keladigan muammolarni tushunish, ularga qulay va samarali yechimlar topish hamda hayotini yengillashtiradigan vositalar yaratishdir.",
    "services.label": "Xizmatlar", "services.title": "G‘oyadan ishlaydigan mahsulotgacha.", "services.description": "Loyiha uchun kerak bo‘ladigan barcha asosiy dizayn va texnik yechimlar bir joyda.",
    "skills.label": "Ko‘nikmalar", "skills.title": "Men foydalanadigan texnologiyalar.", "skills.description": "Frontend, backend, ma’lumotlar bazasi va dizaynni bir butun mahsulotga birlashtiraman.",
    "projects.eyebrow": "Tanlangan loyihalar", "projects.title": "Natija uchun yaratilgan raqamli mahsulotlar.", "projects.description": "Strategiya, dizayn va muhandislikni birlashtirgan real web ilovalar, PWA platformalar va Telegram botlar.", "projects.search": "Loyiha yoki texnologiyani qidiring...", "projects.count": "ta loyiha", "projects.details": "Batafsil ko‘rish", "projects.empty": "Mos loyiha topilmadi.", "projects.clear": "Filtrlarni tozalash", "projects.github": "GitHub’dagi barcha loyihalar", "projects.all": "Barchasi", "projects.problem": "Muammo", "projects.solution": "Yechim", "projects.outcomes": "Asosiy natijalar", "projects.role": "Vazifa", "projects.source": "Manba kodi", "projects.open": "Loyihani ochish",
    "certificates.label": "Sertifikatlar", "certificates.title": "Doimiy o‘rganish natijalari.", "certificates.description": "Meta, Google, Coursera, Packt va boshqa xalqaro ta’lim platformalaridagi yutuqlar.",
    "experience.label": "Ta’lim va tajriba", "workflow.label": "Ish jarayoni", "workflow.title": "G‘oyadan tayyor mahsulotgacha.",
    "testimonial.quote": "Sanjarbek bilan ishlash juda oson kechdi. U bizning talablarimizni tez tushundi va ajoyib veb-ilova yaratib berdi.", "testimonial.role": "Mebel do‘koni", "faq.label": "Ko‘p beriladigan savollar",
    "contact.label": "Keling, gaplashamiz", "contact.title": "Yangi loyihani birga boshlaymiz.", "contact.description": "Yangi loyiha ustida ishlashga yoki shunchaki fikr almashishga doim tayyorman.", "contact.formTitle": "Loyiha haqida yozing", "contact.name": "Ismingiz", "contact.email": "Email manzilingiz", "contact.type": "Loyiha turi", "contact.budget": "Taxminiy budjet", "contact.message": "Xabaringiz", "contact.send": "Xabar yuborish", "contact.sending": "Yuborilmoqda...", "contact.success": "Xabaringiz qabul qilindi. Tez orada javob beraman.", "contact.error": "Xabar yuborilmadi. Qayta urinib ko‘ring.",
    "footer.built": "Next.js, TypeScript va e’tibor bilan yaratildi.",
  },
  RU: {
    "nav.about": "Обо мне", "nav.skills": "Навыки", "nav.projects": "Проекты", "nav.experience": "Опыт", "nav.contact": "Контакты",
    "hero.greeting": "Привет, я", "hero.description": "Создаю быстрые, адаптивные и удобные веб-продукты с помощью современных технологий.", "hero.stack": "Технологии", "hero.capabilities": "Что я делаю", "hero.cta": "Связаться", "hero.projects": "Смотреть проекты", "hero.available": "Открыт для фриланса", "hero.responsive": "Адаптивный веб-дизайн", "hero.fullstack": "Full-stack разработка", "hero.uiux": "UI/UX реализация", "hero.clean": "Чистый и надежный код",
    "about.label": "Обо мне", "about.text": "Программирование для меня — это не просто написание кода. Это понимание проблем людей и создание удобных, эффективных инструментов, которые экономят время и упрощают жизнь.",
    "services.label": "Услуги", "services.title": "От идеи до работающего продукта.", "services.description": "Все ключевые дизайнерские и технические решения для вашего проекта в одном месте.",
    "skills.label": "Навыки", "skills.title": "Технологии, которые я использую.", "skills.description": "Объединяю frontend, backend, базы данных и дизайн в единый продукт.",
    "projects.eyebrow": "Избранные проекты", "projects.title": "Цифровые продукты, созданные для результата.", "projects.description": "Реальные веб-приложения, PWA-платформы и Telegram-боты на стыке стратегии, дизайна и разработки.", "projects.search": "Найти проект или технологию...", "projects.count": "проектов", "projects.details": "Подробнее", "projects.empty": "Проекты не найдены.", "projects.clear": "Сбросить фильтры", "projects.github": "Все проекты на GitHub", "projects.all": "Все", "projects.problem": "Задача", "projects.solution": "Решение", "projects.outcomes": "Результаты", "projects.role": "Роль", "projects.source": "Исходный код", "projects.open": "Открыть проект",
    "certificates.label": "Сертификаты", "certificates.title": "Результаты постоянного обучения.", "certificates.description": "Достижения на международных платформах Meta, Google, Coursera, Packt и других.",
    "experience.label": "Образование и опыт", "workflow.label": "Процесс работы", "workflow.title": "От идеи до готового продукта.",
    "testimonial.quote": "Работать с Санжарбеком было очень легко. Он быстро понял наши требования и создал отличное веб-приложение.", "testimonial.role": "Мебельный магазин", "faq.label": "Частые вопросы",
    "contact.label": "Давайте поговорим", "contact.title": "Начнем новый проект вместе.", "contact.description": "Я всегда открыт к новому проекту или простому обмену идеями.", "contact.formTitle": "Расскажите о проекте", "contact.name": "Ваше имя", "contact.email": "Email", "contact.type": "Тип проекта", "contact.budget": "Примерный бюджет", "contact.message": "Сообщение", "contact.send": "Отправить", "contact.sending": "Отправка...", "contact.success": "Сообщение получено. Я скоро отвечу.", "contact.error": "Не удалось отправить сообщение. Попробуйте снова.",
    "footer.built": "Создано с Next.js, TypeScript и вниманием к деталям.",
  },
  EN: {
    "nav.about": "About", "nav.skills": "Skills", "nav.projects": "Projects", "nav.experience": "Experience", "nav.contact": "Contact",
    "hero.greeting": "Hello, I’m", "hero.description": "I create fast, responsive and user-friendly web experiences with modern technologies.", "hero.stack": "Tech stack", "hero.capabilities": "What I do", "hero.cta": "Let’s connect", "hero.projects": "View projects", "hero.available": "Available for freelance", "hero.responsive": "Responsive web design", "hero.fullstack": "Full-stack development", "hero.uiux": "UI/UX implementation", "hero.clean": "Clean and maintainable code",
    "about.label": "About me", "about.text": "Programming is more than writing code to me. It is about understanding real problems and building useful, efficient tools that save time and make everyday work easier.",
    "services.label": "Services", "services.title": "From idea to a working product.", "services.description": "All essential design and engineering solutions your project needs, brought together in one process.",
    "skills.label": "Skills", "skills.title": "Technologies I work with.", "skills.description": "I combine frontend, backend, databases and design into one coherent product.",
    "projects.eyebrow": "Selected work", "projects.title": "Digital products built for outcomes.", "projects.description": "Real web applications, PWA platforms and Telegram bots balancing strategy, design and engineering.", "projects.search": "Search projects or technologies...", "projects.count": "projects", "projects.details": "View details", "projects.empty": "No matching projects found.", "projects.clear": "Clear filters", "projects.github": "All projects on GitHub", "projects.all": "All", "projects.problem": "Challenge", "projects.solution": "Solution", "projects.outcomes": "Key outcomes", "projects.role": "Role", "projects.source": "Source code", "projects.open": "Open project",
    "certificates.label": "Certificates", "certificates.title": "The outcome of continuous learning.", "certificates.description": "Achievements from Meta, Google, Coursera, Packt and other international learning platforms.",
    "experience.label": "Education & experience", "workflow.label": "Workflow", "workflow.title": "From idea to finished product.",
    "testimonial.quote": "Working with Sanjarbek was effortless. He understood our requirements quickly and delivered an excellent web application.", "testimonial.role": "Furniture store", "faq.label": "Frequently asked questions",
    "contact.label": "Let’s talk", "contact.title": "Let’s start your next project.", "contact.description": "I am always open to a new project or simply exchanging ideas.", "contact.formTitle": "Tell me about your project", "contact.name": "Your name", "contact.email": "Email address", "contact.type": "Project type", "contact.budget": "Estimated budget", "contact.message": "Your message", "contact.send": "Send message", "contact.sending": "Sending...", "contact.success": "Message received. I’ll get back to you soon.", "contact.error": "Message could not be sent. Please try again.",
    "footer.built": "Built with Next.js, TypeScript and attention to detail.",
  },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({ language: "UZ", setLanguage: () => undefined, t: (key, fallback) => fallback || key });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("UZ");

  useEffect(() => {
    const stored = window.localStorage.getItem("portfolio-language") as Language | null;
    if (stored && ["UZ", "RU", "EN"].includes(stored)) setLanguageState(stored);
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("portfolio-language", nextLanguage);
    document.documentElement.lang = nextLanguage.toLowerCase();
  };

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (key, fallback) => dictionaries[language][key] || dictionaries.UZ[key] || fallback || key,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
