<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { invoke } from "@tauri-apps/api/core";
import { Users, CreditCard, Activity, CheckCircle2, Sparkles, Code2, Check, Info } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import PasswordInput from "@/components/ui/PasswordInput.vue";
import { useTheme } from "@/composables/useTheme";
import { currentLocale, setLocale } from "@/i18n";

// UI Kit state
const demoName = ref("croodslee");
const demoStatus = ref("active");
const demoRole = ref("Frontend Developer");
const demoNotify = ref(true);
const demoPassword = ref("secret12345");
const activeTab = ref("buttons");

const props = defineProps<{
  activePanel: string;
}>();

const { t } = useI18n();
const { themeMode, setThemeMode } = useTheme();

// Simple mock data for table
const users = ref([
  { id: 1, name: "Alice Zhang", role: "Frontend Developer", status: "active", date: "2026-06-01" },
  { id: 2, name: "Bob Li", role: "Rust Backend Engineer", status: "active", date: "2026-06-15" },
  { id: 3, name: "Charlie Wang", role: "UI/UX Designer", status: "inactive", date: "2026-05-20" },
  { id: 4, name: "David Zhao", role: "QA Engineer", status: "active", date: "2026-06-20" },
  { id: 5, name: "Eva Liu", role: "Product Manager", status: "inactive", date: "2026-04-10" },
]);

// Tauri greeting state
const greetName = ref("");
const greetMessage = ref("");
const appVersionInfo = ref<any>(null);

async function callGreet() {
  if (!greetName.value) return;
  try {
    greetMessage.value = await invoke<string>("greet", { name: greetName.value });
  } catch (err) {
    console.error(err);
  }
}

async function fetchAppInfo() {
  try {
    appVersionInfo.value = await invoke<any>("get_app_info");
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  fetchAppInfo();
});
</script>

