// ==============================
// FORMATTERS - FUNCIONES DE FORMATO
// ==============================

export const formatters = {
  formatDate: (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  formatDateTime: (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  formatTime: (date: Date): string => {
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  },

  maskPassword: (password: string): string => {
    return "•".repeat(password.length);
  },

  splitEmails: (emailString: string): string[] => {
    return emailString
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
  },

  joinEmails: (emails: string[]): string => {
    return emails.join(", ");
  },
};
