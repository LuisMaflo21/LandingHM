export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  level: 'basico' | 'intermedio' | 'avanzado';
  primaryGoal: string;
  consentPrivacy: boolean;
  consentMarketing: boolean;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'active' | 'unsubscribed' | 'deleted';
  emailNotification: {
    status: 'sent' | 'delivered';
    sentAt: string;
    subject: string;
    messagePreview: string;
  };
  downloads: number;
}

export interface AppConfig {
  specialOfferCourseUrl: string; // https://go.hotmart.com/A104149092W?dp=1 ($5 USD)
  beginnerCourseUrl: string;     // https://go.hotmart.com/A103454189R?dp=1 (Excel Principiantes)
  businessCourseUrl: string;     // https://go.hotmart.com/K104148913I?dp=1 (Excel Empresarial)
  ebookCourseUrl: string;        // https://go.hotmart.com/G104148965I?dp=1 (Ebook Excel)
  templateGoogleSheetUrl: string;// https://docs.google.com/spreadsheets/d/1ii6AQvG85GPbTCzrLg9RtKfA0Sj9cWXy/edit?gid=996178209#gid=996178209
  basicCourseUrl?: string;
  intermediateCourseUrl?: string;
  advancedCourseUrl?: string;
  masterBundleUrl?: string;
  companyName: string;
  supportEmail: string;
  hotmartGuaranteeDays: number;
  templateFileName: string;
}

export interface CourseLevel {
  id: 'oferta-5' | 'principiantes' | 'empresarial' | 'ebook';
  tag: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  levelBadge: string;
  targetAudience: string;
  originalPrice: number;
  currentPrice: number;
  currency: string;
  durationHours: string;
  modulesCount: number;
  lessonsCount: number;
  featured?: boolean;
  hotmartUrl: string;
  highlights: string[];
  modules: {
    title: string;
    lessons: string[];
  }[];
}
