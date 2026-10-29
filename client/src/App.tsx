
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticleListPage from "./pages/ArticleListPage";
import CreateArticlePage from "./pages/CreateArticlePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/articles/new" element={<CreateArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
