import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageContainer from "../components/layout/PageContainer";
import ChatWindow from "../components/askloop/ChatWindow";
import ChatHistorySidebar from "../components/askloop/ChatHistorySidebar";

import { useAuth } from "../context/AuthContext";
import { askLoop } from "../services/askLoopService";
import {
  loadConversations,
  saveConversations,
  createConversation,
  deriveTitle,
} from "../utils/chatStorage";

export default function AskLoop() {
  const { user } = useAuth();

  const [conversations, setConversations] = useState(() => {
    const loaded = loadConversations(user?.id);
    return loaded.length > 0 ? loaded : [createConversation()];
  });

  const [activeId, setActiveId] = useState(() => conversations[0].id);
  const [isLoading, setIsLoading] = useState(false);

  // The ONE place conversations get persisted. Previously ChatWindow had
  // a separate "load on mount" effect and "save on every change" effect,
  // which could race — the save effect firing with a stale empty array
  // right after mount could wipe out what the load effect had just
  // restored. Loading now happens once via the lazy useState initializer
  // above (synchronous, before first paint), and saving happens only
  // here, so there's no window where a stale write can clobber a fresh
  // read.
  useEffect(() => {
    saveConversations(user?.id, conversations);
  }, [conversations, user?.id]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) || conversations[0],
    [conversations, activeId],
  );

  const handleNewChat = () => {
    const fresh = createConversation();
    setConversations((prev) => [fresh, ...prev]);
    setActiveId(fresh.id);
  };

  const handleSelectConversation = (id) => {
    setActiveId(id);
  };

  const handleRenameConversation = (id, newTitle) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, title: trimmed, titleIsCustom: true } : c,
      ),
    );
  };

  const handleDeleteConversation = (id) => {
    const remaining = conversations.filter((c) => c.id !== id);
    const finalList = remaining.length > 0 ? remaining : [createConversation()];
    setConversations(finalList);
    if (activeId === id) {
      setActiveId(finalList[0].id);
    }
    toast.success("Chat deleted.");
  };

  const handleSend = async (question) => {
    const conversationId = activeConversation.id;
    const userMessage = { id: Date.now(), type: "user", text: question };

    // Auto-title from the first question, but only if the user hasn't
    // already renamed this chat themselves.
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              updatedAt: Date.now(),
              title:
                !c.titleIsCustom && c.messages.length === 0
                  ? deriveTitle(question)
                  : c.title,
            }
          : c,
      ),
    );

    setIsLoading(true);

    try {
      const response = await askLoop(question);
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        text: response.answer,
        citations: response.citations || [],
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, aiMessage], updatedAt: Date.now() }
            : c,
        ),
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Ask LOOP couldn't answer that — please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageContainer
        title="Ask LOOP AI"
        subtitle="Analyze customer feedback using AI-powered insights."
      >
        <div className="mx-auto flex w-full max-w-7xl gap-6">
          <ChatHistorySidebar
            conversations={conversations}
            activeId={activeConversation.id}
            onSelect={handleSelectConversation}
            onNewChat={handleNewChat}
            onRename={handleRenameConversation}
            onDelete={handleDeleteConversation}
          />

          <ChatWindow
            title={activeConversation.title}
            messages={activeConversation.messages}
            isLoading={isLoading}
            onSend={handleSend}
            onNewChat={handleNewChat}
          />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}