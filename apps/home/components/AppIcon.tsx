
import { state } from "../state";
import { App } from "../state/apps";

export const AppIcon = (props: { app: App }) => {
  const { id, icon, name } = props.app;

  const launch = () => {
    const apps = state.$apps!.value;
    const runningApps = state.$runningApps!.value;
    const order =
      Math.max(0, ...runningApps.map((v) => v.order ?? 0)) + 1;

    state.$view!.value = "app";
    state.$apps!.value = {
      ...apps,
      [id]: { ...props.app, order },
    };
  };

  return (
    <div class="px-0.5">
      {icon ? (
        <img
          src={icon}
          alt={name}
          class="aspect-square w-full select-none"
          onClick={launch}
        />
      ) : (
        <div
          role="button"
          aria-label={name}
          onClick={launch}
          class="flex aspect-square w-full cursor-pointer items-center justify-center rounded-[22%] bg-[#34C759] text-white shadow-sm"
        >
          <svg
            viewBox="0 0 48 48"
            class="h-3/5 w-3/5"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M8 11 Q8 7 13 7 H35 Q40 7 40 12 V29 Q40 34 35 34 H22 L13 41 V34 H13 Q8 34 8 29 Z" />
          </svg>
        </div>
      )}
    </div>
  );
};
