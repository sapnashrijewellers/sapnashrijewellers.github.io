
import { DataProvider } from "./context/DataContext";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import TV from "./pages/tv";
import Calculator from './pages/Calculator.jsx'
import DefaultLayout from "./layouts/DefaultLayout";
import TvLayout from "./layouts/TvLayout";
export default function App() {


  return (


    <DataProvider>
      <Routes>
        {/* Default Layout Routes */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/calculator" element={<Calculator />} />
        </Route>
        {/* TV Layout Route */}
        <Route element={<TvLayout />}>
          <Route path="/tv" element={<TV />} />
        </Route>
      </Routes>
    </DataProvider>
  );
}