import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  RotateCcw, 
  Shuffle, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Sparkle,
  BookOpen,
  Info
} from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardPlayerProps {
  cards: Flashcard[];
  onMarkMastered: (id: string, mastered: boolean) => void;
  masteredIds: string[];
}

export const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({
  cards,
  onMarkMastered,
  masteredIds,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [shuffleMode, setShuffleMode] = useState<boolean>(false);
  const [playOrder, setPlayOrder] = useState<number[]>(() => cards.map((_, i) => i));

  // Reset indices if the cards list changes
  React.useEffect(() => {
    if (currentIndex >= cards.length) {
      setCurrentIndex(0);
    }
    setPlayOrder(cards.map((_, i) => i));
  }, [cards.length]);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="p-4 bg-amber-50 text-amber-500 rounded-full mb-4">
          <BookOpen className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-medium text-slate-800 mb-2">ไม่พบคำศัพท์ในคลัง</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          กรุณาเพิ่มคำศัพท์ใหม่ผ่านแท็บ "จัดการคำศัพท์" เพื่อเริ่มต้นทบทวน
        </p>
      </div>
    );
  }

  const currentCardIndex = playOrder[currentIndex] < cards.length ? playOrder[currentIndex] : 0;
  const card = cards[currentCardIndex] || cards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 200);
  };

  const handleShuffleToggle = () => {
    const newShuffle = !shuffleMode;
    setShuffleMode(newShuffle);
    if (newShuffle) {
      // Create shuffled order
      const shuffled = [...Array(cards.length).keys()].sort(() => Math.random() - 0.5);
      setPlayOrder(shuffled);
      setCurrentIndex(0);
    } else {
      // Standard order
      setPlayOrder(cards.map((_, i) => i));
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  };

  const handleResetProgress = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
    if (shuffleMode) {
      const shuffled = [...Array(cards.length).keys()].sort(() => Math.random() - 0.5);
      setPlayOrder(shuffled);
    } else {
      setPlayOrder(cards.map((_, i) => i));
    }
  };

  const speak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation(); // Prevent card flip when clicking audio
    if ('speechSynthesis' in window) {
      // Cancel outstanding speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly slower for clear pronunciation
      window.speechSynthesis.speak(utterance);
    } else {
      alert('เบราว์เซอร์ของคุณไม่รองรับการออกเสียงอัตโนมัติ (Text-to-Speech)');
    }
  };

  // Color mappings for parts of speech
  const getBadgeColor = (pos: string) => {
    switch (pos.toLowerCase()) {
      case 'noun':
        return 'bg-indigo-50 border-indigo-100 text-indigo-600';
      case 'verb':
        return 'bg-emerald-50 border-emerald-100 text-emerald-600';
      case 'adjective':
      case 'adj':
        return 'bg-amber-50 border-amber-100 text-amber-600';
      case 'adverb':
      case 'adv':
        return 'bg-pink-50 border-pink-100 text-pink-600';
      case 'pronoun':
        return 'bg-cyan-50 border-cyan-100 text-cyan-600';
      case 'preposition':
        return 'bg-teal-50 border-teal-100 text-teal-600';
      default:
        return 'bg-slate-50 border-slate-100 text-slate-600';
    }
  };

  const isMastered = masteredIds.includes(card.id);

  return (
    <div className="flex flex-col items-center">
      {/* Top Banner Settings */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 text-sm">
        <span className="font-mono text-slate-500 font-medium bg-slate-100/70 border border-slate-200/50 rounded-full px-3 py-1">
          คำศัพท์ที่ {currentIndex + 1} จาก {cards.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleShuffleToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
              shuffleMode 
                ? 'bg-purple-50 text-purple-600 border-purple-200 shadow-sm' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="สุ่มลำดับคำศัพท์"
            id="toggle_shuffle_btn"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="font-medium text-xs">สุ่มสลับ</span>
          </button>
          
          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 cursor-pointer"
            title="เริ่มทบทวนรอบใหม่"
            id="reset_cycle_btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="font-medium text-xs">เริ่มใหม่</span>
          </button>
        </div>
      </div>

      {/* 3D Flashcard Section */}
      <div 
        style={{ perspective: 1500 }} 
        className="w-full max-w-md h-[400px] mb-8 cursor-pointer relative group"
        onClick={handleFlip}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-full h-full relative"
        >
          {/* FRONT SIDE */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className={`absolute inset-0 w-full h-full bg-linear-to-br from-white to-slate-50 border-2 rounded-3xl p-8 shadow-xl flex flex-col justify-between transition-colors duration-500 ${
              isMastered ? 'border-amber-200 bg-amber-50/10' : 'border-slate-100'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border font-sans ${getBadgeColor(card.partOfSpeech)}`}>
                {card.partOfSpeech}
              </span>
              <div className="flex gap-2">
                {isMastered && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                    <Sparkle className="w-3.5 h-3.5 fill-amber-300 text-amber-500" />
                    จำได้แล้ว
                  </span>
                )}
                <button
                  onClick={(e) => speak(e, card.word)}
                  className="p-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-xl transition-all hover:scale-110 active:scale-90"
                  title="ฟังเสียงคำศัพท์"
                  id={`play_sound_front_${card.id}`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-center my-auto px-2">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 break-words mb-2">
                {card.word}
              </h1>
              <p className="text-xs text-slate-400 mt-2">
                คลิกที่การ์ดเพื่อดูเฉลย
              </p>
            </div>

            <div className="flex justify-center items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span>แตะเพื่อพลิกการ์ด</span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
            className="absolute inset-0 w-full h-full bg-slate-900 border-2 border-slate-800 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-700/50 bg-slate-800 text-slate-300 font-sans`}>
                {card.partOfSpeech}
              </span>
              <button
                onClick={(e) => speak(e, card.word)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all hover:scale-110 active:scale-90"
                title="ฟังเสียงคำศัพท์"
                id={`play_sound_back_${card.id}`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="my-auto text-center px-2 flex flex-col gap-4">
              <div>
                <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">คำแปล</span>
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent break-words leading-relaxed">
                  {card.meaning}
                </p>
              </div>

              {card.example && (
                <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 text-left">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                    <Info className="w-3 h-3 text-emerald-400" />
                    ประโยคตัวอย่าง
                  </span>
                  <p className="text-sm md:text-sm text-slate-200 font-medium leading-relaxed italic break-words">
                    "{card.example}"
                  </p>
                  <button
                    onClick={(e) => speak(e, card.example)}
                    className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors font-medium ml-auto"
                    id={`play_example_sound_${card.id}`}
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>ฟังประโยค</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-center items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>แตะเพื่อพลิกกลับ</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Controls */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Navigation Buttons */}
        <div className="flex gap-4 items-center justify-between">
          <button
            onClick={handlePrev}
            className="flex-1 flex items-center justify-center gap-1 px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-all hover:-translate-x-1 duration-200 ease-out active:scale-95 cursor-pointer"
            id="prev_card_btn"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ก่อนหน้า</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-1 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-150 transition-all hover:translate-x-1 duration-200 ease-out active:scale-95 cursor-pointer"
            id="next_card_btn"
          >
            <span>ถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Self Assessment / Mastered button */}
        <div className="flex border-t border-slate-100 pt-5 mt-2 justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkMastered(card.id, false);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
              !isMastered
                ? 'bg-slate-50 text-slate-400 border-slate-100 opacity-60'
                : 'bg-white text-rose-500 border-rose-200 hover:bg-rose-50'
            }`}
            id="mark_review_btn"
          >
            <X className="w-3.5 h-3.5" />
            <span>ยังทวนซ้ำ / ไม่แม่นยำ</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkMastered(card.id, true);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
              isMastered
                ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'
            }`}
            id="mark_mastered_btn"
          >
            <Check className="w-3.5 h-3.5" />
            <span>แม่นยำ / จำได้แล้ว!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
