import { I18nProvider } from "@/providers/I18nProvider";
import AppRouter from "@/routers";

function App() {
  return (
    <I18nProvider>
      <AppRouter />
    </I18nProvider>
  );
}

export default App;
