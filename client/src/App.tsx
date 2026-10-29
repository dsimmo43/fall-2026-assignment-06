
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ArticleListPage from "./pages/ArticleListPage";
import CreateArticlePage from "./pages/CreateArticlePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import EditArticlePage from "./pages/EditArticlePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/articles/new" element={<CreateArticlePage />} />
        <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
        <Route path="/articles/:articleId/edit" element={<EditArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
