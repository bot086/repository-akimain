"use client";

import { useState, useEffect, useRef } from "react";
import { getAllProjects, resolveMediaUrl, Portrait } from "@/lib/api";
import type { Project } from "@/lib/api";

// All API calls go to Next.js internal routes — same origin, no backend needed
const API = "";

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function authFetch(url: string, options: RequestInit, secret: string) {
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${secret}`,
    },
  });
}

// ─── Video slot definitions ───────────────────────────────────────────────────
const VIDEO_SLOTS = [
  { label: "Reel 1",         prefix: "reel_01", type: "reel" as const },
  { label: "Reel 2",         prefix: "reel_02", type: "reel" as const },
  { label: "Reel 3",         prefix: "reel_03", type: "reel" as const },
  { label: "Reel 4",         prefix: "reel_04", type: "reel" as const },
  { label: "Reel 5",         prefix: "reel_05", type: "reel" as const },
  { label: "Reel 6",         prefix: "reel_06", type: "reel" as const },
  { label: "Wedding Film 1", prefix: "wf_01",   type: "wf"   as const },
  { label: "Wedding Film 2", prefix: "wf_02",   type: "wf"   as const },
  { label: "Wedding Film 3", prefix: "wf_03",   type: "wf"   as const },
  { label: "Wedding Film 4", prefix: "wf_04",   type: "wf"   as const },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "projects" | "photos" | "videos" | "portraits";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard({ secret, onLogout }: { secret: string; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [portraits, setPortraits] = useState<Portrait[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [p, por] = await Promise.all([
        getAllProjects(),
        fetch(`/api/portraits`).then(r => r.json()),
      ]);
      setProjects(p);
      setPortraits(por);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-ink bg-cream-soft">Loading...</div>;

  const tabs: { id: Tab; label: string }[] = [
    { id: "projects", label: "Projects" },
    { id: "photos",   label: "Upload Photos" },
    { id: "videos",   label: "Add Videos" },
    { id: "portraits",label: "Hero Portraits" },
  ];

  return (
    <div className="min-h-screen bg-cream-soft text-ink font-sans">
      {/* Header */}
      <div className="border-b border-ink/10 bg-white/60 backdrop-blur-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold font-serif">Admin Dashboard</h1>
          <p className="text-xs text-ink/50 mt-0.5">Akshay Vastrad Media House</p>
        </div>
        <button onClick={onLogout} className="text-xs text-red-500 hover:underline">Logout</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 border-b border-ink/10 bg-white/40 backdrop-blur-sm">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-xs tracking-widest uppercase font-medium rounded-t-lg transition-all ${
              activeTab === tab.id ? "bg-ink text-cream" : "text-ink/50 hover:text-ink"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto p-6">
        {activeTab === "projects"  && <ProjectsTab  projects={projects}  secret={secret} onRefresh={fetchAll} />}
        {activeTab === "photos"    && <PhotosTab    projects={projects}  secret={secret} onRefresh={fetchAll} />}
        {activeTab === "videos"    && <VideosTab    projects={projects}  secret={secret} onRefresh={fetchAll} />}
        {activeTab === "portraits" && <PortraitsTab portraits={portraits} secret={secret} onRefresh={fetchAll} />}
      </div>
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────
function ProjectsTab({ projects, secret, onRefresh }: { projects: Project[]; secret: string; onRefresh: () => void }) {
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    await authFetch(`${API}/api/admin/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, display_order: 0 }),
    }, secret);
    setTitle("");
    setCreating(false);
    onRefresh();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project and all its media?")) return;
    await authFetch(`${API}/api/admin/projects/${id}`, { method: "DELETE" }, secret);
    onRefresh();
  };

  const deleteMedia = async (mediaId: string) => {
    if (!confirm("Delete this media item?")) return;
    await authFetch(`${API}/api/admin/media/${mediaId}`, { method: "DELETE" }, secret);
    onRefresh();
  };

  const editMedia = async (mediaId: string, currentAlt: string | null) => {
    const newAlt = window.prompt("Enter new caption/alt text:", currentAlt || "");
    if (newAlt === null) return;
    await authFetch(`${API}/api/admin/media/${mediaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt_text: newAlt }),
    }, secret);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="flex gap-3">
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="New project title..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-ink/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold" />
        <button disabled={creating || !title.trim()} className="px-6 py-2.5 bg-ink text-cream rounded-xl text-sm disabled:opacity-50 hover:bg-ink-soft transition">
          {creating ? "Adding..." : "Add Project"}
        </button>
      </form>

      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="bg-white/70 p-5 rounded-xl border border-ink/5 group hover:border-gold/30 transition shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-bold text-lg">{p.title}</div>
                <div className="text-xs text-ink/50 mt-1">{p.media?.length || 0} media items · ID: {p.id.slice(0, 8)}…</div>
              </div>
              <button onClick={() => deleteProject(p.id)} className="text-xs text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 font-medium">
                Delete Project
              </button>
            </div>

            {p.media && p.media.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-ink/5">
                {p.media.map(m => (
                  <div key={m.id} className="relative group/media aspect-square rounded-md overflow-hidden bg-cream border border-ink/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resolveMediaUrl(m.thumbnail_url || m.url)} alt={m.alt_text ?? ""} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/media:opacity-100 transition flex flex-col items-center justify-center gap-2">
                      <button onClick={() => editMedia(m.id, m.alt_text)} className="bg-gold text-ink text-[10px] px-3 py-1 rounded font-medium">Edit</button>
                      <button onClick={() => deleteMedia(m.id)} className="bg-red-500 text-white text-[10px] px-3 py-1 rounded font-medium">Delete</button>
                    </div>
                    {m.alt_text && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 px-1 py-0.5 text-[8px] text-white/90 truncate text-center">
                        {m.alt_text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-center text-sm text-ink/40 py-10 border border-dashed border-ink/15 rounded-xl">No projects yet. Create one above!</p>
        )}
      </div>
    </div>
  );
}

// ─── Photos Tab ───────────────────────────────────────────────────────────────
function PhotosTab({ projects, secret, onRefresh }: { projects: Project[]; secret: string; onRefresh: () => void }) {
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !projectId) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("project_id", projectId);
    fd.append("alt_text", altText);
    const res = await authFetch(`${API}/api/admin/upload/photo`, { method: "POST", body: fd }, secret);
    setUploading(false);
    if (res.ok) {
      alert("Photo uploaded!");
      if (fileRef.current) fileRef.current.value = "";
      setAltText("");
      onRefresh();
    } else {
      alert(`Upload failed: ${await res.text()}`);
    }
  };

  if (projects.length === 0) return <p className="text-center text-sm text-ink/40 py-10">Create a project first!</p>;

  return (
    <form onSubmit={upload} className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-ink/60 mb-1.5">Project</label>
        <select value={projectId} onChange={e => setProjectId(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-ink/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold">
          {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-ink/60 mb-1.5">Caption / Alt Text (optional)</label>
        <input value={altText} onChange={e => setAltText(e.target.value)}
          placeholder="e.g. Bride walking down the aisle..."
          className="w-full px-4 py-2.5 rounded-xl border border-ink/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ink/60 mb-1.5">Photo File</label>
        <div className="border-2 border-dashed border-ink/15 rounded-xl p-8 text-center hover:border-gold/40 transition bg-white/40">
          <input ref={fileRef} type="file" accept="image/*" required
            className="w-full text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-gold/10 file:text-gold-dark hover:file:bg-gold/20 cursor-pointer" />
        </div>
      </div>
      <button type="submit" disabled={uploading}
        className="w-full bg-gold text-ink font-bold py-3.5 rounded-xl shadow-md disabled:opacity-50 hover:bg-gold-light transition flex items-center justify-center gap-2">
        {uploading ? (<><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Uploading...</>) : "Upload Photo"}
      </button>
    </form>
  );
}

// ─── Videos Tab ───────────────────────────────────────────────────────────────
function VideosTab({ projects, secret, onRefresh }: { projects: Project[]; secret: string; onRefresh: () => void }) {
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [saving, setSaving] = useState(false);

  const existingVideos = projects.flatMap(p =>
    (p.media ?? []).filter(m => m.media_type === "video")
  );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim() || !projectId) return;
    setSaving(true);
    const fd = new FormData();
    fd.append("project_id", projectId);
    fd.append("youtube_url", youtubeUrl);
    fd.append("alt_text", altText);
    const res = await authFetch(`${API}/api/admin/upload/video`, { method: "POST", body: fd }, secret);
    setSaving(false);
    if (res.ok) {
      alert("Video added!");
      setYoutubeUrl("");
      onRefresh();
    } else {
      alert(`Failed: ${await res.text()}`);
    }
  };

  const deleteVideo = async (mediaId: string) => {
    if (!confirm("Remove this video?")) return;
    await authFetch(`${API}/api/admin/media/${mediaId}`, { method: "DELETE" }, secret);
    onRefresh();
  };

  if (projects.length === 0) return <p className="text-center text-sm text-ink/40 py-10">Create a project first!</p>;

  return (
    <div className="space-y-8">
      {/* Slot overview */}
      <div>
        <h3 className="text-sm font-semibold mb-1">Slot Overview</h3>
        <p className="text-xs text-ink/50 mb-4">
          Videos fill the 10-slot Signature Films grid. Tag the caption to control which slot a video lands in.
        </p>

        {/* Reels */}
        <p className="text-xs font-mono tracking-widest text-gold uppercase mb-2">📱 Reels (9:16) — slots 1–6</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {VIDEO_SLOTS.filter(s => s.type === "reel").map(slot => {
            const vid = existingVideos.find(v => (v.alt_text || "").toLowerCase().startsWith(slot.prefix));
            return (
              <div key={slot.prefix}
                className={`relative rounded-xl border p-3 text-center cursor-pointer transition group ${vid ? "border-gold/50 bg-gold/5" : "border-ink/10 bg-white/40"}`}
                onClick={() => setAltText(slot.prefix)}>
                {vid?.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={vid.thumbnail_url} alt="" className="w-full aspect-[9/16] object-cover rounded-lg mb-2" />
                ) : (
                  <div className="w-full aspect-[9/16] bg-ink/5 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-2xl opacity-20">📱</span>
                  </div>
                )}
                <p className="text-xs font-semibold">{slot.label}</p>
                <p className={`text-[10px] mt-0.5 ${vid ? "text-green-600" : "text-ink/30"}`}>{vid ? "✓ Filled" : "Empty"}</p>
                {vid && (
                  <button onClick={e => { e.stopPropagation(); deleteVideo(vid.id); }}
                    className="absolute top-2 right-2 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">✕</button>
                )}
              </div>
            );
          })}
        </div>

        {/* Wedding Films */}
        <p className="text-xs font-mono tracking-widest text-gold uppercase mb-2">🎬 Wedding Films (16:9) — slots 1–4</p>
        <div className="grid grid-cols-2 gap-2">
          {VIDEO_SLOTS.filter(s => s.type === "wf").map(slot => {
            const vid = existingVideos.find(v => (v.alt_text || "").toLowerCase().startsWith(slot.prefix));
            return (
              <div key={slot.prefix}
                className={`relative rounded-xl border p-3 cursor-pointer transition group ${vid ? "border-gold/50 bg-gold/5" : "border-ink/10 bg-white/40"}`}
                onClick={() => setAltText(slot.prefix)}>
                {vid?.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={vid.thumbnail_url} alt="" className="w-full aspect-video object-cover rounded-lg mb-2" />
                ) : (
                  <div className="w-full aspect-video bg-ink/5 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-2xl opacity-20">🎬</span>
                  </div>
                )}
                <p className="text-xs font-semibold">{slot.label}</p>
                <p className={`text-[10px] mt-0.5 ${vid ? "text-green-600" : "text-ink/30"}`}>{vid ? "✓ Filled" : "Empty"}</p>
                {vid && (
                  <button onClick={e => { e.stopPropagation(); deleteVideo(vid.id); }}
                    className="absolute top-2 right-2 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">✕</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload form */}
      <form onSubmit={save} className="space-y-4 bg-white/50 p-5 rounded-xl border border-ink/10">
        <h3 className="text-sm font-semibold">Add YouTube Video</h3>
        <p className="text-xs text-ink/50 -mt-2">Click a slot above to auto-fill its tag.</p>

        <div>
          <label className="block text-xs font-medium text-ink/60 mb-1.5">Project</label>
          <select value={projectId} onChange={e => setProjectId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-ink/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold">
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink/60 mb-1.5">
            Slot Tag <span className="font-normal text-gold">← click a slot above to auto-fill</span>
          </label>
          <input value={altText} onChange={e => setAltText(e.target.value)}
            placeholder="e.g. reel_01  or  wf_02"
            className="w-full px-4 py-2.5 rounded-xl border border-ink/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold font-mono text-sm" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {VIDEO_SLOTS.map(s => (
              <button key={s.prefix} type="button" onClick={() => setAltText(s.prefix)}
                className={`text-[10px] px-2 py-1 rounded-full border transition ${altText === s.prefix ? "bg-gold text-ink border-gold" : "border-ink/15 text-ink/50 hover:border-gold/40"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink/60 mb-1.5">YouTube URL</label>
          <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} required
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2.5 rounded-xl border border-ink/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold font-mono text-sm" />
          <p className="text-xs text-ink/40 mt-1.5">Thumbnail is fetched automatically from YouTube.</p>
        </div>

        <button type="submit" disabled={saving || !youtubeUrl.trim()}
          className="w-full bg-gold text-ink font-bold py-3.5 rounded-xl shadow-md disabled:opacity-50 hover:bg-gold-light transition">
          {saving ? "Saving..." : "Add YouTube Video"}
        </button>
      </form>
    </div>
  );
}

