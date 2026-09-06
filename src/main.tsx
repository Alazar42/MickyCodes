import './index.css'
import App from './App.tsx'

import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>,
);
