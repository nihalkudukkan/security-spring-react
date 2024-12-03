import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Provider from './context/Provider.jsx'
import Addasset from './components/Addasset.jsx'
import EditAsset from './components/EditAsset.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/addasset",
    element: <Addasset />
  },
  {
    path: "/editasset/:assetId",
    element: <EditAsset />
  }
]);

createRoot(document.getElementById('root')).render(
  <Provider>
    <RouterProvider router={router} />
  </Provider>
)
