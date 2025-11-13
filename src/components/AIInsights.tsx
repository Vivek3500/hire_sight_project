import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { geminiService } from "@/services/geminiService";
import { useGeminiAPI } from "@/hooks/useGeminiAPI";
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Briefcase,
  Wrench,
  Users,
  MapPin,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

interface CareerInsights {
  growthOutlook: {
    trend: string;
    description: string;
  };
  salaryRanges: {
    min: number;
    avg: number;
    max: number;
    currency: string;
  };
  jobRoles: Array<{
    title: string;
    count: number;
  }>;
  technicalSkills: Array<{
    skill: string;
    importance: "High" | "Medium" | "Low";
  }>;
  softSkills: Array<{
    skill: string;
    importance: "High" | "Medium" | "Low";
  }>;
  topLocations: string[];
  marketDemand: string;
}

interface AIInsightsProps {
  careerField: string;
}

export const AIInsights = ({ careerField }: AIInsightsProps) => {
  const [insights, setInsights] = useState<CareerInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  const { isInitialized } = useGeminiAPI();

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getImportanceBadgeColor = (importance: "High" | "Medium" | "Low") => {
    switch (importance) {
      case "High":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "Low":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    }
  };

  const generateInsights = async () => {
    if (!isInitialized) {
      toast({
        title: "API Key Required",
        description: "Please configure your Gemini API key in Settings first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await geminiService.analyzeCareerField(careerField);
      setInsights(data);
      toast({
        title: "Success!",
        description: "AI insights generated successfully.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate insights";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold mb-2">AI Insights Not Configured</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure your Gemini API key to unlock AI-powered career insights.
              </p>
              <Button asChild>
                <Link to="/settings">Go to Settings</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights && !loading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 py-8">
            <Sparkles className="h-12 w-12 text-primary" />
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Generate AI Insights</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get real-time job market insights powered by Google Gemini AI
              </p>
              <Button onClick={generateInsights} size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate AI Insights
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Analyzing job market data with AI...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 py-8">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Error Generating Insights</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={generateInsights} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
        </div>
        <Button onClick={generateInsights} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Growth Outlook */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Growth Outlook
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="mb-3">{insights.growthOutlook.trend}</Badge>
            <p className="text-sm text-muted-foreground">
              {insights.growthOutlook.description}
            </p>
          </CardContent>
        </Card>

        {/* Salary Ranges */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Salary Ranges
            </CardTitle>
            <CardDescription>2-5 years experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Minimum:</span>
                <span className="font-semibold">{formatINR(insights.salaryRanges.min)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average:</span>
                <span className="font-semibold">{formatINR(insights.salaryRanges.avg)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Maximum:</span>
                <span className="font-semibold">{formatINR(insights.salaryRanges.max)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Roles */}
        <Card className="hover:shadow-lg transition-shadow md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Trending Job Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {insights.jobRoles.map((role, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="font-medium text-sm mb-1">{role.title}</div>
                  <div className="text-xs text-muted-foreground">
                    ~{role.count.toLocaleString()} openings
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Skills */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.technicalSkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={getImportanceBadgeColor(skill.importance)}
                >
                  {skill.skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Soft Skills */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Soft Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.softSkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={getImportanceBadgeColor(skill.importance)}
                >
                  {skill.skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Top Hiring Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.topLocations.map((location, index) => (
                <Badge key={index} variant="secondary">
                  {location}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Demand */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Market Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{insights.marketDemand}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
