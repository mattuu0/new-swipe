import { useState, useEffect } from 'react';
import { MOCK_NEWS } from './data/mockNews';
import type { NewsArticle } from './types/news';
import { NewsCard } from './components/NewsCard';
import { SavedNewsView } from './components/SavedNewsView';
import { ProfilePage } from './components/ProfilePage';
import { TutorialOverlay } from './components/TutorialOverlay';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, LayoutGrid, Bookmark, User as UserIcon } from 'lucide-react';
import { cn } from './utils/cn';

/**
 * ビューの型定義
 */
type ActiveView = 'discover' | 'saved' | 'profile';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('discover');
  const [newsStack, setNewsStack] = useState<NewsArticle[]>([]);
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);

  // 初期データの読み込みとチュートリアルの表示判定
  useEffect(() => {
    setNewsStack([...MOCK_NEWS]);

    // localStorage を使用して初回のみ表示
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  /**
   * スワイプ処理
   */
  const handleSwipe = (direction: 'left' | 'right') => {
    const swipedArticle = newsStack[0];
    if (!swipedArticle) return;

    if (direction === 'right') {
      setSavedArticles(prev => {
        if (prev.find(a => a.id === swipedArticle.id)) return prev;
        return [swipedArticle, ...prev];
      });
    }

    setNewsStack(prev => prev.slice(1));
  };

  const handleReset = () => {
    setNewsStack([...MOCK_NEWS]);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden font-sans border-x border-gray-100">
      {/* チュートリアル */}
      <TutorialOverlay isVisible={showTutorial} onClose={closeTutorial} />

      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
            NewsMatch
          </h1>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden bg-gray-50/50">
        <AnimatePresence mode="wait">
          {activeView === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center p-6"
            >
              <div className="relative w-full h-full max-h-[600px] flex items-center justify-center">
                <AnimatePresence>
                  {newsStack.length > 0 ? (
                    newsStack.slice(0, 3).reverse().map((article, index) => {
                      const displayIndex = (newsStack.slice(0, 3).length - 1) - index;
                      return (
                        <NewsCard
                          key={article.id}
                          article={article}
                          isFront={displayIndex === 0}
                          index={displayIndex}
                          onSwipe={handleSwipe}
                        />
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-8 bg-white rounded-[40px] shadow-sm border border-gray-100 w-full"
                    >
                      <div className="bg-blue-50 p-6 rounded-full inline-block mb-4 text-blue-600">
                        <RotateCcw
                          size={40}
                          className="cursor-pointer hover:rotate-180 transition-transform duration-500"
                          onClick={handleReset}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">本日のニュースは以上です</h3>
                      <p className="text-sm text-gray-500 mb-6">新しい記事が届くまでお待ちください</p>
                      <button
                        onClick={handleReset}
                        className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold text-sm tracking-widest hover:bg-black transition-all"
                      >
                        最初から見る
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeView === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <SavedNewsView savedArticles={savedArticles} />
            </motion.div>
          )}

          {activeView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="h-full"
            >
              <ProfilePage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ボトムナビゲーション */}
      <nav className="bg-white border-t border-gray-100 px-6 py-3 pb-8 flex justify-around items-center">
        <BottomTab
          active={activeView === 'discover'}
          onClick={() => setActiveView('discover')}
          icon={<LayoutGrid size={24} />}
          label="発見"
          color="blue"
        />
        <BottomTab
          active={activeView === 'saved'}
          onClick={() => setActiveView('saved')}
          icon={<Bookmark size={24} />}
          label="保存済み"
          color="red"
        />
        <BottomTab
          active={activeView === 'profile'}
          onClick={() => setActiveView('profile')}
          icon={<UserIcon size={24} />}
          label="アカウント"
          color="indigo"
        />
      </nav>
    </div>
  );
}

interface BottomTabProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: 'blue' | 'red' | 'indigo';
}

const BottomTab: React.FC<BottomTabProps> = ({ active, onClick, icon, label, color }) => {
  const colors = {
    blue: active ? "text-blue-600" : "text-gray-400",
    red: active ? "text-red-500" : "text-gray-400",
    indigo: active ? "text-indigo-600" : "text-gray-400",
  };

  const bgColors = {
    blue: active ? "bg-blue-50" : "group-hover:bg-gray-50",
    red: active ? "bg-red-50" : "group-hover:bg-gray-50",
    indigo: active ? "bg-indigo-50" : "group-hover:bg-gray-50",
  };

  return (
    <button
      onClick={onClick}
      className={cn("flex flex-col items-center gap-1 group transition-all", colors[color])}
    >
      <div className={cn("p-2 rounded-2xl transition-all", bgColors[color])}>
        {icon}
      </div>
      <span className="text-[10px] font-bold tracking-tighter">{label}</span>
    </button>
  );
};

export default App;
