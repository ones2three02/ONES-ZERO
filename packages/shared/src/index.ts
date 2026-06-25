export interface AppInfo {
  name: string;
  version: string;
  description: string;
}

export const APP_INFO: AppInfo = {
  name: "ONES-ZERO",
  version: "1.0.0",
  description: "A beautiful clean template framework built with Tauri and Vue 3",
};

export function formatGreeting(name: string): string {
  return `Hello, ${name}! Welcome to ONES-ZERO.`;
}
