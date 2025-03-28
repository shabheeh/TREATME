import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./utils/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import { SocketProvider } from "./contexts/SocketContext";
import { ToasterProvider } from "./components/basics/toaster/ToastProvider";
import AIChatBot from "./components/basics/aiChat/AIChatBot";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Toaster richColors />
      <ToasterProvider>
        <CssBaseline />
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <SocketProvider>
            <AIChatBot />
            <AppRouter />
          </SocketProvider>
        </GoogleOAuthProvider>
      </ToasterProvider>
    </ThemeProvider>
  );
}

export default App;
