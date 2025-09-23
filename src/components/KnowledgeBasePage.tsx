import React from 'react';

interface KnowledgeBasePageProps {
  articles: any[];
}

const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ articles }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Knowledge Base</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Help Articles</h2>
          <p>Browse help articles and documentation</p>
          {articles && articles.length > 0 ? (
            <div className="space-y-2">
              {articles.slice(0, 5).map((article, index) => (
                <div key={index} className="alert">
                  <span>{article.title || `Article ${index + 1}`}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No articles available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;