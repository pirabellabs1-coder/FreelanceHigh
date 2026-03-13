"use client";

import { useState, useEffect, useCallback } from "react";

interface UserInfo {
  id: string;
  name: string;
  image: string | null;
  avatar: string | null;
}

interface Reply {
  id: string;
  content: string;
  isInstructor: boolean;
  createdAt: string;
  user: UserInfo;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isResolved: boolean;
  createdAt: string;
  user: UserInfo;
  _count?: { replies: number };
  replies?: Reply[];
}

interface DiscussionThreadProps {
  formationId: string;
  currentUserId: string;
  isInstructor: boolean;
  locale: string;
}

function timeAgo(dateStr: string, fr: boolean): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return fr ? "À l'instant" : "Just now";
  if (mins < 60) return `${mins}${fr ? " min" : "m"}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}${fr ? "j" : "d"}`;
}

function Avatar({ user }: { user: UserInfo }) {
  const src = user.avatar || user.image;
  return src ? (
    <img src={src} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}

export function DiscussionThread({
  formationId,
  currentUserId,
  isInstructor,
  locale,
}: DiscussionThreadProps) {
  const fr = locale === "fr";

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [threadData, setThreadData] = useState<Discussion | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);

  // New discussion form
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reply form
  const [replyContent, setReplyContent] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  const loadDiscussions = useCallback(async () => {
    try {
      const res = await fetch(`/api/formations/${formationId}/discussions`);
      const data = await res.json();
      setDiscussions(data.discussions ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [formationId]);

  useEffect(() => { loadDiscussions(); }, [loadDiscussions]);

  const loadThread = useCallback(async (discussionId: string) => {
    setLoadingThread(true);
    setActiveThread(discussionId);
    try {
      const res = await fetch(`/api/formations/${formationId}/discussions/${discussionId}`);
      const data = await res.json();
      setThreadData(data.discussion);
    } catch { /* ignore */ }
    setLoadingThread(false);
  }, [formationId]);

  const createDiscussion = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/formations/${formationId}/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setShowNewForm(false);
        await loadDiscussions();
      }
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  const postReply = async () => {
    if (!replyContent.trim() || !activeThread) return;
    setReplySubmitting(true);
    try {
      const res = await fetch(`/api/formations/${formationId}/discussions/${activeThread}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent }),
      });
      if (res.ok) {
        setReplyContent("");
        await loadThread(activeThread);
        await loadDiscussions();
      }
    } catch { /* ignore */ }
    setReplySubmitting(false);
  };

  const togglePin = async (discussionId: string, isPinned: boolean) => {
    await fetch(`/api/formations/${formationId}/discussions/${discussionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: !isPinned }),
    });
    await loadDiscussions();
    if (activeThread === discussionId && threadData) {
      setThreadData({ ...threadData, isPinned: !isPinned });
    }
  };

  const toggleResolve = async (discussionId: string, isResolved: boolean) => {
    await fetch(`/api/formations/${formationId}/discussions/${discussionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isResolved: !isResolved }),
    });
    await loadDiscussions();
    if (activeThread === discussionId && threadData) {
      setThreadData({ ...threadData, isResolved: !isResolved });
    }
  };

  const deleteDiscussion = async (discussionId: string) => {
    await fetch(`/api/formations/${formationId}/discussions/${discussionId}`, {
      method: "DELETE",
    });
    if (activeThread === discussionId) {
      setActiveThread(null);
      setThreadData(null);
    }
    await loadDiscussions();
  };

  // Thread detail view
  if (activeThread && threadData) {
    return (
      <div className="flex flex-col h-full">
        {/* Back button */}
        <button
          onClick={() => { setActiveThread(null); setThreadData(null); }}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-3 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {fr ? "Retour" : "Back"}
        </button>

        {/* Thread header */}
        <div className="mb-4">
          <div className="flex items-start gap-2 mb-1">
            {threadData.isPinned && <span className="text-yellow-500 text-xs mt-0.5">📌</span>}
            {threadData.isResolved && <span className="text-green-500 text-xs mt-0.5">✓</span>}
            <h3 className="text-sm font-semibold text-white flex-1">{threadData.title}</h3>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Avatar user={threadData.user} />
            <span className="text-xs text-slate-400">
              {threadData.user.name} · {timeAgo(threadData.createdAt, fr)}
            </span>
          </div>
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{threadData.content}</p>

          {/* Instructor actions */}
          {isInstructor && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => togglePin(threadData.id, threadData.isPinned)}
                className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                {threadData.isPinned ? (fr ? "Désépingler" : "Unpin") : (fr ? "Épingler" : "Pin")}
              </button>
              <button
                onClick={() => toggleResolve(threadData.id, threadData.isResolved)}
                className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                {threadData.isResolved ? (fr ? "Rouvrir" : "Reopen") : (fr ? "Résoudre" : "Resolve")}
              </button>
              <button
                onClick={() => deleteDiscussion(threadData.id)}
                className="text-xs px-2 py-1 rounded bg-red-900/30 text-red-400 hover:bg-red-900/50"
              >
                {fr ? "Supprimer" : "Delete"}
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-slate-700 my-2" />

        {/* Replies */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {loadingThread ? (
            <div className="text-center py-4 text-slate-500 text-sm">{fr ? "Chargement..." : "Loading..."}</div>
          ) : threadData.replies && threadData.replies.length > 0 ? (
            threadData.replies.map((reply) => (
              <div key={reply.id} className="flex gap-2">
                <Avatar user={reply.user} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">{reply.user.name}</span>
                    {reply.isInstructor && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-600/30 text-purple-400">
                        {fr ? "Instructeur" : "Instructor"}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">{timeAgo(reply.createdAt, fr)}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 whitespace-pre-wrap">{reply.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 text-xs py-4">
              {fr ? "Aucune réponse" : "No replies yet"}
            </p>
          )}
        </div>

        {/* Reply input */}
        <div className="flex gap-2">
          <input
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={fr ? "Votre réponse..." : "Your reply..."}
            className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:border-purple-500 focus:outline-none"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); postReply(); } }}
          />
          <button
            onClick={postReply}
            disabled={replySubmitting || !replyContent.trim()}
            className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {replySubmitting ? "..." : (fr ? "Envoyer" : "Send")}
          </button>
        </div>
      </div>
    );
  }

  // Discussion list view
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">
          {fr ? "Discussions" : "Discussions"}
          {discussions.length > 0 && <span className="text-slate-500 ml-1">({discussions.length})</span>}
        </h3>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {showNewForm ? "✕" : (fr ? "+ Nouveau" : "+ New")}
        </button>
      </div>

      {/* New discussion form */}
      {showNewForm && (
        <div className="bg-slate-800/50 rounded-lg p-3 mb-3 space-y-2 border border-slate-700">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={fr ? "Titre de la question..." : "Question title..."}
            className="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:border-purple-500 focus:outline-none"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={fr ? "Décrivez votre question en détail..." : "Describe your question in detail..."}
            rows={3}
            className="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:border-purple-500 focus:outline-none resize-none"
          />
          <button
            onClick={createDiscussion}
            disabled={submitting || !newTitle.trim() || !newContent.trim()}
            className="w-full py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? (fr ? "Envoi..." : "Posting...") : (fr ? "Publier" : "Post")}
          </button>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <div className="text-center py-8 text-slate-500 text-sm">{fr ? "Chargement..." : "Loading..."}</div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm mb-2">
              {fr ? "Aucune discussion pour l'instant" : "No discussions yet"}
            </p>
            <p className="text-slate-600 text-xs">
              {fr ? "Posez la première question !" : "Ask the first question!"}
            </p>
          </div>
        ) : (
          discussions.map((d) => (
            <button
              key={d.id}
              onClick={() => loadThread(d.id)}
              className="w-full text-left bg-slate-800/50 hover:bg-slate-800 rounded-lg p-3 transition-colors border border-transparent hover:border-slate-700"
            >
              <div className="flex items-start gap-2">
                <Avatar user={d.user} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {d.isPinned && <span className="text-yellow-500 text-[10px]">📌</span>}
                    {d.isResolved && (
                      <span className="text-[10px] px-1 py-0.5 rounded bg-green-900/30 text-green-400">
                        {fr ? "Résolu" : "Solved"}
                      </span>
                    )}
                    <span className="text-xs font-medium text-white truncate">{d.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{d.content}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                    <span>{d.user.name}</span>
                    <span>{timeAgo(d.createdAt, fr)}</span>
                    <span>{d._count?.replies ?? 0} {fr ? "réponses" : "replies"}</span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
