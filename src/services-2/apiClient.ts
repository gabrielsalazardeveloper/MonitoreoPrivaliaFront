// ==============================
// API CLIENT - WRAPPER PARA APIS
// ==============================
// TODO: Reemplazar mockApi con llamadas reales usando axios/fetch

import { mockApi } from "./mockApi";
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

// TODO: Descomentar cuando se conecte el backend real
// import axios from 'axios';
// import { API_BASE } from '@/config';
// const api = axios.create({ baseURL: API_BASE });

export const apiClient = {
  // Autenticación
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    // TODO: return api.post('/auth/login', credentials).then(res => res.data);
    return mockApi.login(credentials);
  },

  verifySystemPassword: (password: string): Promise<boolean> => {
    // TODO: return api.post('/auth/verify', { password }).then(res => res.data);
    return mockApi.verifySystemPassword(password);
  },

  // Dashboard
  getDashboardData: (): Promise<DashboardData> => {
    // TODO: return api.get('/dashboard').then(res => res.data);
    return mockApi.getDashboardData();
  },

  // Reportes
  getReport: (tabId: string): Promise<Report | undefined> => {
    // TODO: return api.get(`/reports/${tabId}`).then(res => res.data);
    return mockApi.getReport(tabId);
  },

  saveReport: (report: Report): Promise<boolean> => {
    // TODO: return api.put(`/reports/${report.id}`, report).then(res => res.data);
    return mockApi.saveReport(report);
  },

  sendReport: (payload: {
    reportId: string;
    subject: string;
    body: string;
    recipients: string[];
    footer: string;
  }): Promise<boolean> => {
    // TODO: return api.post('/reports/send', payload).then(res => res.data);
    return mockApi.sendReport(payload);
  },

  // Jobs
  getJobs: (): Promise<Job[]> => {
    // TODO: return api.get('/jobs').then(res => res.data);
    return mockApi.getJobs();
  },

  getJob: (jobId: string): Promise<Job | undefined> => {
    // TODO: return api.get(`/jobs/${jobId}`).then(res => res.data);
    return mockApi.getJob(jobId);
  },

  saveJob: (job: Job): Promise<boolean> => {
    // TODO: return api.put(`/jobs/${job.id}`, job).then(res => res.data);
    return mockApi.saveJob(job);
  },

  addObservation: (jobId: string, observation: Observation): Promise<boolean> => {
    // TODO: return api.post(`/jobs/${jobId}/observations`, observation).then(res => res.data);
    return mockApi.addObservation(jobId, observation);
  },

  // Perfil
  getProfile: (): Promise<User> => {
    // TODO: return api.get('/profile').then(res => res.data);
    return mockApi.getProfile();
  },

  updateProfile: (user: Partial<User>): Promise<boolean> => {
    // TODO: return api.put('/profile', user).then(res => res.data);
    return mockApi.updateProfile(user);
  },

  getCredentials: (): Promise<Credential[]> => {
    // TODO: return api.get('/credentials').then(res => res.data);
    return mockApi.getCredentials();
  },

  updateCredential: (credential: Credential): Promise<boolean> => {
    // TODO: return api.put(`/credentials/${credential.id}`, credential).then(res => res.data);
    return mockApi.updateCredential(credential);
  },

  testSMTPConnection: (): Promise<boolean> => {
    // TODO: return api.post('/smtp/test').then(res => res.data);
    return mockApi.testSMTPConnection();
  },
};
