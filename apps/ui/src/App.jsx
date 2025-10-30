import { DataProvider } from "./context/DataContext";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import TV from "./pages/tv";
import Calculator from './pages/Calculator.jsx';
import QrCode from './pages/QrCode.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import HUIDInfo from "./pages/HUIDInfo.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import DefaultLayout from "./layouts/DefaultLayout";
import TvLayout from "./layouts/TvLayout";
import { useRegisterSW } from 'virtual:pwa-register/react';
import { subscribeUser } from "./utils/pubsub.js";
export default function App() {
  const BASE_URL = "https://tight-sky-9fb5.ssjn.workers.dev/";
  //const BASE_URL = "http://localhost:8787/";
  useRegisterSW({
    onRegisteredSW(registration) {
      if (!registration) return;
      (async () => {
        // Wait for Chrome ↔ TWA permission delegation to settle
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Check notification permission before prompting
        if (Notification.permission === "default") {
          // Ask once only if not already prompted
          if (!localStorage.getItem("notifPrompted")) {
            localStorage.setItem("notifPrompted", "yes");
            await subscribeUser(BASE_URL);
          }
        } else if (Notification.permission === "granted") {
          // Already granted — ensure subscription exists
          const existing = await registration.pushManager.getSubscription();
          if (!existing) await subscribeUser(BASE_URL);
        } else {
          console.log("Notifications previously denied by user.");
        }
      })();
    },

    // Optional: useful lifecycle handlers
    // onOfflineReady() { console.log('App ready for offline use'); },
    // onNeedRefresh() { console.log('New content available, please refresh!'); }
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
          <Route path="/huid" element={<HUIDInfo />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Route>
        {/* TV Layout Route */}
        <Route element={<TvLayout />}>
          <Route path="/tv" element={<TV />} />
        </Route>
      </Routes>
    </DataProvider >
  );
}