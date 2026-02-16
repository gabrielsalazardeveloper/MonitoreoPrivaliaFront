// ==============================
// INTERFACES CENTRALIZADAS
// ==============================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  outlookPasswordEncrypted?: string;
}

export interface Report {
  id: string;
  tabId: string;
  content: string;
  recipients: string[];
  subject: string;
  footer: string;
  previewHtml?: string;
}

export interface Observation {
  id: string;
  user: string;
  text: string;
  datetime: string;
}

export interface Job {
  id: string;
  name: string;
  url: string;
  description: string;
  observations: Observation[];
}

export interface MailConfig {
  id: string;
  userId: string;
  smtpHost: string;
  smtpPort: number;
  email: string;
  passwordEncrypted: string;
}

export interface Credential {
  id: string;
  service: string;
  username: string;
  passwordEncrypted: string;
}

export interface DashboardData {
  erroresReportados: number;
  pendientesPorRespuesta: number;
  reportesSolucionados: number;
  chartData: {
    name: string;
    errores: number;
    pendientes: number;
    solucionados: number;
  }[];
  pieData: {
    name: string;
    value: number;
  }[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
