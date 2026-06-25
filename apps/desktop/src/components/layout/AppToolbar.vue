<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Moon, Sun, SunMoon, Languages, Menu } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import WindowControls from "@/components/layout/WindowControls.vue";
import { shouldReserveMacTrafficLightInset, useWindowControls } from "@/composables/useWindowControls";
import { currentLocale, setLocale } from "@/i18n";

const props = defineProps<{
  isDark: boolean;
  themeMode: "light" | "dark" | "system";
}>();

const emit = defineEmits<{
  "set-theme-mode": [mode: "light" | "dark" | "system"];
  "toggle-sidebar": [];
}>();

const { t } = useI18n();
const { isMac, isDesktop, showControls, isMaximized, minimize, toggleMaximize, close } = useWindowControls();

const currentLangLabel = computed(() => {
  return currentLocale() === "zh-CN" ? "简体中文" : "English";
});

function toggleLanguage() {
  const next = currentLocale() === "zh-CN" ? "en" : "zh-CN";
  void setLocale(next);
}

function openGithub() {
  window.open("https://github.com/ones2three02/ONES-ZERO", "_blank");
}
</script>

<template>
  <div
    class="flex items-center h-12 px-4 border-b border-border/40 bg-background/60 backdrop-blur-md select-none transition-colors duration-300"
    data-tauri-drag-region
  >
    <!-- Left traffic light placeholder for Mac -->
    <div
      v-if="shouldReserveMacTrafficLightInset(isMac, false, isDesktop)"
      class="w-[72px] shrink-0"
      data-tauri-drag-region
    />

    <!-- Sidebar toggle button & Logo -->
    <div class="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8 hover:bg-muted/80 text-muted-foreground hover:text-foreground"
        @click="emit('toggle-sidebar')"
      >
        <Menu class="h-4 w-4" />
      </Button>
      <span class="text-sm font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary/85 bg-clip-text text-transparent flex items-center gap-1.5 select-none" data-tauri-drag-region>
        <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        ONES-ZERO
      </span>
    </div>

    <!-- Center Drag Area spacer -->
    <div class="flex-1 h-full" data-tauri-drag-region />

    <!-- Right-side actions -->
    <div class="flex items-center gap-1.5">
      <!-- Language toggle -->
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/80"
            @click="toggleLanguage"
          >
            <Languages class="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ currentLangLabel }}</TooltipContent>
      </Tooltip>

      <!-- Theme Mode Select -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/80"
          >
            <Sun v-if="themeMode === 'light'" class="h-4 w-4" />
            <Moon v-else-if="themeMode === 'dark'" class="h-4 w-4" />
            <SunMoon v-else class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="emit('set-theme-mode', 'light')">
            <Sun class="h-4 w-4 mr-2" /> {{ t('common.light') }}
          </DropdownMenuItem>
          <DropdownMenuItem @click="emit('set-theme-mode', 'dark')">
            <Moon class="h-4 w-4 mr-2" /> {{ t('common.dark') }}
          </DropdownMenuItem>
          <DropdownMenuItem @click="emit('set-theme-mode', 'system')">
            <SunMoon class="h-4 w-4 mr-2" /> {{ t('common.system') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Github inline SVG -->
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/80"
            @click="openGithub"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent>GitHub</TooltipContent>
      </Tooltip>

      <!-- Windows Native Window Controls -->
      <WindowControls
        v-if="showControls"
        :is-maximized="isMaximized"
        @minimize="minimize"
        @toggle-maximize="toggleMaximize"
        @close="close"
      />
    </div>
  </div>
</template>