<template>
  <div class="flex-1 h-full min-w-0 bg-background/20 backdrop-blur-sm overflow-y-auto p-6 transition-colors duration-300">
    <!-- 1. DASHBOARD PANEL -->
    <div v-if="activePanel === 'dashboard'" class="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-foreground">{{ t('dashboard.title') }}</h1>
        <p class="text-sm text-muted-foreground mt-1">{{ t('dashboard.subtitle') }}</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <!-- Card 1 -->
        <div class="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between transition-all hover:border-primary/30">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-muted-foreground tracking-wider uppercase">{{ t('dashboard.stats.users') }}</span>
            <Users class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="mt-4">
            <h2 class="text-2xl font-bold tracking-tight text-foreground">1,248</h2>
            <p class="text-xs text-green-500 font-medium mt-1">+12% from last week</p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between transition-all hover:border-primary/30">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-muted-foreground tracking-wider uppercase">{{ t('dashboard.stats.sales') }}</span>
            <CreditCard class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="mt-4">
            <h2 class="text-2xl font-bold tracking-tight text-foreground">$12,450</h2>
            <p class="text-xs text-green-500 font-medium mt-1">+8.2% from yesterday</p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between transition-all hover:border-primary/30">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-muted-foreground tracking-wider uppercase">{{ t('dashboard.stats.performance') }}</span>
            <Activity class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="mt-4">
            <h2 class="text-2xl font-bold tracking-tight text-foreground">98.4%</h2>
            <p class="text-xs text-muted-foreground mt-1">Average CPU load: 4.2%</p>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between transition-all hover:border-primary/30">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-muted-foreground tracking-wider uppercase">{{ t('dashboard.stats.tasks') }}</span>
            <CheckCircle2 class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="mt-4">
            <h2 class="text-2xl font-bold tracking-tight text-foreground">34 / 45</h2>
            <p class="text-xs text-green-500 font-medium mt-1">11 tasks remaining</p>
          </div>
        </div>
      </div>

      <!-- Tauri RPC Communication Showcase Card -->
      <div class="rounded-xl border border-border/40 bg-card/50 backdrop-blur-md p-6 shadow-sm">
        <h3 class="text-lg font-bold tracking-tight text-foreground mb-2">Tauri RPC (Rust commands) 通信演示</h3>
        <p class="text-xs text-muted-foreground mb-4">
          您可以在下方输入您的姓名，点击发送。前端会通过 <code>invoke("greet")</code> 指令异步调用 Tauri 的 Rust 后端处理函数并返回欢迎词。
        </p>
        <div class="flex max-w-md items-center gap-2">
          <Input v-model="greetName" placeholder="输入您的姓名" class="h-9" @keydown.enter="callGreet" />
          <Button size="sm" class="h-9" @click="callGreet">调用 Rust</Button>
        </div>
        <div v-if="greetMessage" class="mt-4 p-3 bg-muted/40 rounded-lg text-xs font-medium text-foreground border border-border/25">
          {{ greetMessage }}
        </div>
      </div>
    </div>

    <!-- 2. TABLE PANEL -->
    <div v-else-if="activePanel === 'table'" class="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-foreground">通用数据表格</h1>
        <p class="text-sm text-muted-foreground mt-1">一个由 Tailwind CSS v4 渲染的高质感响应式数据表格。</p>
      </div>

      <div class="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-border/40 bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th class="py-3 px-4">ID</th>
                <th class="py-3 px-4">姓名</th>
                <th class="py-3 px-4">职责 / 角色</th>
                <th class="py-3 px-4">状态</th>
                <th class="py-3 px-4">加入日期</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/20 text-sm text-foreground">
              <tr v-for="user in users" :key="user.id" class="hover:bg-muted/10 transition-colors">
                <td class="py-3.5 px-4 font-mono text-muted-foreground text-xs">{{ user.id }}</td>
                <td class="py-3.5 px-4 font-medium">{{ user.name }}</td>
                <td class="py-3.5 px-4 text-muted-foreground text-xs">{{ user.role }}</td>
                <td class="py-3.5 px-4">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="user.status === 'active' 
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                      : 'bg-muted text-muted-foreground border border-border/40'"
                  >
                    {{ user.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-muted-foreground text-xs">{{ user.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 3. COMPONENTS SHOWCASE PANEL -->
    <div v-else-if="activePanel === 'components'" class="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles class="h-5 w-5 text-primary animate-pulse" />
          {{ t('common.components') }}
        </h1>
        <p class="text-sm text-muted-foreground mt-1">这里集成了脚手架内置的 Shadcn UI 原子组件，提供统一的设计风格、交互状态与多语言支持。</p>
      </div>

      <!-- Interactive Playground -->
      <div class="grid gap-6 md:grid-cols-3">
        <!-- Interactive Controls -->
        <div class="md:col-span-1 rounded-xl border border-border/40 bg-card/60 backdrop-blur-md p-5 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-foreground flex items-center gap-1.5 border-b border-border/20 pb-2">
            <Code2 class="h-4 w-4 text-primary" /> 属性控制器
          </h3>
          <div class="space-y-3.5">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-muted-foreground">显示姓名</label>
              <Input v-model="demoName" placeholder="输入姓名..." class="h-8 text-xs" />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-muted-foreground">身份角色</label>
              <Select v-model="demoRole">
                <SelectTrigger class="h-8 text-xs">
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                  <SelectItem value="Rust Backend Engineer">Rust Backend Engineer</SelectItem>
                  <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-muted-foreground">用户状态</label>
              <Select v-model="demoStatus">
                <SelectTrigger class="h-8 text-xs">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (在线)</SelectItem>
                  <SelectItem value="inactive">Inactive (离线)</SelectItem>
                  <SelectItem value="banned">Banned (封禁)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex items-center justify-between border-t border-border/10 pt-3">
              <span class="text-xs font-semibold text-muted-foreground">启用系统通知</span>
              <Switch v-model:checked="demoNotify" />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-muted-foreground">演示安全密钥</label>
              <PasswordInput v-model="demoPassword" placeholder="输入密钥..." class="w-full" input-class="h-8 text-xs" />
            </div>
          </div>
        </div>

        <!-- Live Preview Card -->
        <div class="md:col-span-2 rounded-xl border border-border/40 bg-gradient-to-br from-card/85 via-card/70 to-muted/20 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <!-- Ambient decorative light glow -->
          <div class="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          
          <div class="space-y-4 z-10">
            <h3 class="text-xs font-bold tracking-widest text-muted-foreground uppercase">实时效果预览</h3>
            
            <div class="flex items-start gap-4">
              <!-- Avatar -->
              <div class="h-12 w-12 rounded-full bg-gradient-to-tr from-primary to-primary/40 flex items-center justify-center text-primary-foreground font-bold text-lg border border-background/50 shadow-md">
                {{ demoName ? demoName.charAt(0).toUpperCase() : '?' }}
              </div>
              
              <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="text-lg font-bold text-foreground leading-none">{{ demoName || '未命名' }}</h4>
                  <Badge :variant="demoStatus === 'active' ? 'default' : demoStatus === 'inactive' ? 'secondary' : 'destructive'">
                    {{ demoStatus.toUpperCase() }}
                  </Badge>
                </div>
                <p class="text-xs text-muted-foreground">{{ demoRole }}</p>
              </div>
            </div>

            <div class="border-t border-border/20 pt-4 space-y-2 text-xs">
              <div class="flex justify-between py-1 border-b border-border/10">
                <span class="text-muted-foreground">推送状态</span>
                <span class="font-medium text-foreground flex items-center gap-1">
                  <span class="h-1.5 w-1.5 rounded-full" :class="demoNotify ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'" />
                  {{ demoNotify ? 'Enabled (已开启)' : 'Disabled (已关闭)' }}
                </span>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-muted-foreground">解密密钥</span>
                <span class="font-mono font-medium text-foreground">{{ demoPassword || '(空)' }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-2 justify-end mt-6 border-t border-border/20 pt-4 z-10">
            <Button variant="outline" size="sm" @click="demoName = 'croodslee'; demoRole = 'Frontend Developer'; demoStatus = 'active'; demoNotify = true; demoPassword = 'secret12345'">
              重置配置
            </Button>
            <Button size="sm" class="gap-1.5">
              <Check class="h-3.5 w-3.5" /> 保存配置
            </Button>
          </div>
        </div>
      </div>

      <!-- Component Showcase Tabs -->
      <div class="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-sm">
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-4 max-w-md h-9">
            <TabsTrigger value="buttons" class="text-xs">按钮与徽章</TabsTrigger>
            <TabsTrigger value="forms" class="text-xs">表单与输入</TabsTrigger>
            <TabsTrigger value="overlays" class="text-xs">弹窗与反馈</TabsTrigger>
            <TabsTrigger value="advanced" class="text-xs">高级组件</TabsTrigger>
          </TabsList>

          <!-- Buttons & Badges -->
          <TabsContent value="buttons" class="mt-4 space-y-6">
            <div class="space-y-4">
              <h4 class="text-sm font-bold text-foreground">按钮样式变体 (Button Variants)</h4>
              <div class="flex flex-wrap gap-2.5">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link Style</Button>
              </div>
            </div>

            <div class="space-y-4 border-t border-border/10 pt-4">
              <h4 class="text-sm font-bold text-foreground">按钮尺寸 (Button Sizes)</h4>
              <div class="flex flex-wrap items-center gap-2.5">
                <Button size="lg">Large (lg)</Button>
                <Button size="default">Default</Button>
                <Button size="sm">Small (sm)</Button>
                <Button size="xs">Extra Small (xs)</Button>
              </div>
            </div>

            <div class="space-y-4 border-t border-border/10 pt-4">
              <h4 class="text-sm font-bold text-foreground">徽章样式 (Badge Variants)</h4>
              <div class="flex flex-wrap gap-2.5">
                <Badge variant="default">Default Badge</Badge>
                <Badge variant="secondary">Secondary Badge</Badge>
                <Badge variant="outline">Outline Badge</Badge>
                <Badge variant="destructive">Destructive Badge</Badge>
              </div>
            </div>
          </TabsContent>

          <!-- Forms -->
          <TabsContent value="forms" class="mt-4 space-y-6">
            <div class="grid gap-6 md:grid-cols-2">
              <div class="space-y-4">
                <h4 class="text-sm font-bold text-foreground">常规输入框 (Input)</h4>
                <div class="space-y-3">
                  <div class="space-y-1">
                    <label class="text-xs text-muted-foreground">普通文本</label>
                    <Input placeholder="请输入用户名..." />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-muted-foreground">只读输入框</label>
                    <Input value="ONES-ZERO scaffold template" readonly />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-muted-foreground">禁用输入框</label>
                    <Input placeholder="此输入框已禁用" disabled />
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-sm font-bold text-foreground">安全与交互组件</h4>
                <div class="space-y-4">
                  <div class="space-y-1">
                    <label class="text-xs text-muted-foreground">密码输入框 (带眼睛切换)</label>
                    <PasswordInput placeholder="请输入密码" />
                  </div>
                  
                  <div class="space-y-1.5">
                    <label class="text-xs text-muted-foreground">开关按钮 (Switch)</label>
                    <div class="flex flex-col gap-2 pt-1">
                      <div class="flex items-center gap-2">
                        <Switch id="sw-default" size="default" />
                        <label for="sw-default" class="text-xs text-foreground cursor-pointer">Default Size Switch</label>
                      </div>
                      <div class="flex items-center gap-2">
                        <Switch id="sw-sm" size="sm" />
                        <label for="sw-sm" class="text-xs text-foreground cursor-pointer">Small Size Switch (sm)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- Overlays & Feedback -->
          <TabsContent value="overlays" class="mt-4 space-y-6">
            <div class="flex flex-wrap gap-3">
              <!-- Dialog Modal -->
              <Dialog>
                <DialogTrigger as-child>
                  <Button variant="outline">触发模态框 (Dialog)</Button>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>组件库弹窗演示</DialogTitle>
                    <DialogDescription>
                      这是一个精心打磨的毛玻璃背景模态框。它完美响应亮暗主题，并且能够优雅地呈现在屏幕中央。
                    </DialogDescription>
                  </DialogHeader>
                  <div class="py-4 space-y-3">
                    <p class="text-xs text-muted-foreground">您可以在这里放置表单或任何需要用户进行二次确认/阅读的交互逻辑。</p>
                    <Input placeholder="输入临时消息进行测试" />
                  </div>
                  <DialogFooter>
                    <DialogClose as-child>
                      <Button variant="outline" size="sm">取消</Button>
                    </DialogClose>
                    <Button size="sm">确认保存</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <!-- Drawer/Sheet -->
              <Sheet>
                <SheetTrigger as-child>
                  <Button variant="outline">触发侧边栏抽屉 (Sheet)</Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>右侧抽屉面板</SheetTitle>
                    <SheetDescription>
                      通过改变 <code>side</code> 属性，可以使抽屉从上、下、左、右各个方向滑出。
                    </SheetDescription>
                  </SheetHeader>
                  <div class="py-6 space-y-4 flex-1">
                    <p class="text-xs text-muted-foreground">抽屉通常用来显示辅助操作面板、详细的系统日志或用于创建对象的长表单。</p>
                    <div class="rounded-lg border border-border/40 p-4 bg-muted/20 space-y-2">
                      <div class="text-xs font-bold text-foreground">使用场景提示：</div>
                      <div class="text-[11px] text-muted-foreground">1. 单表单填写较长时</div>
                      <div class="text-[11px] text-muted-foreground">2. 侧边展示列表项的详情对比时</div>
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose as-child>
                      <Button class="w-full" variant="outline">关闭面板</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <!-- Popover -->
              <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline">触发气泡卡片 (Popover)</Button>
                </PopoverTrigger>
                <PopoverContent class="w-80">
                  <div class="grid gap-4">
                    <div class="space-y-2">
                      <h4 class="font-medium leading-none text-sm text-foreground">快速卡片提示</h4>
                      <p class="text-xs text-muted-foreground font-normal leading-relaxed">
                        气泡卡片一般用于快捷展示丰富的说明或配置入口，不影响当前的页面浏览状态。
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </TabsContent>

          <!-- Advanced -->
          <TabsContent value="advanced" class="mt-4 space-y-4">
            <div class="rounded-lg border border-border/30 p-4 bg-muted/5 max-w-md space-y-4">
              <h4 class="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Info class="h-3.5 w-3.5 text-primary" /> 高级数据过滤与选项
              </h4>
              <p class="text-xs text-muted-foreground">
                这里演示了系统内部提供的选项检索能力，可以在复杂表格和长列表中快速进行筛选交互。
              </p>
              
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-muted-foreground">演示数据源 (单选过滤)</label>
                <Select>
                  <SelectTrigger class="w-full text-xs">
                    <SelectValue placeholder="检索成员..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">Alice Zhang (Frontend Developer)</SelectItem>
                    <SelectItem value="bob">Bob Li (Rust Backend Engineer)</SelectItem>
                    <SelectItem value="charlie">Charlie Wang (UI/UX Designer)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>

    <!-- 4. SETTINGS PANEL -->
    <div v-else-if="activePanel === 'settings'" class="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-foreground">{{ t('settings.title') }}</h1>
        <p class="text-sm text-muted-foreground mt-1">在此管理您的个性化脚手架及通用选项配置。</p>
      </div>

      <div class="grid gap-6 max-w-2xl">
        <!-- Appearance Settings -->
        <div class="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-sm space-y-4">
          <h3 class="text-lg font-bold tracking-tight text-foreground">{{ t('settings.appearance') }}</h3>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/20 pt-4">
            <div>
              <p class="text-sm font-semibold text-foreground">{{ t('settings.themeSelect') }}</p>
              <p class="text-xs text-muted-foreground">更改应用程序的整体亮暗呈现样式。</p>
            </div>
            <Select :model-value="themeMode" @update:model-value="(val) => setThemeMode(val as any)">
              <SelectTrigger class="w-[160px]">
                <SelectValue placeholder="选择主题" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{{ t('common.light') }}</SelectItem>
                <SelectItem value="dark">{{ t('common.dark') }}</SelectItem>
                <SelectItem value="system">{{ t('common.system') }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/20 pt-4">
            <div>
              <p class="text-sm font-semibold text-foreground">{{ t('settings.languageSelect') }}</p>
              <p class="text-xs text-muted-foreground">更改系统界面的多语言国家化配置词条。</p>
            </div>
            <Select :model-value="currentLocale()" @update:model-value="(v) => setLocale(v as any)">
              <SelectTrigger class="w-[160px]">
                <SelectValue placeholder="选择语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh-CN">简体中文</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- System info -->
        <div class="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md p-6 shadow-sm space-y-4">
          <h3 class="text-lg font-bold tracking-tight text-foreground">系统关于信息</h3>
          <div class="border-t border-border/20 pt-4 space-y-2 text-xs font-mono">
            <div class="flex justify-between py-1 border-b border-border/10">
              <span class="text-muted-foreground">脚手架名称</span>
              <span class="font-medium text-foreground">{{ appVersionInfo?.name || 'ONES-ZERO' }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-border/10">
              <span class="text-muted-foreground">当前运行版本</span>
              <span class="font-medium text-foreground">v{{ appVersionInfo?.version || '1.0.0' }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-muted-foreground">描述信息</span>
              <span class="font-medium text-foreground text-right max-w-sm">{{ appVersionInfo?.description || 'A beautiful template framework' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
