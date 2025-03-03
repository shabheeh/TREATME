import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./utils/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import { SocketProvider } from "./contexts/SocketContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Toaster richColors />
      <CssBaseline />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <SocketProvider>
          <AppRouter />
        </SocketProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
