"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import zoomSdk from "@zoom/appssdk";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

type EngagementStatusState = "start" | "hold" | "resume" | "end" | string;

type EngagementContextPayload = {
  engagementContext: {
    engagementId: string;
    queueName?: string;
  };
};

type EngagementStatusPayload = {
  engagementStatus: {
    state: EngagementStatusState;
  };
};

type FormData = {
  text: string;
  date: string;
  contactMethod: "email" | "phone" | "";
  interests: string[];
  range: number;
};

const DEFAULT_FORM: FormData = {
  text: "",
  date: "",
  contactMethod: "",
  interests: [],
  range: 50,
};

const isBrowser = typeof window !== "undefined";
const storageKey = (id: string) => `zcc-engagement:${id}`;

export default function Engagement() {
  const [engagementId, setEngagementId] = useState<string>("");
  const [engagementStatus, setEngagementStatus] = useState<EngagementStatusState>("");
  const [engagementContext, setEngagementContext] = useState<string>("");
  const [config, setConfig] = useState<any>(null);

  // Configure SDK once, then fetch initial context/status
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (typeof zoomSdk?.config !== "function") {
        console.warn("zoomSdk not available (are you outside the Zoom embedded browser?)");
        return;
      }

      const cfg = await zoomSdk.config({
        capabilities: [
          "shareApp",
          "getEngagementContext",
          "getEngagementStatus",
          "onEngagementContextChange",
          "onEngagementMediaRedirect",
          "onEngagementStatusChange",
          "onEngagementVariableValueChange",
        ],
      });

      if (cancelled) return;
      setConfig(cfg);

      const [ctx, status] = await Promise.all([
        zoomSdk.callZoomApi("getEngagementContext") as Promise<EngagementContextPayload>,
        zoomSdk.callZoomApi("getEngagementStatus") as Promise<EngagementStatusPayload>,
      ]);

      if (cancelled) return;
      setEngagementId(ctx?.engagementContext?.engagementId ?? "");
      setEngagementContext(ctx?.engagementContext?.queueName ?? "");
      setEngagementStatus(status?.engagementStatus?.state ?? "");
    };

    init().catch((e) => console.error("Zoom SDK init error:", e));
    return () => {
      cancelled = true;
    };
  }, []);

  // Local storage
  const initialForm = useMemo<FormData>(() => DEFAULT_FORM, []);
  const [formData, setFormData] = useState<FormData>(initialForm);

  const loadFromStorage = useCallback((id: string) => {
    if (!isBrowser || !id) return DEFAULT_FORM;
    try {
      const raw = localStorage.getItem(storageKey(id));
      if (!raw) return DEFAULT_FORM;
      const parsed = JSON.parse(raw) as Partial<FormData>;
      return {
        text: parsed.text ?? "",
        date: parsed.date ?? "",
        contactMethod: (parsed.contactMethod as FormData["contactMethod"]) ?? "",
        interests: Array.isArray(parsed.interests) ? parsed.interests : [],
        range: typeof parsed.range === "number" ? parsed.range : 50,
      } satisfies FormData;
    } catch {
      return DEFAULT_FORM;
    }
  }, []);

  const persistToStorage = useCallback(
    (id: string, patch: Partial<FormData>) => {
      if (!isBrowser || !id) return;
      try {
        const current = loadFromStorage(id);
        const next = { ...current, ...patch };
        localStorage.setItem(storageKey(id), JSON.stringify(next));
      } catch {
        // no-op
      }
    },
    [loadFromStorage]
  );

  const handleChange = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        if (engagementId) persistToStorage(engagementId, { [field]: value } as Partial<FormData>);
        return next;
      });
    },
    [engagementId, persistToStorage]
  );

  const handleCheckboxToggle = useCallback(
    (value: string, checked: boolean) => {
      setFormData((prev) => {
        const nextInterests = checked
          ? Array.from(new Set([...prev.interests, value]))
          : prev.interests.filter((v) => v !== value);
        const next = { ...prev, interests: nextInterests };
        if (engagementId) persistToStorage(engagementId, { interests: nextInterests });
        return next;
      });
    },
    [engagementId, persistToStorage]
  );

  // Reload saved form when engagement changes
  useEffect(() => {
    if (!engagementId) return;
    setFormData(loadFromStorage(engagementId));
  }, [engagementId, loadFromStorage]);

  // Event listeners (only after config is ready)
  useEffect(() => {
    if (!config || typeof zoomSdk?.addEventListener !== "function") return;

    const onContextChange = (event: EngagementContextPayload) => {
      try {
        setEngagementId(event?.engagementContext?.engagementId ?? "");
        setEngagementContext(event?.engagementContext?.queueName ?? "");
      } catch (err) {
        console.error("Error handling engagement context change:", err);
      }
    };

    const onStatusChange = (event: EngagementStatusPayload) => {
      try {
        const state = event?.engagementStatus?.state ?? "";
        setEngagementStatus(state);
        if (state === "end" && engagementId) {
          if (isBrowser) localStorage.removeItem(storageKey(engagementId));
          setFormData(DEFAULT_FORM);
        }
      } catch (err) {
        console.error("Error handling engagement status change:", err);
      }
    };

    zoomSdk.addEventListener("onEngagementContextChange", onContextChange);
    zoomSdk.addEventListener("onEngagementStatusChange", onStatusChange);

    return () => {
      zoomSdk.removeEventListener("onEngagementContextChange", onContextChange);
      zoomSdk.removeEventListener("onEngagementStatusChange", onStatusChange);
    };
  }, [config, engagementId]);

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">ZCC Engagement Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm grid gap-1">
          <div><strong>Engagement Id:</strong> {engagementId || "—"}</div>
          <div><strong>Engagement Status:</strong> {engagementStatus || "—"}</div>
          <div><strong>Engagement Context:</strong> {engagementContext || "—"}</div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="notes"><strong>Text</strong></Label>
            <Textarea
              id="notes"
              value={formData.text}
              onChange={(e) => handleChange("text", e.target.value)}
              className="min-h-48"
              placeholder="Type notes…"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date"><strong>Choose a Date</strong></Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-56"
            />
          </div>

          <div className="grid gap-2">
            <Label><strong>Preferred Contact Method</strong></Label>
            <RadioGroup
              value={formData.contactMethod}
              onValueChange={(v: "email" | "phone") => handleChange("contactMethod", v)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="contact-email" value="email" />
                <Label htmlFor="contact-email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="contact-phone" value="phone" />
                <Label htmlFor="contact-phone">Phone</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label><strong>Interests</strong></Label>
            <div className="flex flex-wrap gap-6">
              {["coding", "music", "sports"].map((opt) => {
                const checked = formData.interests.includes(opt);
                return (
                  <div key={opt} className="flex items-center space-x-2">
                    <Checkbox
                      id={`interest-${opt}`}
                      checked={checked}
                      onCheckedChange={(v) => handleCheckboxToggle(opt, Boolean(v))}
                    />
                    <Label htmlFor={`interest-${opt}`} className="capitalize">
                      {opt}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <Label><strong>Set a Range</strong> <span className="opacity-70">({formData.range})</span></Label>
            <Slider
              value={[formData.range]}
              min={1}
              max={100}
              step={1}
              onValueChange={(vals: number[]) => handleChange("range", vals[0] ?? 50)}
              className="max-w-md"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
