import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import type { NewsArticle } from '../types/news';
import { Heart, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface NewsCardProps {
    article: NewsArticle;
    onSwipe: (direction: 'left' | 'right') => void;
    isFront: boolean;
    index: number;
}

/**
 * ニュースカードコンポーネント
 */
export const NewsCard: React.FC<NewsCardProps> = ({ article, onSwipe, isFront, index }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

    // スワイプ時のアイコン表示制御
    const likeOpacity = useTransform(x, [50, 150], [0, 1]);
    const dislikeOpacity = useTransform(x, [-50, -150], [0, 1]);

    // 重なり具合の調整（より上に見えるように）
    const scale = isFront ? 1 : 1 - (index * 0.03);
    const yOffset = isFront ? 0 : index * -25;

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe('right');
        } else if (info.offset.x < -100) {
            onSwipe('left');
        }
        x.set(0);
    };

    if (!article) return null;

    return (
        <motion.div
            style={{
                x,
                rotate,
                opacity: isFront ? opacity : 1,
                zIndex: 50 - index,
                y: yOffset,
                scale: scale,
            }}
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className={cn(
                "absolute w-full h-[75vh] max-h-[600px] rounded-[40px] overflow-hidden shadow-2xl bg-white touch-none cursor-grab active:cursor-grabbing border border-gray-100",
                !isFront && "pointer-events-none"
            )}
        >
            {/* サイドのドラッグ用ヒントカラー */}
            {isFront && (
                <>
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-red-400/20 to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-green-400/20 to-transparent pointer-events-none" />
                </>
            )}

            {/* 背景画像 */}
            <div className="relative h-3/5 w-full">
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* タグ表示 */}
                <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                        {article.tag}
                    </span>
                </div>

                {/* スワイプ時のステータス表示 */}
                <motion.div style={{ opacity: likeOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-green-500/90 p-8 rounded-full shadow-lg">
                        <Heart size={60} className="text-white fill-current" />
                    </div>
                </motion.div>
                <motion.div style={{ opacity: dislikeOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-red-500/90 p-8 rounded-full shadow-lg">
                        <X size={60} className="text-white" />
                    </div>
                </motion.div>
            </div>

            {/* テキストコンテンツ */}
            <div className="p-8 flex flex-col h-2/5 justify-between">
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{article.category}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{article.source}</span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
                        {article.title}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 line-clamp-3 leading-relaxed">
                        {article.summary}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
