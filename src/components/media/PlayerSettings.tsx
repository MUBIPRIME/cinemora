import { Gauge, Captions, Languages, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const SPEEDS = ["0.5", "0.75", "1", "1.25", "1.5", "2"] as const;
export const SUBTITLES = [
  { id: "off", label: "Off" },
  { id: "en", label: "English" },
  { id: "es", label: "Spanish" },
  { id: "fr", label: "French" },
];
export const AUDIO_TRACKS = [
  { id: "en", label: "English (Original)" },
  { id: "es", label: "Spanish (Dubbed)" },
  { id: "fr", label: "French (Dubbed)" },
];
export const QUALITIES = [
  { id: "auto", label: "Auto" },
  { id: "1080", label: "1080p Full HD" },
  { id: "720", label: "720p HD" },
  { id: "480", label: "480p" },
];

function Menu({ icon, title, value, options, onChange, summary }: { icon: React.ReactNode; title: string; value: string; options: { id: string; label: string }[]; onChange: (v: string) => void; summary: string }) {
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="glass" size="sm" aria-label={`${title}: ${summary}`}>{icon}<span className="hidden sm:inline">{title}</span><span className="text-muted-foreground">{summary}</span></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-56">
      <DropdownMenuLabel>{title}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
        {options.map(o => <DropdownMenuRadioItem key={o.id} value={o.id}>{o.label}</DropdownMenuRadioItem>)}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>;
}

export type PlayerPrefs = { speed: string; subtitle: string; audio: string; quality: string };

export function PlayerSettings({ prefs, onChange }: { prefs: PlayerPrefs; onChange: (p: Partial<PlayerPrefs>) => void }) {
  const sub = SUBTITLES.find(s => s.id === prefs.subtitle)!;
  const audio = AUDIO_TRACKS.find(a => a.id === prefs.audio)!;
  const quality = QUALITIES.find(q => q.id === prefs.quality)!;
  return <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Playback settings">
    <Menu icon={<Gauge />} title="Speed" value={prefs.speed} summary={`${prefs.speed}x`} options={SPEEDS.map(s => ({ id: s, label: `${s}x${s === "1" ? " (Normal)" : ""}` }))} onChange={v => onChange({ speed: v })} />
    <Menu icon={<Captions />} title="Subtitles" value={prefs.subtitle} summary={sub.label} options={SUBTITLES} onChange={v => onChange({ subtitle: v })} />
    <Menu icon={<Languages />} title="Audio" value={prefs.audio} summary={audio.label.split(" ")[0]!} options={AUDIO_TRACKS} onChange={v => onChange({ audio: v })} />
    <Menu icon={<MonitorPlay />} title="Quality" value={prefs.quality} summary={quality.label.split(" ")[0]!} options={QUALITIES} onChange={v => onChange({ quality: v })} />
  </div>;
}
