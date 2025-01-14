import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./utils/theme";
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRouter from "./routes/AppRouter";



function App() {


  return (
    <ThemeProvider theme={theme}>
     <CssBaseline />
     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AppRouter />
     </GoogleOAuthProvider>

    </ThemeProvider>
  )
}

export default App
