"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Plus,
  Sparkles,
  Bot,
  Hammer,
  Terminal,
  Code2,
  CheckCircle2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { authClient } from "@/lib/auth-client";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import Button from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Code from "@/components/ui/code";

import PromptInput from "@/components/ui/artificial-intelligence/PromptInput";

const groupMessages = (messages) => {
  const grouped = [];

  messages.forEach((msg) => {
    if (msg.type === "tool") {
      const lastMsg = grouped[grouped.length - 1];

      if (lastMsg && lastMsg.tool_calls) {
        const callIndex = lastMsg.tool_calls.findIndex(
          (tc) => tc.id === msg.tool_call_id,
        );

        if (callIndex !== -1) {
          lastMsg.tool_calls[callIndex].result = msg.content;
        } else {
          const targetIndex = lastMsg.tool_calls.length - 1;
          if (targetIndex >= 0) {
            lastMsg.tool_calls[targetIndex].result = msg.content;
          }
        }
      }
    } else {
      const newMsg = { ...msg };
      if (newMsg.tool_calls) {
        newMsg.tool_calls = newMsg.tool_calls.map((tc) => ({ ...tc }));
      }
      grouped.push(newMsg);
    }
  });

  return grouped;
};

const JsonDisplay = ({ data, label, icon: Icon }) => (
  <div className="rounded-lg border border-slate-200 overflow-hidden text-xs w-full max-w-full">
    <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-2 text-slate-500 font-medium select-none">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </div>
    <div className="bg-slate-950 p-3 overflow-x-auto">
      <pre className="text-slate-50 font-mono leading-relaxed whitespace-pre-wrap break-words overflow-y-auto max-h-60">
        {typeof data === "object" ? JSON.stringify(data, null, 2) : data}
      </pre>
    </div>
  </div>
);

const MessageItem = ({ msg }) => {
  const isUser = msg.type === "human";
  const hasToolCalls = msg.tool_calls && msg.tool_calls.length > 0;
  const { data: session } = authClient.useSession();

  return (
    <div
      className={`flex gap-4 w-full mb-6 ${isUser ? "flex-row-reverse" : "flex-row"
        }`}
    >
      {/* Avatar Bubble */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors duration-200
        ${isUser
            ? "bg-gradient-to-br from-gray-700 to-gray-900 text-white"
            : hasToolCalls
              ? "bg-primary text-white border-none"
              : "bg-white border border-gray-200 text-primary"
          }`}
      >
        {isUser ? (
          session?.user?.image ? (
            <img
              src={session.user.image}
              alt="User"
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="text-xs font-bold">
              {session?.user?.name?.[0] || "U"}
            </div>
          )
        ) : hasToolCalls ? (
          <Hammer className="w-4 h-4" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>

      <div
        className={`flex flex-col gap-2 w-full  ${isUser ? "items-end" : "items-start"
          }`}
      >
        <span className="text-xs text-gray-400 font-medium px-1">
          {isUser ? session?.user?.name || "You" : "Kepler-16b"}
        </span>

        {/* Tool Execution Block */}
        {hasToolCalls && (
          <div className="bg-white border border-slate-200 rounded-lg w-full mb-1 overflow-hidden shadow-sm">
            <Accordion allowMultiple>
              {msg.tool_calls.map((tool, idx) => (
                <AccordionItem
                  key={tool.id}
                  value={tool.id}
                  title={
                    <span className="flex items-center gap-3 w-full pr-4">
                      <span className="flex items-center justify-center w-6 h-6 bg-slate-100 border border-slate-200 rounded-md">
                        <Terminal className="w-3.5 h-3.5 text-slate-600" />
                      </span>
                      <span className="font-mono text-sm text-slate-700">
                        {tool.name}
                      </span>
                      <span className="ml-auto text-[10px] uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                        Function
                      </span>
                    </span>
                  }
                >
                  {" "}
                  <div className="p-2 flex flex-col gap-1 w-full">
                    <JsonDisplay
                      data={tool.args}
                      label="Input Arguments"
                      icon={Code2}
                    />

                    {tool.result && (
                      <JsonDisplay
                        data={tool.result}
                        label="Execution Result"
                        icon={CheckCircle2}
                      />
                    )}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {msg.content && (
          <div
            className={`
              px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm overflow-hidden max-w-full
              ${isUser
                ? "bg-primary text-white rounded-tr-none"
                : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
              }
            `}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <Code language={match[1]}>
                      {String(children).replace(/\n$/, "")}
                    </Code>
                  ) : (
                    <code
                      className={`${isUser ? "bg-white/20" : "bg-gray-100 text-gray-800"
                        } px-1.5 py-0.5 rounded text-xs font-mono w-full`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-4 mb-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-4 mb-2">{children}</ol>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="underline hover:opacity-80"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: session } = authClient.useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async ({ text, files }) => {
    if (!text && files.length === 0) return;

    setIsLoading(true);

    const processedFiles = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    const newUserMessage = {
      type: "human",
      content: text,
      timestamp: new Date().toISOString(),
      files: processedFiles,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    const messagesToSend = [...messages, newUserMessage];

    try {
      const response = await fetch(`/api/interactive/chatbot/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagesToSend),
      });

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
  };

  const groupedMessages = groupMessages(messages);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-gray-800 font-sans">
      <header className="flex items-center justify-between px-5 py-3 sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-700">Kepler-16b</span>
            <span className="text-xs text-gray-400">Workflow ID: {id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={startNewChat} variation="secondary">
            <Plus className="w-4 h-4" />
            New chat
          </Button>

          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 shrink-0 shadow-sm">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-white">
                <span className="text-sm font-medium">
                  {session?.user?.name
                    ? session.user.name.charAt(0).toUpperCase()
                    : "U"}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-full flex flex-col">
          <div className="space-y-6 pb-4">
            {groupedMessages.map((msg, idx) => (
              <MessageItem key={idx} msg={msg} />
            ))}

            {isLoading && (
              <div className="flex w-full mb-6 justify-start animate-pulse">
                <div className="flex max-w-[80%] gap-4">
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-primary animate-spin-slow" />
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="h-4 w-48 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 w-full pb-3 pt-2">
        <div className="max-w-4xl mx-auto px-4">
          <PromptInput
            onSubmit={handleSendMessage}
            isLoading={isLoading}
            placeholder="Ask anything or use a tool..."
          />

          <p className="text-[11px] text-center text-gray-400 font-medium">
            Responses may be inaccurate.
          </p>
        </div>
      </div>
    </div>
  );
}
