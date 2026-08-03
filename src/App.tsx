

import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";



export default function App() {


  return (

    <ThemeProvider>

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#1e293b",
            color: "#fff",
          },
        }}
      />


    <AppRoutes />

    </ThemeProvider>

  );

}