// ─── Portraits Tab ────────────────────────────────────────────────────────────
function PortraitsTab({ portraits, secret, onRefresh }: { portraits: Portrait[]; secret: string; onRefresh: () => void }) {
  const [altText, setAltText] = useState("");
  const [order, setOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt_text", altText);
    fd.append("display_order", String(order));
    const res = await authFetch(`${API}/api/admin/portraits`, { method: "POST", body: fd }, secret);
    setUploading(false);
    if (res.ok) {
      alert("Portrait uploaded!");
      if (fileRef.current) fileRef.current.value = "";
      setAltText("");
      setOrder(portraits.length);
      onRefresh();
    } else {
      alert(`Failed: ${await res.text()}`);
    }
  };

  const deletePortrait = async (id: string) => {
    if (!confirm("Delete this portrait?")) return;
    await authFetch(`${API}/api/admin/portraits/${id}`, { method: "DELETE" }, secret);
    onRefresh();
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-3">Current Portraits ({portraits.length}/3 shown in hero)</h3>
        <div className="grid grid-cols-3 gap-3">
          {portraits.map((p, i) => (
            <div key={p.id} className="relative group rounded-xl overflow-hidden aspect-[9/16] bg-cream-warm border border-ink/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resolveMediaUrl(p.url)} alt={p.alt_text ?? ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button onClick={() => deletePortrait(p.id)} className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg">Delete</button>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-1 text-[9px] text-white/80 truncate">
                {i + 1}. {p.alt_text || "Portrait"}
              </div>
            </div>
          ))}
          {portraits.length === 0 && (
            <div className="col-span-3 text-center text-sm text-ink/40 py-8 border border-dashed border-ink/15 rounded-xl">No portraits yet</div>
          )}
        </div>
      </div>

      <form onSubmit={upload} className="space-y-4 bg-white/50 p-5 rounded-xl border border-ink/10">
        <h3 className="text-sm font-semibold">Upload New Portrait</h3>
        <div>
          <label className="block text-xs font-medium text-ink/60 mb-1.5">Portrait Photo</label>
          <div className="border-2 border-dashed border-ink/15 rounded-xl p-6 text-center hover:border-gold/40 transition bg-white/40">
            <input ref={fileRef} type="file" accept="image/*" required
              className="w-full text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-gold/10 file:text-gold-dark hover:file:bg-gold/20 cursor-pointer" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-ink/60 mb-1.5">Alt Text</label>
            <input value={altText} onChange={e => setAltText(e.target.value)}
              placeholder="e.g. Akshay behind camera"
              className="w-full px-3 py-2 rounded-lg border border-ink/20 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink/60 mb-1.5">Position (0=first)</label>
            <input type="number" min={0} value={order} onChange={e => setOrder(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-ink/20 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
          </div>
        </div>
        <button type="submit" disabled={uploading}
          className="w-full bg-gold text-ink font-bold py-3 rounded-xl shadow-md disabled:opacity-50 hover:bg-gold-light transition flex items-center justify-center gap-2">
          {uploading ? (<><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Uploading...</>) : "Upload Portrait"}
        </button>
      </form>
    </div>
  );
}
