
import { Screen } from "../../components/Screen";
import { useState } from "preact/hooks";

const posts = [
  {
    user: "siwoo",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
    caption: "오늘의 기록 🌷",
    likes: 1284,
  },
  {
    user: "daily",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800",
    caption: "좋아하는 순간들 ✨",
    likes: 856,
  },
];

export default function Instagram() {
  const [tab, setTab] = useState("홈");
  const [liked, setLiked] = useState<number[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  return (
    <Screen>
      <div class="h-full overflow-y-auto bg-white text-black">
        <header class="flex items-center justify-between border-b p-4">
          <span class="text-2xl font-bold italic">Instagram</span>
          <div class="flex gap-5 text-2xl">
            <button onClick={() => setTab("알림")}>♡</button>
            <button onClick={() => setTab("메시지")}>➤</button>
          </div>
        </header>

        <div class="flex gap-4 overflow-x-auto p-3">
          {["내 스토리", "siwoo", "daily", "friends", "mood"].map(
            (name, i) => (
              <button
                class="flex min-w-[58px] flex-col items-center gap-1"
                onClick={() => setTab("스토리: " + name)}
              >
                <div
                  class={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${
                    i === 0 ? "border-gray-300" : "border-pink-500"
                  }`}
                >
                  <span class="text-xl">{i === 0 ? "+" : "♡"}</span>
                </div>
                <span class="text-xs">{name}</span>
              </button>
            )
          )}
        </div>

        {tab === "홈" ? (
          posts.map((post, i) => (
            <article class="mb-5">
              <div class="flex items-center justify-between p-3">
                <div class="flex items-center gap-2">
                  <div class="flex h-9 w-9 items-center justify-center rounded-full bg-pink-200">
                    ♡
                  </div>
                  <span class="font-semibold">{post.user}</span>
                </div>
                <button>•••</button>
              </div>

              <img
                src={post.image}
                alt="게시물 사진"
                class="w-full object-cover"
              />

              <div class="p-3">
                <div class="flex gap-4 text-2xl">
                  <button onClick={() => setLiked((old) =>
                    old.includes(i)
                      ? old.filter((n) => n !== i)
                      : [...old, i]
                  )}>
                    {liked.includes(i) ? "❤️" : "♡"}
                  </button>
                  <button onClick={() => setTab("댓글")}>▢</button>
                  <button onClick={() => setTab("공유")}>➤</button>
                  <span class="flex-1" />
                  <button onClick={() => setTab("저장됨")}>♧</button>
                </div>
                <p class="mt-2 text-sm font-semibold">
                  {(post.likes + (liked.includes(i) ? 1 : 0)).toLocaleString()} likes
                </p>
                <p class="mt-1 text-sm">
                  <b>{post.user}</b> {post.caption}
                </p>
                <button
                  class="mt-2 text-sm text-gray-500"
                  onClick={() => setTab("댓글")}
                >
                  댓글 모두 보기
                </button>
              </div>
            </article>
          ))
        ) : (
          <div class="p-8 text-center">
            <p class="mb-3 text-xl font-semibold">{tab}</p>
            <p class="text-sm text-gray-500">
              이 화면은 시뮬레이터용 예시 화면이야.
            </p>
            <button
              class="mt-5 rounded-lg bg-gray-100 px-4 py-2"
              onClick={() => setTab("홈")}
            >
              홈으로 돌아가기
            </button>
          </div>
        )}

        <nav class="sticky bottom-0 flex justify-around border-t bg-white p-3 text-2xl">
          <button onClick={() => setTab("홈")}>⌂</button>
          <button onClick={() => setTab("검색")}>⌕</button>
          <button onClick={() => setTab("만들기")}>⊞</button>
          <button onClick={() => setTab("릴스")}>▷</button>
          <button onClick={() => setTab("프로필")}>◉</button>
        </nav>
      </div>
    </Screen>
  );
}

