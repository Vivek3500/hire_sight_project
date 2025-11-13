import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeminiAPI } from "@/hooks/useGeminiAPI";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Key, CheckCircle2, AlertCircle } from "lucide-react";

const Settings = () => {
  const { apiKey, isInitialized, saveApiKey, removeApiKey } = useGeminiAPI();
  const [inputKey, setInputKey] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!inputKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    const success = saveApiKey(inputKey.trim());
    if (success) {
      toast({
        title: "Success!",
        description: "Gemini API key saved successfully",
      });
      setInputKey("");
    } else {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  const handleRemove = () => {
    const success = removeApiKey();
    if (success) {
      toast({
        title: "Success!",
        description: "API key removed successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to remove API key",
        variant: "destructive",
      });
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••" + key.slice(-4);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-lg bg-gradient-hero">
            <SettingsIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your HireSight configuration</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Gemini API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Gemini API Configuration
              </CardTitle>
              <CardDescription>
                Configure your Google Gemini API key to unlock AI-powered career insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isInitialized ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">API Key Configured</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {maskApiKey(apiKey)}
                      </p>
                    </div>
                    <Button onClick={handleRemove} variant="destructive" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="Enter your Gemini API key"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card>
            <CardHeader>
              <CardTitle>How to Get Your API Key</CardTitle>
              <CardDescription>Follow these steps to obtain your free Gemini API key</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    1
                  </span>
                  <span>
                    Visit{" "}
                    <a
                      href="https://ai.google.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      https://ai.google.dev/
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    2
                  </span>
                  <span>Click "Get API Key" in the top navigation</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    3
                  </span>
                  <span>Sign in with your Google account</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    4
                  </span>
                  <span>Create a new API key or use an existing one</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    5
                  </span>
                  <span>Copy the API key and paste it above</span>
                </li>
              </ol>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Free Tier Limits</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Gemini API offers 60 requests per minute on the free tier, which is more than
                      enough for personal use.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
