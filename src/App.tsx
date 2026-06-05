import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Settings, 
  Sparkle, 
  Trophy, 
  GraduationCap, 
  Bookmark, 
  Zap,
  RotateCcw
} from 'lucide-react';

import { Flashcard } from './types';
import { INITIAL_VOCABULARY } from './data';
import { FlashcardPlayer } from './components/FlashcardPlayer';
import { WordManager } from './components/WordManager';

export default function App() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'practice' | 'manage'>('practice');

  // Load from LocalStorage
  useEffect(() => {
    const savedCards = localStorage.getItem('fc_vocabularies');
    const savedMastered = localStorage.getItem('fc_mastered_ids');

    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (e) {
        setCards(INITIAL_VOCABULARY);
      }
    } else {
      setCards(INITIAL_VOCABULARY);
      localStorage.setItem('fc_vocabularies', JSON.stringify(INITIAL_VOCABULARY));
    }

    if (savedMastered) {
      try {
        setMasteredIds(JSON.parse(savedMastered));
      } catch (e) {
        setMasteredIds([]);
      }
    }
  }, []);

  // Sync cards changes to LocalStorage
  const saveCards = (updatedCards: Flashcard[]) => {
    setCards(updatedCards);
    localStorage.setItem('fc_vocabularies', JSON.stringify(updatedCards));
  };

  // Sync mastered status to LocalStorage
  const handleMarkMastered = (id: string, mastered: boolean) => {
    let updated: string[];
    if (mastered) {
      if (!masteredIds.includes(id)) {
        updated = [...masteredIds, id];
      } else {
        updated = masteredIds;
      }
    } else {
      updated = masteredIds.filter(mid => mid !== id);
    }
    setMasteredIds(updated);
    localStorage.setItem('fc_mastered_ids', JSON.stringify(updated));
  };

  const handleAddCard = (newCardData: Omit<Flashcard, 'id' | 'createdAt'>) => {
    const newCard: Flashcard = {
      ...newCardData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now()
    };
    const updated = [newCard, ...cards];
    saveCards(updated);
  };

  const handleDeleteCard = (id: string) => {
    const updated = cards.filter(card => card.id !== id);
    saveCards(updated);
    // Also remove from mastered if present
    const updatedMastered = masteredIds.filter(mid => mid !== id);
    setMasteredIds(updatedMastered);
    localStorage.setItem('fc_mastered_ids', JSON.stringify(updatedMastered));
  };

  const handleResetToDefault = () => {
    saveCards(INITIAL_VOCABULARY);
    setMasteredIds([]);
    localStorage.setItem('fc_mastered_ids', JSON.stringify([]));
  };

  const masteredCount = cards.filter(c => masteredIds.includes(c.id)).length;
  const masteryPercentage = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  // Encouragement messages based on success percentage
  const getEncouragement = () => {
    if (cards.length === 0) return 'ยังไม่มีคำศัพท์ในคลังเลย เริ่มต้นโดยการเพิ่มคำศัพท์กัน!';
    if (masteryPercentage === 100) return 'ยอดเยี่ยมที่สุด! คุณจำคำศัพท์ในคลังได้หมดทุกคำแล้ว 🎉';
    if (masteryPercentage >= 70) return 'เก่งสุดๆ! ใกล้จำได้ครบทุกคำแล้ว พยายามอีกนิดนะ! 💪';
    if (masteryPercentage >= 40) return 'ก้าวหน้าไปเยอะเลย! มาลุยคำที่เหลือกันต่อ 🚀';
    if (masteryPercentage > 0) return 'เยี่ยมมาก! สมองเริ่มจำรหัสคำศัพท์ได้แล้ว ทบทวนบ่อยๆ นะ 😊';
    return 'ยินดีต้อนรับ! ท่องคำจำศัพท์และกด "แม่นยำแล้ว" เพื่อบันทึกความก้าวหน้าของคุณ';
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 transition-colors duration-200 selection:bg-indigo-150 py-10 px-4 md:px-8">
      {/* Container */}
      <div className="max-w-4xl mx-auto">
        
        {/* Header Branding */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2.5 px-4 py-1.5 bg-indigo-50/75 border border-indigo-100 rounded-full text-indigo-600">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-bold tracking-wider uppercase font-sans">Interactive Practice Deck</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 mb-3 font-sans">
            การ์ดคำศัพท์พลิกได้ <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">Flashcard Play</span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            เปลี่ยนการท่องจำน่าเบื่อให้กลายเป็นการเรียนรู้เชิงโต้ตอบ 3D ช่วยกระตุ้นความจำ และสร้างคลังคำประดับสมองแบบถาวร
          </p>
        </header>

        {/* Dashboard Progress Panel (Warm Card styled to match mood-first principle) */}
        {cards.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-yellow-100/50 rounded-3xl p-6 shadow-sm mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-8 -mt-8 opacity-40 blur-xs"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              
              <div className="flex items-center gap-4 text-left w-full md:w-auto">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl flex-shrink-0 animate-pulse">
                  <Trophy className="w-6 h-6 fill-amber-100" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">เป้าหมายจำคำศัพท์</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-md">
                    {getEncouragement()}
                  </p>
                </div>
              </div>

              {/* Progress Circle or Bar */}
              <div className="w-full md:w-48 text-left md:text-right flex-shrink-0">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-xs text-slate-400 font-semibold font-sans uppercase">ความถนัดรวม</span>
                  <span className="text-lg font-bold text-indigo-600 font-mono">
                    {masteredCount}/{cards.length}คำ ({masteryPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${masteryPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-linear-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                  />
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* Tabs Segmented Switch Control */}
        <div className="flex justify-center mb-8 relative">
          <div className="flex p-1 bg-slate-150/70 backdrop-blur-md rounded-2xl border border-slate-200/50">
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'practice'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id="tab_practice"
            >
              <Bookmark className={`w-4 h-4 ${activeTab === 'practice' ? 'text-indigo-600 fill-indigo-100' : ''}`} />
              <span>โหมดทบทวนคำศัพท์</span>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'manage'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id="tab_manage"
            >
              <Settings className={`w-4 h-4 ${activeTab === 'manage' ? 'text-indigo-600 animate-spin-slow' : ''}`} />
              <span>จัดการคลังคำศัพท์</span>
            </button>
          </div>
        </div>

        {/* Render Tab Screens with Smooth Fade Animations */}
        <main className="min-h-[460px] relative">
          <AnimatePresence mode="wait">
            {activeTab === 'practice' ? (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                id="view_practice"
              >
                <FlashcardPlayer 
                  cards={cards} 
                  onMarkMastered={handleMarkMastered}
                  masteredIds={masteredIds}
                />
              </motion.div>
            ) : (
              <motion.div
                key="manage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                id="view_manage"
              >
                <WordManager 
                  cards={cards}
                  onAddCard={handleAddCard}
                  onDeleteCard={handleDeleteCard}
                  onResetToDefault={handleResetToDefault}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer & Brief Instruction */}
        <footer className="mt-16 text-center text-xs text-slate-400 font-medium">
          <p className="mb-2">💡 ทริค: ฝึกฟังการออกเสียงและฝึกพูดตามเพื่อกระตุ้นสมองส่วนความจำระยะยาว</p>
          <p>© 2026 Interactive Flashcards. ออกแบบด้วยหัวใจเพื่อผลลัพธ์การจำที่ดีขึ้น</p>
        </footer>

      </div>
    </div>
  );
}
