
import { useState } from "preact/hooks";
import { Screen } from "../../components/Screen";

type Message = {
  id: number;
  text: string;
  mine: boolean;
  time: string;
};

type Conversation = {
  id: number;
  name: string;
  initials: string;
  color: string;
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "김민지",
    initials: "민",
    color: "#F2A6B3",
    messages: [
      { id: 1, text: "오늘 뭐 해?", mine: false, time: "오후 7:20" },
      { id: 2, text: "집에서 쉬고 있어!", mine: true, time: "오후 7:21" },
      { id: 3, text: "그럼 내일 만날래?", mine: false, time: "오후 7:22" },
    ],
  },
  {
    id: 2,
    name: "이서준",
    initials: "서",
    color: "#85B7E5",
    messages: [
      { id: 1, text: "사진 보내 줘 ㅋㅋ", mine: false, time: "오후 6:45" },
      { id: 2, text: "잠깐만!", mine: true, time: "오후 6:46" },
    ],
  },
  {
    id: 3,
    name: "우리 반",
    initials: "반",
    color: "#B3A0E8",
    messages: [
      { id: 1, text: "내일 준비물 잊지 마!", mine: false, time: "오후 5:10" },
    ],
  },
];

export default function Messages() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const active = conversations.find((chat) => chat.id === activeId);

  function sendMessage(event: Event) {
    event.preventDefault();

    const text = draft.trim();
    if (!text || activeId === null) return;

    const now = new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setConversations((items) =>
      items.map((chat) =>
        chat.id === activeId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: Date.now(),
                  text,
                  mine: true,
                  time: now,
                },
              ],
            }
          : chat
      )
    );

    setDraft("");
  }

  return (
    <Screen class="!bg-[#F2F2F7] text-black">
      <div class="flex h-full flex-col">
        {active ? (
          <>
            <header class="shrink-0 border-b border-gray-200 bg-[#F8F8FA] px-4 pt-safe-t">
              <div class="flex h-14 items-center gap-3">
                <button
                  class="text-lg text-blue-500"
                  onClick={() => {
                    setActiveId(null);
                    setDraft("");
                  }}
                >
                  ‹ 목록
                </button>

                <div class="flex-1 text-center font-semibold">
                  {active.name}
                </div>

                <div
                  class="h-9 w-9 rounded-full flex items-center justify-center text-white"
                  style={{ background: active.color }}
                >
                  {active.initials}
                </div>
              </div>
            </header>

            <main class="flex-1 overflow-y-auto px-4 py-5 pb-16">
              <div class="mb-5 text-center text-xs text-gray-500">
                오늘
              </div>

              {active.messages.map((message) => (
                <div key={message.id} class="mb-4">
                  <div
                    class={`flex ${
                      message.mine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      class={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[15px] ${
                        message.mine
                          ? "bg-[#0A84FF] text-white rounded-br-md"
                          : "bg-white text-black rounded-bl-md"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                  <div
                    class={`mt-1 text-[10px] text-gray-500 ${
                      message.mine ? "text-right" : "text-left"
                    }`}
                  >
                    {message.time}
                  </div>
                </div>
              ))}
            </main>

            <form
              class="shrink-0 flex items-center gap-2 border-t border-gray-200 bg-[#F8F8FA] px-3 py-3 pb-14"
              onSubmit={sendMessage}
            >
              <input
                value={draft}
                onInput={(event) =>
                  setDraft((event.currentTarget as HTMLInputElement).value)
                }
                placeholder="iMessage"
                class="min-w-0 flex-1 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                class="h-9 w-9 shrink-0 rounded-full bg-[#0A84FF] font-bold text-white"
              >
                ↑
              </button>
            </form>
          </>
        ) : (
          <>
            <header class="shrink-0 border-b border-gray-200 bg-[#F8F8FA] px-5 pt-safe-t">
              <div class="flex h-14 items-center justify-between">
                <span class="text-sm text-blue-500">편집</span>
                <h1 class="text-xl font-bold">메시지</h1>
                <span class="text-xl text-blue-500">✎</span>
              </div>
            </header>

            <main class="flex-1 overflow-y-auto pb-16">
              <div class="px-4 py-3">
                <input
                  placeholder="검색"
                  class="w-full rounded-xl bg-gray-200 px-3 py-2 text-sm outline-none"
                />
              </div>

              {conversations.map((chat) => {
                const last =
                  chat.messages[chat.messages.length - 1];

                return (
                  <button
                    key={chat.id}
                    class="flex w-full items-center gap-3 border-b border-gray-200 bg-transparent px-4 py-3 text-left active:bg-gray-200"
                    onClick={() => setActiveId(chat.id)}
                  >
                    <div
                      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
                      style={{ background: chat.color }}
                    >
                      {chat.initials}
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="mb-1 flex items-center justify-between gap-2">
                        <span class="font-semibold">{chat.name}</span>
                        <span class="shrink-0 text-[11px] text-gray-500">
                          {last?.time}
                        </span>
                      </div>
                      <div class="truncate text-sm text-gray-500">
                        {last?.mine ? "나: " : ""}
                        {last?.text}
                      </div>
                    </div>

                    <span class="text-xl text-gray-400">›</span>
                  </button>
                );
              })}
            </main>
          </>
        )}
      </div>
    </Screen>
  );
}
