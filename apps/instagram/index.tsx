
import { Screen } from "../../components/Screen";

export default function Instagram() {
  return (
    <Screen>
      <iframe
        src="/instagram.html"
        title="Instagram"
        class="h-full w-full border-0"
        style={{
          minHeight: "800px",
          background: "#fff",
        }}
      />
    </Screen>
  );
}
