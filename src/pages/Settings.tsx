import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";

export default function Settings() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const [notifs, setNotifs] = useState({
    taskAssigned: true,
    comments: true,
    mentions: true,
    deadlines: true,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({ profileVisible: true, activityVisible: true, dataSharing: false });
  const [accessibility, setAccessibility] = useState({ reduceMotion: false, highContrast: false, largerText: false });

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your workspace preferences and account settings.</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Basic workspace configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Workspace name</Label>
                <Input defaultValue="Loom Inc." />
              </div>
              <div className="space-y-1.5">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger className="sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                    <SelectItem value="ist">India Standard Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how Loom looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "rounded-xl border-2 p-3 text-center text-sm font-medium capitalize transition-colors",
                      theme === t ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400" : "border-border hover:bg-muted"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose which notifications you'd like to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "taskAssigned", label: "Task assigned", desc: "When you're assigned to a task" },
                { key: "comments", label: "Comments", desc: "When someone comments on your task" },
                { key: "mentions", label: "Mentions", desc: "When someone @mentions you" },
                { key: "deadlines", label: "Deadline reminders", desc: "Reminders before due dates" },
                { key: "marketing", label: "Product updates", desc: "News about new features" },
              ].map((item, i, arr) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifs[item.key as keyof typeof notifs]}
                      onCheckedChange={(v) => setNotifs((prev) => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                  {i < arr.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Control your visibility and data sharing preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "profileVisible", label: "Public profile", desc: "Allow teammates to view your profile" },
                { key: "activityVisible", label: "Activity visibility", desc: "Show your activity in team feeds" },
                { key: "dataSharing", label: "Usage analytics", desc: "Help us improve by sharing anonymous usage data" },
              ].map((item, i, arr) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={privacy[item.key as keyof typeof privacy]}
                      onCheckedChange={(v) => setPrivacy((prev) => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                  {i < arr.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>Adjust Loom to suit your needs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "reduceMotion", label: "Reduce motion", desc: "Minimize animations across the app" },
                { key: "highContrast", label: "High contrast", desc: "Increase color contrast for readability" },
                { key: "largerText", label: "Larger text", desc: "Increase default font size" },
              ].map((item, i, arr) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={accessibility[item.key as keyof typeof accessibility]}
                      onCheckedChange={(v) => setAccessibility((prev) => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                  {i < arr.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
