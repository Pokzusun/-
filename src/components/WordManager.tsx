import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Sparkles, 
  BookOpen, 
  FileText, 
  HelpCircle,
  Tag,
  AlertCircle,
  CheckCircle,
  Undo2
} from 'lucide-react';
import { Flashcard } from '../types';

interface WordManagerProps {
  cards: Flashcard[];
  onAddCard: (card: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  onDeleteCard: (id: string) => void;
  onResetToDefault: () => void;
}

export const WordManager: React.FC<WordManagerProps> = ({
  cards,
  onAddCard,
  onDeleteCard,
  onResetToDefault,
}) => {
  // Form states
  const [word, setWord] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('adjective');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState('all');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!word.trim()) {
      setErrorMsg('กรุณากรอกคำศัพท์ภาษาอังกฤษ');
      return;
    }
    if (!meaning.trim()) {
      setErrorMsg('กรุณากรอกคำแปลภาษาไทย');
      return;
    }

    onAddCard({
      word: word.trim(),
      partOfSpeech,
      meaning: meaning.trim(),
      example: example.trim(),
    });

    // Clear form
    setWord('');
    setPartOfSpeech('adjective');
    setMeaning('');
    setExample('');
    setErrorMsg(null);

    // Show success message
    setSuccessMsg('บันทึกคำศัพท์เรียบร้อยแล้ว!');
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  const filteredCards = cards.filter((card) => {
    const matchesSearch = 
      card.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = posFilter === 'all' || card.partOfSpeech.toLowerCase() === posFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Add Form */}
      <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm sticky top-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">เพิ่มคำศัพท์ใหม่</h3>
            <p className="text-xs text-slate-400">สร้างความท้าทายด้วยคำศัพท์เฉพาะทางของคุณ</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-500" />
              คำศัพท์ภาษาอังกฤษ *
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="เช่น Extraordinary, Resilience"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white text-slate-800 font-medium text-sm transition-all shadow-xs"
              autoComplete="off"
              id="form_word"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3 text-indigo-500" />
              ประเภทของคำ (Part of Speech)
            </label>
            <select
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white text-slate-800 text-sm font-medium transition-all shadow-xs"
              id="form_part_of_speech"
            >
              <option value="noun">Noun (คำนาม)</option>
              <option value="verb">Verb (คำกริยา)</option>
              <option value="adjective">Adjective (คำคุณศัพท์)</option>
              <option value="adverb">Adverb (คำวิเศษณ์)</option>
              <option value="pronoun">Pronoun (คำสรรพนาม)</option>
              <option value="preposition">Preposition (คำบุพบท)</option>
              <option value="conjunction">Conjunction (คำสันธาน)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-indigo-500" />
              คำแปล / ความหมายภาษาไทย *
            </label>
            <input
              type="text"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="เช่น พิเศษ, ไม่ธรรมดา, ยืดหยุ่น"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white text-slate-800 font-medium text-sm transition-all shadow-xs"
              autoComplete="off"
              id="form_meaning"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <FileText className="w-3 h-3 text-indigo-500" />
              ประโยคตัวอย่างภาษาอังกฤษ (ถ้ามี)
            </label>
            <textarea
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="เช่น We need to adopt a flexible strategy to build resilience in our business."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white text-slate-800 text-sm transition-all resize-none shadow-xs"
              id="form_example"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl animate-bounce">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            id="submit_add_word"
          >
            <Plus className="w-4 h-4" />
            <span>บันทึกคำศัพท์ลงคลัง</span>
          </button>
        </form>
      </div>

      {/* RIGHT: List view */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">คลังคำศัพท์ทั้งหมด ({cards.length})</h3>
            <p className="text-xs text-slate-400">ค้นหา แก้ไข และการจัดการการ์ดของคุณ</p>
          </div>

          <button
            onClick={onResetToDefault}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors text-xs font-medium cursor-pointer"
            id="reset_to_default_btn"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>รีเซ็ตคำสั่งเริ่มต้น</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาคำศัพท์ หรือ คำแปล..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white text-sm text-slate-600 transition-all font-medium"
              id="search_box"
            />
          </div>

          <select
            value={posFilter}
            onChange={(e) => setPosFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-600"
            id="filter_pos"
          >
            <option value="all">ทุกประเภทคำ</option>
            <option value="noun">Noun (คำนาม)</option>
            <option value="verb">Verb (คำกริยา)</option>
            <option value="adjective">Adjective (คุณศัพท์)</option>
            <option value="adverb">Adverb (กริยาวิเศษณ์)</option>
            <option value="pronoun">Pronoun</option>
            <option value="preposition">Preposition</option>
          </select>
        </div>

        {/* Scrollable table/list */}
        <div className="max-h-[500px] overflow-y-auto pr-1 space-y-2.5">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <div 
                key={card.id}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50/10 border border-slate-100 rounded-2xl transition-all"
                id={`vocab_item_${card.id}`}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-800 truncate text-sm">
                      {card.word}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-sm font-sans scale-90">
                      {card.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 truncate">
                    {card.meaning}
                  </p>
                  {card.example && (
                    <p className="text-[10px] text-slate-400 italic font-medium truncate mt-0.5">
                      "{card.example}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onDeleteCard(card.id)}
                  className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="ลบคำศัพท์"
                  id={`delete_btn_${card.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-slate-250 rounded-2xl">
              <p className="text-sm font-medium text-slate-400">ไม่พบคำศัพท์ที่ตรงกับเงื่อนไขค้นหา</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
