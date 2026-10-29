
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ArticleListPage from "./pages/ArticleListPage";
import CreateArticlePage from "./pages/CreateArticlePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/articles/new" element={<CreateArticlePage />} />
        <Route
          path="/articles/:articleId"
          element={<ArticleDetailPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
