import “/twind.config”;

import { render, ComponentChildren } from “preact”;
import { useEffect, useState } from “preact/hooks”;
import Home from “./apps/home”;
import { Device } from “./components/Device”;

type Stage = “lock” | “passcode” | “unlocking” | “home”;

function App() {
const [stage, setStage] = useState(“lock”);
const [passcode, setPasscode] = useState(””);
const [wrong, setWrong] = useState(false);
const [touchStartY, setTouchStartY] = useState<number | null>(null);
const [now, setNow] = useState(new Date());

useEffect(() => {
const timer = window.setInterval(() => setNow(new Date()), 1000);
return () => window.clearInterval(timer);
}, []);

const dateText = now.toLocaleDateString(“ko-KR”, {
month: “long”,
day: “numeric”,
weekday: “long”,
});

const timeText = now.toLocaleTimeString(“ko-KR”, {
hour: “2-digit”,
minute: “2-digit”,
hour12: false,
});

const enterPasscode = () => {
if (stage === “lock”) setStage(“passcode”);
};

const pressNumber = (number: string) => {
if (stage !== “passcode” || passcode.length >= 4 || wrong) return;

const next = passcode + number;
setPasscode(next);
if (next.length === 4) {
  if (next === "0205") {
    setStage("unlocking");
    window.setTimeout(() => setStage("home"), 450);
  } else {
    setWrong(true);
    window.setTimeout(() => {
      setPasscode("");
      setWrong(false);
    }, 650);
  }
}

};

const deleteNumber = () => {
if (stage === “passcode” && !wrong) {
setPasscode((value) => value.slice(0, -1));
}
};

return (
  {stage !== "home" && (
    <div
      class={`lock-overlay ${stage === "unlocking" ? "unlocking" : ""}`}
      onTouchStart={(event) =>
        setTouchStartY(event.changedTouches[0]?.clientY ?? null)
      }
      onTouchEnd={(event) => {
        const endY = event.changedTouches[0]?.clientY;
        if (
          stage === "lock" &&
          touchStartY !== null &&
          endY !== undefined &&
          touchStartY - endY > 35
        ) {
          enterPasscode();
        }
        setTouchStartY(null);
      }}
    >
      {stage === "lock" ? (
        <div
          class="lock-screen"
          onClick={enterPasscode}
        >
          <div class="status-bar">
            <span>SKT</span>
            <span>●●●●　Wi-Fi　▰</span>
          </div>
          <div class="lock-date">{dateText}</div>
          <div class="lock-time">{timeText}</div>
          <div class="lock-widget">
            <div class="widget-icon">♡</div>
            <div>
              <div class="widget-title">사랑한 지</div>
              <div class="widget-subtitle">
                오늘도 함께하는 소중한 순간
              </div>
            </div>
          </div>
          <div class="lock-bottom">
            <button
              class="round-button"
              onClick={(event) => {
                event.stopPropagation();
                enterPasscode();
              }}
              aria-label="손전등"
            >
              ◉
            </button>
            <div class="swipe-hint">
              위로 쓸어올려 잠금 해제
              <div class="home-indicator" />
            </div>
            <button
              class="round-button"
              onClick={(event) => {
                event.stopPropagation();
                enterPasscode();
              }}
              aria-label="카메라"
            >
              ◉
            </button>
          </div>
        </div>
      ) : (
        <div class={`passcode-screen ${wrong ? "shake" : ""}`}>
          <div class="passcode-status">
            <span>SKT</span>
            <span>●●●●　Wi-Fi　▰</span>
          </div>
          <button
            class="cancel-button"
            onClick={() => {
              setPasscode("");
              setWrong(false);
              setStage("lock");
            }}
          >
            취소
          </button>
          <div class="passcode-heading">암호 입력</div>
          <div class="passcode-description">
            iPhone을 잠금 해제하려면 암호를 입력하십시오.
          </div>
          <div class="passcode-dots">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                class={`passcode-dot ${
                  passcode.length > index ? "filled" : ""
                }`}
              />
            ))}
          </div>
          {wrong && <div class="wrong-message">암호가 올바르지 않습니다</div>}
          <div class="number-pad">
            {[
              ["1", ""],
              ["2", "ABC"],
              ["3", "DEF"],
              ["4", "GHI"],
              ["5", "JKL"],
              ["6", "MNO"],
              ["7", "PQRS"],
              ["8", "TUV"],
              ["9", "WXYZ"],
              ["", ""],
              ["0", "+"],
              ["⌫", ""],
            ].map(([number, letters], index) => (
              <button
                key={index}
                class={`number-button ${number === "" ? "empty" : ""} ${
                  number === "⌫" ? "delete-button" : ""
                }`}
                onClick={() => {
                  if (number === "⌫") deleteNumber();
                  else if (number !== "") pressNumber(number);
                }}
                disabled={number === ""}
              >
                {number === "⌫" ? (
                  <span class="delete-symbol">⌫</span>
                ) : (
                  <>
                    <span>{number}</span>
                    {letters && <small>{letters}</small>}
                  </>
                )}
              </button>
            ))}
          </div>
          <button
            class="forgot-button"
            onClick={() => {
              setPasscode("");
              setStage("lock");
            }}
          >
            긴급 상황
          </button>
          <div class="passcode-home-indicator" />
        </div>
      )}
    </div>
  )}
  <style>{`
    .lock-overlay {
      position: absolute;
      inset: 0;
      z-index: 9999;
      width: 100%;
      height: 100%;
      overflow: hidden;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
      -webkit-user-select: none;
      user-select: none;
      touch-action: pan-y;
    }
    .lock-screen {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      background:
        linear-gradient(to bottom, rgba(0,0,0,.16), rgba(0,0,0,.08) 45%, rgba(0,0,0,.4)),
        url("/images/lockscreen.jpg") center center / cover no-repeat,
        #656565;
    }
    .status-bar, .passcode-status {
      position: absolute;
      top: max(13px, env(safe-area-inset-top));
      left: 25px;
      right: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      text-shadow: 0 1px 5px #333;
    }
    .lock-date {
      margin-top: clamp(85px, 15%, 130px);
      font-size: clamp(17px, 4.5vw, 21px);
      font-weight: 500;
      text-shadow: 0 1px 8px #333;
    }
    .lock-time {
      margin-top: -3px;
      font-size: clamp(76px, 22vw, 104px);
      line-height: 1.15;
      font-weight: 300;
      letter-spacing: -5px;
      text-shadow: 0 2px 12px rgba(0,0,0,.12);
      font-variant-numeric: tabular-nums;
    }
    .lock-widget {
      display: flex;
      align-items: center;
      align-self: flex-start;
      gap: 12px;
      margin: 28px 20px 0;
      padding: 13px 16px;
      border: 1px solid rgba(255,255,255,.23);
      border-radius: 22px;
      background: rgba(35,35,35,.28);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      text-shadow: 0 1px 4px #333;
    }
    .widget-icon { font-size: 27px; }
    .widget-title { font-size: 14px; font-weight: 600; }
    .widget-subtitle { margin-top: 4px; font-size: 11px; opacity: .88; }
    .lock-bottom {
      position: absolute;
      left: 25px;
      right: 25px;
      bottom: max(12px, env(safe-area-inset-bottom));
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
    .round-button {
      width: 47px;
      height: 47px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,.2);
      background: rgba(30,30,30,.35);
      color: white;
      font-size: 22px;
      backdrop-filter: blur(10px);
    }
    .swipe-hint {
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      white-space: nowrap;
      font-size: 11px;
      text-shadow: 0 1px 5px #333;
      text-align: center;
    }
    .home-indicator, .passcode-home-indicator {
      width: 108px;
      height: 4px;
      border-radius: 10px;
      background: white;
      margin: 12px auto 0;
    }
    .passcode-screen {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: radial-gradient(ellipse at 50% 25%, #55524f, #292827 75%);
      padding: 0 20px;
      box-sizing: border-box;
    }
    .cancel-button {
      position: absolute;
      top: max(48px, calc(env(safe-area-inset-top) + 35px));
      left: 22px;
      border: 0;
      color: white;
      background: transparent;
      font-size: 16px;
    }
    .passcode-heading {
      margin-top: clamp(95px, 17%, 140px);
      font-size: 25px;
      font-weight: 600;
    }
    .passcode-description {
      margin-top: 12px;
      font-size: 13px;
      text-align: center;
      opacity: .85;
    }
    .passcode-dots {
      display: flex;
      gap: 17px;
      margin-top: 28px;
      height: 14px;
      align-items: center;
    }
    .passcode-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,.9);
      background: transparent;
    }
    .passcode-dot.filled { background: white; }
    .wrong-message {
      position: absolute;
      top: 34%;
      font-size: 12px;
      color: #ffd4d4;
    }
    .number-pad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: clamp(17px, 6vw, 30px);
      row-gap: clamp(9px, 2.3vh, 16px);
      margin-top: clamp(26px, 5vh, 40px);
    }
    .number-button {
      width: clamp(68px, 19vw, 78px);
      height: clamp(68px, 19vw, 78px);
      border: 0;
      border-radius: 50%;
      background: rgba(180,180,180,.25);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: 300;
      line-height: 1;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .number-button:active { background: rgba(230,230,230,.45); }
    .number-button small {
      margin-top: 4px;
      font-size: 8px;
      letter-spacing: 2px;
      font-weight: 600;
    }
    .number-button.empty {
      visibility: hidden;
      pointer-events: none;
    }
    .delete-button {
      background: transparent;
      font-size: 24px;
    }
    .forgot-button {
      margin-top: auto;
      margin-bottom: max(32px, calc(env(safe-area-inset-bottom) + 25px));
      color: white;
      border: 0;
      background: transparent;
      font-size: 13px;
    }
    .passcode-home-indicator {
      position: absolute;
      bottom: max(7px, env(safe-area-inset-bottom));
      margin: 0;
    }
    .shake { animation: passcode-shake .32s ease-in-out; }
    @keyframes passcode-shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-9px); }
      40%, 80% { transform: translateX(9px); }
    }
    .unlocking {
      animation: unlock-fade .45s ease forwards;
      pointer-events: none;
    }
    @keyframes unlock-fade {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(1.035); }
    }
    @media (max-height: 700px) {
      .passcode-heading { margin-top: 75px; }
      .passcode-description { margin-top: 7px; }
      .passcode-dots { margin-top: 18px; }
      .number-pad { margin-top: 18px; row-gap: 7px; }
      .number-button {
        width: min(17vw, 63px);
        height: min(17vw, 63px);
      }
    }
  `}</style>
</Device>

);
}

render(, document.body);

export type Children = ComponentChildren | ComponentChildren[];
