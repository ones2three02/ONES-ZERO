<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppToolbar from "@/components/layout/AppToolbar.vue";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import ContentArea from "@/components/layout/ContentArea.vue";
import { useTheme } from "@/composables/useTheme";
import { useToast } from "@/composables/useToast";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/safeStorage";

const { isDark, themeMode, applyTheme, setThemeMode } = useTheme();
const { message: toastMessage, visible: toastVisible } = useToast();

const activePanel = ref(safeLocalStorageGet("ones-zero-active-panel") || "dashboard");
const sidebarOpen = ref(safeLocalStorageGet("ones-zero-sidebar-open") !== "false");
const sidebarWidth = ref(Number(safeLocalStorageGet("ones-zero-sidebar-width")) || 240);

const displaySidebarWidth = computed(() => {
  return sidebarOpen.value ? sidebarWidth.value : 0;
});

function handleSetThemeMode(mode: "light" | "dark" | "system") {
  setThemeMode(mode);
}

function handleActivePanelUpdate(val: string) {
  activePanel.value = val;
  safeLocalStorageSet("ones-zero-active-panel", val);
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
  safeLocalStorageSet("ones-zero-sidebar-open", String(sidebarOpen.value));
}

function startSidebarResize(e: MouseEvent) {
  e.preventDefault();
  const startX = e.clientX;
  const startWidth = sidebarWidth.value;

  const onMouseMove = (moveEvent: MouseEvent) => {
    const newWidth = Math.max(160, Math.min(480, startWidth + (moveEvent.clientX - startX)));
    sidebarWidth.value = newWidth;
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    safeLocalStorageSet("ones-zero-sidebar-width", String(sidebarWidth.value));
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

onMounted(() => {
  applyTheme();
});
</script>

<template>
  <div class="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground transition-colors duration-300 font-sans">
    <TooltipProvider>
      <!-- Top Header Toolbar -->
      <AppToolbar
        :is-dark="isDark"
        :theme-mode="themeMode"
        @set-theme-mode="handleSetThemeMode"
        @toggle-sidebar="toggleSidebar"
      />

      <!-- Main Workspace -->
      <div class="flex-1 flex min-h-0 overflow-hidden relative">
        <!-- Sidebar Navigation -->
        <AppSidebar
          v-show="sidebarOpen"
          :sidebar-width="displaySidebarWidth"
          :active-panel="activePanel"
          @update:active-panel="handleActivePanelUpdate"
          @start-resize="startSidebarResize"
          @collapse="toggleSidebar"
        />

        <!-- Content Page Area -->
        <ContentArea :active-panel="activePanel" />
      </div>

      <!-- App Global Toast Notification -->
      <Teleport to="body">
        <Transition name="toast">
          <div
            v-if="toastVisible"
            class="fixed bottom-6 inset-x-0 w-max max-w-[90vw] sm:max-w-3xl mx-auto z-99999 px-4 py-2 rounded-lg bg-foreground text-background text-sm shadow-lg select-text whitespace-pre-wrap break-words"
          >
            {{ toastMessage }}
          </div>
        </Transition>
      </Teleport>
    </TooltipProvider>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: 0.25s ease;
  transition-property: transform, opacity;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(100%) scale(0.95);
}
</style>
