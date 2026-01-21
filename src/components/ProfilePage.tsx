import React, { useState } from 'react';
import { Calendar, MapPin, Bookmark, Edit2, Check, X, Copy } from 'lucide-react';
import type { NewsArticle } from '../types/news';
import { NewsDetailModal } from './NewsDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

// Helper for conditional class names
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

interface ProfilePageProps {
    savedArticles: NewsArticle[];
}

/**
 * ユーザープロフィールコンポーネント
 */
export const ProfilePage: React.FC<ProfilePageProps> = ({ savedArticles }) => {
    const [searchParams] = useSearchParams();
    const userid = searchParams.get('userid');
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const [profile, setProfile] = useState({
        name: userid === 'sample' ? 'サンプルユーザー' : (userid || 'ゲストユーザー'),
        bio: '最新のテクノロジーとサイエンスに興味があります。AIが変える未来を NewsMatch で追いかけています。🔭💻 #Tech #Science #Future',
        location: '東京, 日本',
        website: `newsmatch.jp/profile?userid=${userid || 'sample'}`
    });

    const [tempProfile, setTempProfile] = useState({ ...profile });

    const handleSave = () => {
        setProfile({ ...tempProfile });
        setIsEditing(false);
    };

    const copyProfileLink = () => {
        const url = `https://mattuu.com/new-maching/#/profile?userid=${userid || 'sample'}`;
        navigator.clipboard.writeText(url).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    // 全タグのリストを抽出
    const allTags = Array.from(new Set(savedArticles.map(a => a.tag)));

    // フィルタリング
    const filteredArticles = savedArticles.filter(article =>
        selectedTag ? article.tag === selectedTag : true
    );

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-y-auto no-scrollbar pb-10">
            {/* 詳細モーダル */}
            <NewsDetailModal
                article={selectedArticle}
                onClose={() => setSelectedArticle(null)}
            />

            {/* ヘッダーセクション */}
            <div className="relative bg-white pb-6 shadow-sm border-b border-gray-100">
                {/* カバーグラデーション（落ち着いたダークブルー系に修正） */}
                <div className="h-40 w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>

                <div className="px-6 -mt-16 flex flex-col items-center">
                    {/* アバター */}
                    <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-2xl relative z-10 overflow-hidden">
                        <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-slate-800 to-indigo-900 flex items-center justify-center text-white text-5xl font-black shadow-inner">
                            {profile.name.charAt(0)}
                        </div>
                    </div>

                    <div className="mt-6 text-center w-full max-sm px-4">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{profile.name}</h2>
                            <button
                                onClick={() => {
                                    setTempProfile({ ...profile });
                                    setIsEditing(true);
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                            >
                                <Edit2 size={18} />
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-3 mb-6">
                            <p className="text-sm font-medium text-gray-400 italic">{profile.website}</p>
                            <button
                                onClick={copyProfileLink}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                    isCopied ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                )}
                            >
                                {isCopied ? <Check size={12} /> : <Copy size={12} />}
                                {isCopied ? "Copied!" : "Copy Link"}
                            </button>
                        </div>

                        <p className="text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-2xl text-sm border border-gray-100 inline-block shadow-inner w-full">
                            {profile.bio}
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center gap-6 text-[13px] font-bold text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-blue-500" />
                            <span>{profile.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-indigo-500" />
                            <span>Joined Jan 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* セクションタイトル & タグフィルター */}
            <div className="px-6 pt-10 pb-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] shrink-0">あなたのセレクト</h3>
                    <div className="h-px bg-gray-200 flex-1 ml-4"></div>
                </div>

                {allTags.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        <button
                            onClick={() => setSelectedTag(null)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                                selectedTag === null
                                    ? "bg-gray-900 border-gray-900 text-white"
                                    : "bg-white border-gray-200 text-gray-400"
                            )}
                        >
                            All
                        </button>
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                                    selectedTag === tag
                                        ? "bg-indigo-600 border-indigo-600 text-white"
                                        : "bg-white border-gray-200 text-gray-400"
                                )}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ニュースリスト */}
            <div className="px-6 pb-20">
                {filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredArticles.map(article => (
                            <motion.div
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className="bg-white rounded-[32px] p-2 shadow-sm border border-gray-100 flex gap-4 cursor-pointer overflow-hidden transition-all group"
                            >
                                <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0">
                                    <img src={article.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                </div>
                                <div className="flex flex-col justify-center pr-4 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[9px] font-black text-white bg-indigo-600 px-2.5 py-0.5 rounded-full uppercase tracking-widest">{article.category}</span>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{article.source}</span>
                                    </div>
                                    <h4 className="text-base font-black text-gray-900 line-clamp-2 leading-tight tracking-tight mb-2">
                                        {article.title}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-indigo-400 font-black">#{article.tag}</span>
                                        <span className="text-[10px] text-gray-300 font-bold">{article.publishedAt.split('-').slice(1).join('/')}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <div className="bg-gray-50 p-6 rounded-full inline-block mb-4 text-gray-300">
                            <Bookmark size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-400">記事が見つかりません</h3>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-black">No articles match this tag</p>
                    </div>
                )}
            </div>

            {/* 編集モーダル */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl p-8"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">プロフィール編集</h3>
                                <button onClick={() => setIsEditing(false)} className="bg-gray-100 p-2 rounded-full text-gray-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">名前</label>
                                    <input
                                        type="text"
                                        value={tempProfile.name}
                                        onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                        className="w-full bg-gray-50 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">自己紹介</label>
                                    <textarea
                                        rows={4}
                                        value={tempProfile.bio}
                                        onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                                        className="w-full bg-gray-50 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-10 flex gap-4">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-gray-900 text-white h-16 rounded-[24px] font-black flex items-center justify-center gap-2 shadow-xl shadow-gray-200 hover:bg-black transition-all"
                                >
                                    <Check size={20} />
                                    保存する
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 h-16 bg-gray-100 text-gray-400 rounded-[24px] font-black"
                                >
                                    キャンセル
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
