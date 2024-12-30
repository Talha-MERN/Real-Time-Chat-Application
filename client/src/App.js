import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/useAuthStore";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/chats",
      element: <Chat />,
    },
  ]);

  return (
    <div>
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
