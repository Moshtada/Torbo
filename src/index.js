import React from 'react';
import ReactDOM from 'react-dom/client';

import { Navbar, Footer } from './Pages/layout';
import { Home } from './Pages/home';
import { Products } from './Pages/products';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DrawMain from './Pages/DrawMain'
import EditMain from './Pages/EditMain'

import TimeMain from './Pages/TimeMain'

function App() {
  // const [formStates, setFormStates] = useState({}); // استیت‌های ذخیره‌شده از فرم

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />
          
          <Route path="/drawmain" element={<DrawMain />} />
          
          <Route path="/editmain" element={<EditMain />} />

          <Route path="/timemain" element={<TimeMain />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

