// ==============================
// MOCK API - DATOS HARDCODEADOS
// ==============================
// TODO: Reemplazar con llamadas reales al backend

import {
  User,
  Report,
  Job,
  Credential,
  DashboardData,
  LoginCredentials,
  AuthResponse,
  Observation,
} from "@/types/interfaces";
import { APP_CONFIG } from "@/config";

// Simulación de latencia
const delay = () => {
  const { min, max } = APP_CONFIG.mockLatency;
  return new Promise((resolve) =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  );
};

// ==============================
// DATOS HARDCODEADOS
// ==============================

let mockUser: User = {
  id: "user-001",
  name: "Juan Pérez García",
  email: "juan.perez@empresa.com",
  phone: "+52 55 1234 5678",
  position: "Analista de Sistemas",
  outlookPasswordEncrypted: "encrypted_outlook_pass",
};

const mockSystemPassword = "admin123"; // Contraseña del sistema para verificación

let mockCredentials: Credential[] = [
  { id: "cred-1", service: "Outlook", username: "juan.perez@empresa.com", passwordEncrypted: "enc_outlook_123" },
  { id: "cred-2", service: "Rundeck", username: "jperez", passwordEncrypted: "enc_rundeck_456" },
  { id: "cred-3", service: "Privalia", username: "jperez", passwordEncrypted: "enc_privalia_789" },
  { id: "cred-4", service: "Bomex", username: "juan.perez", passwordEncrypted: "enc_bomex_012" },
  { id: "cred-5", service: "New Relic", username: "jperez@empresa.com", passwordEncrypted: "enc_newrelic_345" },
  { id: "cred-6", service: "LogRocket", username: "jperez", passwordEncrypted: "enc_logrocket_678" },
];

let mockReports: Report[] = Array.from({ length: 14 }, (_, i) => ({
  id: `report-mc${String(i + 1).padStart(2, "0")}`,
  tabId: `mc${String(i + 1).padStart(2, "0")}`,
  content: `Contenido inicial del reporte MC${String(i + 1).padStart(2, "0")}. Este es un ejemplo de consulta que se ejecutaría en el sistema.`,
  recipients: ["admin@empresa.com", "soporte@empresa.com"],
  subject: `Reporte MC${String(i + 1).padStart(2, "0")} - Análisis de Errores`,
  footer: `${mockUser.name}\n${mockUser.phone}\n${mockUser.position}`,
  previewHtml: "",
}));

let mockJobs: Job[] = Array.from({ length: 10 }, (_, i) => ({
  id: `job-${i + 1}`,
  name: `Job ${i + 1}`,
  url: i === 0 ? "https://www.example.com" : "",
  description: `Descripción del Job ${i + 1}. Este job se encarga de monitorear el sistema.`,
  observations: [
    {
      id: `obs-${i}-1`,
      user: "Juan Pérez",
      text: `Primera observación del Job ${i + 1}`,
      datetime: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    },
    {
      id: `obs-${i}-2`,
      user: "María González",
      text: `Revisión completada sin incidencias`,
      datetime: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
    },
  ],
}));

const mockDashboardData: DashboardData = {
  erroresReportados: 47,
  pendientesPorRespuesta: 12,
  reportesSolucionados: 35,
  chartData: [
    { name: "Lun", errores: 8, pendientes: 3, solucionados: 5 },
    { name: "Mar", errores: 12, pendientes: 4, solucionados: 8 },
    { name: "Mié", errores: 6, pendientes: 2, solucionados: 4 },
    { name: "Jue", errores: 10, pendientes: 5, solucionados: 5 },
    { name: "Vie", errores: 11, pendientes: 3, solucionados: 8 },
  ],
  pieData: [
    { name: "Reportados", value: 47 },
    { name: "Pendientes", value: 12 },
    { name: "Solucionados", value: 35 },
  ],
};

// ==============================
// FUNCIONES DE API SIMULADAS
// ==============================

export const mockApi = {
  // Autenticación
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay();
    if (
      credentials.email === mockUser.email &&
      credentials.password === mockSystemPassword
    ) {
      return {
        success: true,
        token: "mock-jwt-token-12345",
        user: mockUser,
      };
    }
    return {
      success: false,
      message: "Credenciales incorrectas",
    };
  },

  verifySystemPassword: async (password: string): Promise<boolean> => {
    await delay();
    return password === mockSystemPassword;
  },

  // Dashboard
  getDashboardData: async (): Promise<DashboardData> => {
    await delay();
    return mockDashboardData;
  },

  // Reportes
  getReport: async (tabId: string): Promise<Report | undefined> => {
    await delay();
    return mockReports.find((r) => r.tabId === tabId);
  },

  saveReport: async (report: Report): Promise<boolean> => {
    await delay();
    const index = mockReports.findIndex((r) => r.id === report.id);
    if (index !== -1) {
      mockReports[index] = report;
      return true;
    }
    return false;
  },

  sendReport: async (payload: {
    reportId: string;
    subject: string;
    body: string;
    recipients: string[];
    footer: string;
  }): Promise<boolean> => {
    await delay();
    console.log("📧 Enviando reporte (simulado):", payload);
    return true;
  },

  // Jobs
  getJobs: async (): Promise<Job[]> => {
    await delay();
    return mockJobs;
  },

  getJob: async (jobId: string): Promise<Job | undefined> => {
    await delay();
    return mockJobs.find((j) => j.id === jobId);
  },

  saveJob: async (job: Job): Promise<boolean> => {
    await delay();
    const index = mockJobs.findIndex((j) => j.id === job.id);
    if (index !== -1) {
      mockJobs[index] = job;
      return true;
    }
    return false;
  },

  addObservation: async (jobId: string, observation: Observation): Promise<boolean> => {
    await delay();
    const job = mockJobs.find((j) => j.id === jobId);
    if (job) {
      job.observations.push(observation);
      return true;
    }
    return false;
  },

  // Perfil
  getProfile: async (): Promise<User> => {
    await delay();
    return mockUser;
  },

  updateProfile: async (user: Partial<User>): Promise<boolean> => {
    await delay();
    mockUser = { ...mockUser, ...user };
    return true;
  },

  getCredentials: async (): Promise<Credential[]> => {
    await delay();
    return mockCredentials;
  },

  updateCredential: async (credential: Credential): Promise<boolean> => {
    await delay();
    const index = mockCredentials.findIndex((c) => c.id === credential.id);
    if (index !== -1) {
      mockCredentials[index] = credential;
      return true;
    }
    return false;
  },

  testSMTPConnection: async (): Promise<boolean> => {
    await delay();
    // Simular éxito en el 80% de los casos
    return Math.random() > 0.2;
  },
};
