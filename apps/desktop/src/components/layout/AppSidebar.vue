<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { LayoutDashboard, Table, Box, Settings, ChevronsLeft, ExternalLink } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const props = defineProps<{
  sidebarWidth: number;
  activePanel: string;
}>();

const emit = defineEmits<{
  "update:activePanel": [value: string];
  startResize: [event: MouseEvent];
  collapse: [];
}>();

const { t } = useI18n();

// Group 1: Core Views
const coreViews = computed(() => [
  { id: "dashboard", label: t("common.dashboard"), icon: LayoutDashboard },
  { id: "table", label: "通用表格", icon: Table },
  { id: "components", label: t("common.components"), icon: Box },
]);

// Group 2: System Management
const systemViews = computed(() => [
  { id: "settings", label: t("common.settings"), icon: Settings },
]);

function openProfileDoc() {
  window.open("https://github.com/ones2three02", "_blank");
}
</script>

<template>
  <div
    class="h-full shrink-0 relative select-none border-r border-border/40 bg-background/30 backdrop-blur-md flex flex-col justify-between transition-colors duration-300"
    :style="{ width: sidebarWidth + 'px' }"
  >
    <div class="flex-1 flex flex-col min-h-0">
      <!-- Sidebar Header -->
      <div class="h-10 px-4 flex items-center justify-between border-b border-border/30 bg-muted/5">
        <span class="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">工作台导航</span>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" class="h-6 w-6 text-muted-foreground/75 hover:text-foreground hover:bg-muted/80" @click="emit('collapse')">
              <ChevronsLeft class="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>收起侧边栏</TooltipContent>
        </Tooltip>
      </div>

      <!-- Navigation groups -->
      <div class="flex-1 overflow-y-auto p-3 space-y-6">
        <!-- Group 1: Core Views -->
        <div class="space-y-1.5">
          <div class="px-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
            {{ t("sidebar.groupViews") }}
          </div>
          <div class="space-y-0.5">
            <button
              v-for="item in coreViews"
              :key="item.id"
              class="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 group relative border border-transparent"
              :class="activePanel === item.id
                ? 'bg-primary/[0.06] text-primary border-primary/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'"
              @click="emit('update:activePanel', item.id)"
            >
              <!-- Glass active left-indicator bar -->
              <span
                v-if="activePanel === item.id"
                class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-primary"
              />
              <component :is="item.icon" class="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <span class="truncate">{{ item.label }}</span>
            </button>
          </div>
        </div>

        <!-- Group 2: System Settings -->
        <div class="space-y-1.5">
          <div class="px-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
            {{ t("sidebar.groupSystem") }}
          </div>
          <div class="space-y-0.5">
            <button
              v-for="item in systemViews"
              :key="item.id"
              class="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 group relative border border-transparent"
              :class="activePanel === item.id
                ? 'bg-primary/[0.06] text-primary border-primary/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'"
              @click="emit('update:activePanel', item.id)"
            >
              <span
                v-if="activePanel === item.id"
                class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-primary"
              />
              <component :is="item.icon" class="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <span class="truncate">{{ item.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Profile Footer Card -->
    <div class="p-3 border-t border-border/30 bg-muted/5">
      <div
        class="flex items-center gap-2.5 p-2 rounded-lg border border-border/20 bg-background/50 hover:bg-background/80 hover:border-primary/20 transition-all duration-300 cursor-pointer group"
        @click="openProfileDoc"
      >
        <!-- Circle gradient avatar -->
        <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary/40 flex items-center justify-center text-primary-foreground font-semibold text-xs border border-background shadow-inner shrink-0 group-hover:rotate-6 transition-transform duration-300">
          C
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-foreground truncate">croodslee</p>
          <div class="flex items-center gap-1 mt-0.5">
            <span class="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span class="text-[9px] font-medium text-muted-foreground tracking-wider uppercase">{{ t("sidebar.userStatus") }}</span>
          </div>
        </div>
        <ExternalLink class="h-3.5 w-3.5 text-muted-foreground/45 group-hover:text-foreground/80 group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
      </div>
    </div>

    <!-- Drag Handle -->
    <div class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors duration-200" @mousedown="emit('startResize', $event)" />
  </div>
</template>
