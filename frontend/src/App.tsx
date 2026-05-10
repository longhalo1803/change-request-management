import { I18nProvider } from "@/providers/I18nProvider";
import AppRouter from "@/routers";
import { useAuthSyncListener } from "@/store/auth.store";

function App() {
  useAuthSyncListener();
  return (
    <I18nProvider>
      <AppRouter />
    </I18nProvider>
  );
}

export default App;
