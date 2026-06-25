import { defineStore } from "pinia";
import { ref } from "vue";

export interface AppSettings {
  language: "zh-CN" | "en-US";
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
}

export const useSettingsStore = defineStore("settings", () => {
  const language = ref<"zh-CN" | "en-US">("zh-CN");
  const sidebarOpen = ref(true);
  const theme = ref<"light" | "dark" | "system">("system");

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function setLanguage(lang: "zh-CN" | "en-US") {
    language.value = lang;
  }

  function setTheme(t: "light" | "dark" | "system") {
    theme.value = t;
  }

  return {
    language,
    sidebarOpen,
    theme,
    toggleSidebar,
    setLanguage,
    setTheme,
  };
});
