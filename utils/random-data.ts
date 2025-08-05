// Random data generators for forms

export const randomNames = [
  "Ahmed Al-Mahmoud",
  "Fatima Al-Thani",
  "Mohammed Al-Kuwari",
  "Aisha Al-Ansari",
  "Omar Al-Sulaiti",
  "Mariam Al-Attiyah",
  "Khalid Al-Mannai",
  "Nora Al-Dosari",
]

export const randomNamesArabic = [
  "أحمد المحمود",
  "فاطمة الثاني",
  "محمد الكواري",
  "عائشة الأنصاري",
  "عمر السليطي",
  "مريم العطية",
  "خالد المناعي",
  "نورا الدوسري",
]

export const randomCompanies = [
  "Qatar Construction Co.",
  "Doha Engineering Solutions",
  "Gulf Tech Services",
  "Al-Rayyan Development",
  "Qatar Digital Solutions",
  "Pearl Consulting Group",
  "Lusail Business Services",
  "Qatar Innovation Hub",
]

export const randomCompaniesArabic = [
  "شركة قطر للإنشاءات",
  "حلول الدوحة الهندسية",
  "خدمات الخليج التقنية",
  "تطوير الريان",
  "الحلول الرقمية القطرية",
  "مجموعة اللؤلؤة الاستشارية",
  "خدمات لوسيل التجارية",
  "مركز قطر للابتكار",
]

export const randomTenderTitles = [
  "Office Building Construction Project",
  "Website Development and Design",
  "HVAC System Installation",
  "Legal Advisory Services",
  "Transportation Fleet Management",
  "IT Infrastructure Upgrade",
  "Marketing Campaign Development",
  "Facility Maintenance Services",
]

export const randomTenderTitlesArabic = [
  "مشروع بناء مبنى مكاتب",
  "تطوير وتصميم موقع إلكتروني",
  "تركيب نظام التكييف والتهوية",
  "خدمات استشارية قانونية",
  "إدارة أسطول النقل",
  "ترقية البنية التحتية لتقنية المعلومات",
  "تطوير حملة تسويقية",
  "خدمات صيانة المرافق",
]

export const randomDescriptions = [
  "We are looking for a qualified contractor to handle this important project. The work should be completed to the highest standards and within the specified timeline. All materials and labor must comply with Qatar's building codes and regulations.",
  "This project requires experienced professionals with proven track record in similar work. We expect detailed proposals with clear timelines, cost breakdowns, and quality assurance measures.",
  "Seeking reliable service provider for long-term partnership. The selected vendor should demonstrate expertise, reliability, and commitment to excellence. Previous experience in Qatar market is preferred.",
]

export const randomDescriptionsArabic = [
  "نحن نبحث عن مقاول مؤهل للتعامل مع هذا المشروع المهم. يجب إنجاز العمل وفقاً لأعلى المعايير وضمن الإطار الزمني المحدد. جميع المواد والعمالة يجب أن تتوافق مع قوانين البناء في قطر.",
  "يتطلب هذا المشروع محترفين ذوي خبرة مع سجل حافل في أعمال مماثلة. نتوقع مقترحات مفصلة مع جداول زمنية واضحة وتفصيل التكاليف وإجراءات ضمان الجودة.",
  "نبحث عن مقدم خدمة موثوق للشراكة طويلة المدى. يجب على البائع المختار إثبات الخبرة والموثوقية والالتزام بالتميز. الخبرة السابقة في السوق القطري مفضلة.",
]

export function generateRandomEmail(): string {
  const domains = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"]
  const names = ["ahmed", "fatima", "mohammed", "aisha", "omar", "mariam", "khalid", "nora"]
  const numbers = Math.floor(Math.random() * 999) + 1

  return `${names[Math.floor(Math.random() * names.length)]}${numbers}@${domains[Math.floor(Math.random() * domains.length)]}`
}

export function generateRandomPhone(): string {
  const numbers = Math.floor(Math.random() * 90000000) + 10000000
  return numbers.toString()
}

export function generateRandomNationalId(): string {
  return Math.floor(Math.random() * 900000000) + 100000000 + ""
}

export function generateRandomCR(): string {
  return Math.floor(Math.random() * 900000) + 100000 + ""
}

export function generateRandomBudget(): string {
  const budgets = ["5000", "15000", "50000", "100000", "250000", "500000", "1000000"]
  return budgets[Math.floor(Math.random() * budgets.length)]
}

export function generateRandomDate(daysFromNow = 30): string {
  const date = new Date()
  date.setDate(date.getDate() + Math.floor(Math.random() * daysFromNow) + 1)
  return date.toISOString().split("T")[0]
}

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Create mock file for uploads
export function createMockFile(name: string, type = "application/pdf"): File {
  const content = new Blob(["Mock file content"], { type })
  return new File([content], name, { type })
}
