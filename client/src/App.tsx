import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticleListPage from "./pages/ArticleListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
