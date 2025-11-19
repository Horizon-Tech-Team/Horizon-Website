"use client";

import { getAppSettings, updateAppSettings } from "@/app/actions/actions";
import LoadingLogo from "@/components/loading-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FeatureFlag = {
  key: string;
  value: boolean;
  description?: string;
};

export default function AdminSettingsPage() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [initialFlags, setInitialFlags] = useState<FeatureFlag[]>([]);
  const [changed, setChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const res = await getAppSettings();
      if (res.success) {
        setFeatureFlags(res.data);
        setInitialFlags(res.data);
      } else {
        toast(res.error || "Failed to load settings");
      }
      setIsLoading(false);
    };
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  // Detect changes
  useEffect(() => {
    const hasChanges =
      featureFlags.length > 0 &&
      featureFlags.some((flag, idx) => flag.value !== initialFlags[idx]?.value);
    setChanged(hasChanges);
  }, [featureFlags, initialFlags]);

  const handleToggle = (idx: number, newValue: boolean) => {
    setFeatureFlags((prev) =>
      prev.map((flag, i) => (i === idx ? { ...flag, value: newValue } : flag))
    );
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);

    const res = await updateAppSettings(featureFlags);
    if (res.success) {
      toast("All feature flag settings have been updated successfully.");
      setInitialFlags(featureFlags); // update initial
      setChanged(false);
    } else {
      toast(res.error || "Failed to save feature flags");
    }

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">PR Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Monitor and manage College Leader performance across all events
          </p>
        </div>
        <Button onClick={handleSaveChanges} disabled={!changed || isLoading}>
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Feature Flags</CardTitle>
            <CardDescription>
              Enable or disable experimental or optional system features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <LoadingLogo />
            ) : (
              <>
                {featureFlags.map((flag, idx) => (
                  <div
                    key={flag.key}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{flag.key}</p>
                      <p className="text-sm text-muted-foreground">
                        {flag.description}
                      </p>
                    </div>
                    <Switch
                      checked={flag.value}
                      onCheckedChange={(val) => handleToggle(idx, val)}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
