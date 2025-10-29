import { DataProvider } from "./context/DataContext";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import TV from "./pages/tv";
import Calculator from './pages/Calculator.jsx'
import QrCode from './pages/QrCode.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import DefaultLayout from "./layouts/DefaultLayout";
import TvLayout from "./layouts/TvLayout";
import { useRegisterSW } from 'virtual:pwa-register/react';
import { subscribeUser } from "./utils/pubsub.js";
export default function App() {
  const BASE_URL = "https://tight-sky-9fb5.ssjn.workers.dev/";
  //const BASE_URL = "http://localhost:8787/";
  useRegisterSW({    
    onRegisteredSW(registration) {
      if (registration) {        
        subscribeUser(BASE_URL);
      }
    }
    // You can also add other useful handlers here:
    // onOfflineReady() { console.log('App ready for offline use'); },
    // onNeedRefresh() { console.log('New content available, please refresh!'); }
  });

   window.addEventListener("beforeinstallprompt", () => {
  console.log("✅ beforeinstallprompt fired");
});
  return (


    <DataProvider>
      <Routes>
        {/* Default Layout Routes */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/product/:category/:id" element={<ProductDetail />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/qr" element={<QrCode />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Route>
        {/* TV Layout Route */}
        <Route element={<TvLayout />}>
          <Route path="/tv" element={<TV />} />
        </Route>
      </Routes>
    </DataProvider>
  );
}