import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Bookmark } from 'lucide-react';
import type { NewsArticle } from '../types/news';

interface NewsDetailModalProps {
    article: NewsArticle | null;
    onClose: () => void;
}

/**
 * ニュース詳細表示用モーダルコンポーネント
 * AIによる要約をメインに表示し、リッチな詳細本文を提供します
 */
export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose }) => {
    if (!article) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-xl flex items-end sm:items-center justify-center overflow-hidden"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 250 }}
                    className="bg-white w-full max-w-lg h-[92vh] sm:h-auto sm:max-h-[85vh] rounded-t-[48px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.3)]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ヘッダー画像エリア */}
                    <div className="relative h-60 shrink-0 group bg-gray-50 flex justify-center items-center">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="max-w-xs sm:max-w-sm h-48 object-cover rounded-[32px] shadow-2xl transition-transform duration-1000 group-hover:scale-105"
                        />

                        {/* 閉じるボタン */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md hover:bg-white rounded-full text-gray-900 shadow-lg transition-all active:scale-90 z-10"
                        >
                            <X size={20} />
                        </button>

                        {/* カテゴリタグ */}
                        <div className="absolute bottom-4 left-8 flex items-center gap-3">
                            <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20">
                                {article.category}
                            </span>
                        </div>
                    </div>

                    {/* コンテンツエリア */}
                    <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 no-scrollbar">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-gray-400">
                                <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-widest">
                                    <Calendar size={14} className="text-blue-500" />
                                    {article.publishedAt.replace(/-/g, '/')}
                                </div>
                                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                <div className="text-[11px] font-black uppercase tracking-[0.2em]">{article.source}</div>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">
                                {article.title}
                            </h2>
                        </div>

                        {/* AI要約セクション */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-[40px] p-8 border border-blue-100/50 relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000">
                                <Bookmark size={120} className="text-blue-600" />
                            </div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex gap-1">
                                    <span className="w-1 h-3 bg-blue-600 rounded-full" />
                                    <span className="w-1 h-3 bg-blue-400 rounded-full" />
                                    <span className="w-1 h-3 bg-blue-200 rounded-full" />
                                </div>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em]">AI SUMMARY ANALYSIS</span>
                            </div>
                            <p className="text-gray-900 leading-relaxed font-bold text-xl tracking-tight">
                                {article.summary}
                            </p>
                        </div>

                        {/* 本文詳細 */}
                        <div className="space-y-6 pb-12">
                            <div className="flex items-center gap-4">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">詳細レポート</h3>
                                <div className="h-px bg-gray-100 flex-1"></div>
                            </div>
                            <div className="text-gray-600 leading-[2.2] font-medium text-[15px] space-y-6">
                                {article.content ? (
                                    article.content.split('\n\n').map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))
                                ) : (
                                    <p>このニュースの詳細な背景情報は現在AIによって解析されています。事実関係の統合と最新の市場動向を反映した包括的なレポートを準備中です。</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* アクションバー */}
                    <div className="p-8 bg-white border-t border-gray-50 flex gap-4 shrink-0">
                        <button
                            onClick={onClose}
                            className="flex-1 h-18 bg-gray-900 text-white rounded-[28px] font-black text-sm tracking-widest uppercase hover:bg-black active:scale-95 transition-all shadow-2xl shadow-gray-200"
                        >
                            閉じる
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
