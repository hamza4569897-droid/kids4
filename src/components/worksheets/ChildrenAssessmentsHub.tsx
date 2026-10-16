import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Printer,
  Download,
  Plus,
  BookOpen,
  CheckCircle2,
  Filter,
  FileText,
  ShieldCheck,
  ChevronRight,
  Star,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AgeGroup } from '../../types/worksheet';
import {
  ComprehensiveAssessment,
  PRESET_ASSESSMENTS
} from '../../data/worksheets/assessmentsData';
import { ChildrenAssessmentView } from './ChildrenAssessmentView';
import { ChildrenAssessmentBuilder } from './ChildrenAssessmentBuilder';
import { sounds } from '../../lib/audio';

export const ChildrenAssessmentsHub: React.FC = () => {
  // All assessments list (presets + any user-created assessments in session)
  const [assessmentsList, setAssessmentsList] = useState<ComprehensiveAssessment[]>(PRESET_ASSESSMENTS);

  // Active view: 'list' | 'view_assessment' | 'create_assessment'
  const [activeSubView, setActiveSubView] = useState<'list' | 'view_assessment' | 'create_assessment'>('list');
  const [selectedAssessment, setSelectedAssessment] = useState<ComprehensiveAssessment | null>(null);

  // Age filter
  const [filterAge, setFilterAge] = useState<AgeGroup | 'all'>('all');

  const filteredAssessments = assessmentsList.filter((a) => {
    if (filterAge === 'all') return true;
    return a.ageGroup === filterAge;
  });

  const handleOpenAssessment = (assessment: ComprehensiveAssessment) => {
    sounds.playPop();
    setSelectedAssessment(assessment);
    setActiveSubView('view_assessment');
  };

  const handleStartBuilder = () => {
    sounds.playPop();
    setActiveSubView('create_assessment');
  };

  const handleAssessmentCreated = (newAssessment: ComprehensiveAssessment) => {
    sounds.playSuccess();
    setAssessmentsList((prev) => [newAssessment, ...prev]);
    setSelectedAssessment(newAssessment);
    setActiveSubView('view_assessment');
  };

  const handlePrintQuick = (assessment: ComprehensiveAssessment, target: 'test' | 'guide') => {
    sounds.playPop();
    setSelectedAssessment(assessment);
    setActiveSubView('view_assessment');
    // Once open, user or automated print can trigger
  };

  // If in Assessment View
  if (activeSubView === 'view_assessment' && selectedAssessment) {
    return (
      <ChildrenAssessmentView
        assessment={selectedAssessment}
        onBack={() => {
          sounds.playPop();
          setActiveSubView('list');
          setSelectedAssessment(null);
        }}
      />
    );
  }

  // If in Assessment Builder
  if (activeSubView === 'create_assessment') {
    return (
      <ChildrenAssessmentBuilder
        onAssessmentCreated={handleAssessmentCreated}
        onCancel={() => {
          sounds.playPop();
          setActiveSubView('list');
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Assessment Showcase */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/30 text-amber-50">
            <Award className="w-3.5 h-3.5 text-yellow-200" />
            <span>قسم اختبارات الأطفال التقييمية والتشخيصية</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            اختبارات تشخيصية متعددة الأنشطة مع دليل تصحيح مستقل 🌟
          </h2>

          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            اختبارات تربوية مصممة خصيصاً لمرحلة الطفولة المبكرة (من عمر سنتين حتى ٦ سنوات). تجمع الورقة الواحدة بين
            أنشطة التوصيل، المطابقة، الأسئلة المصورة، العد، واكتشف المختلف، مع إمكانية طباعة أو تنزيل دليل تصحيح
            وسلم تقدير منفصل لولي الأمر والمعلم.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-bold">
            <span className="bg-black/20 px-3 py-1.5 rounded-xl border border-white/20">
              ✓ خالية من الضغط الزمني
            </span>
            <span className="bg-black/20 px-3 py-1.5 rounded-xl border border-white/20">
              ✓ تدعم الإشارة والتقييم الشفهي
            </span>
            <span className="bg-black/20 px-3 py-1.5 rounded-xl border border-white/20">
              ✓ دليل تصحيح وسلم درجات منفصل
            </span>
          </div>
        </div>

        {/* Action button to open Test Builder */}
        <div className="z-10 shrink-0 text-center space-y-2">
          <button
            onClick={handleStartBuilder}
            className="inline-flex items-center gap-2 bg-white text-amber-900 hover:bg-amber-50 font-black py-3.5 px-6 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 text-sm"
          >
            <Plus className="w-5 h-5 text-amber-600" />
            <span>إنشاء وتخصيص اختبار جديد 🛠️</span>
          </button>
          <span className="block text-[11px] text-amber-100">دمج أنشطة متعددة وتوليد دليل تصحيح فوري</span>
        </div>

        {/* Background decorative illustrations */}
        <div className="absolute left-[-20px] bottom-[-30px] opacity-15 text-9xl pointer-events-none select-none">
          📝
        </div>
      </div>

      {/* Filter and Age Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-amber-600" />
          <span>تصفية الاختبارات حسب الفئة العمرية:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-bold">
          <button
            onClick={() => {
              sounds.playPop();
              setFilterAge('all');
            }}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              filterAge === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            جميع الأعمار ({assessmentsList.length})
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setFilterAge('2-3');
            }}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              filterAge === '2-3'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            ٢ - ٣ سنوات
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setFilterAge('3-4');
            }}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              filterAge === '3-4'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            ٣ - ٤ سنوات
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setFilterAge('4-5');
            }}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              filterAge === '4-5'
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 text-sky-900 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            ٤ - ٥ سنوات
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setFilterAge('5-6');
            }}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              filterAge === '5-6'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            ٥ - ٦ سنوات
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-white rounded-3xl border-2 border-amber-200/80 hover:border-amber-400 p-6 shadow-xs hover:shadow-md transition space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  {assessment.ageGroupLabel}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {assessment.totalPoints} درجات · {assessment.sections.length} أنشطة مدمجة
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-lg font-black text-slate-900 hover:text-amber-700 transition">
                  {assessment.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{assessment.subtitle}</p>
              </div>

              {/* Activities Included in this test */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 block">
                  الأنشطة المدمجة داخل هذا الاختبار:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {assessment.sections.map((sec) => (
                    <span
                      key={sec.id}
                      className="text-[11px] font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      {sec.typeLabel}
                    </span>
                  ))}
                </div>
              </div>

              {/* Target Skills */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-slate-500 block">المهارات المقاسة:</span>
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                  {assessment.targetSkills.slice(0, 3).map((sk, i) => (
                    <span key={i} className="bg-amber-50 text-amber-950 px-2 py-0.5 rounded-md">
                      • {sk}
                    </span>
                  ))}
                  {assessment.targetSkills.length > 3 && (
                    <span className="text-slate-400 font-bold">
                      +{assessment.targetSkills.length - 3} أخرى
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>يتضمن دليل تصحيح منفصل</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleOpenAssessment(assessment)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>معاينة وطباعة</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guide & Pedagogical Quality Note */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3>ميثاق التقييم التربوي الإيجابي للأطفال في منصة عالم الصغار</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold">١. التقييم كأداة اكتشاف:</strong>
            <span>الهدف هو معرفة شغف الطفل ونقاط قوته النمائية وليس إصدار أحكام نجاح ورسوب.</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold">٢. مراعاة المهارات الشفهية:</strong>
            <span>نسمح للطفل الأصغر بالإشارة أو التسمية الشفهية دون إلزامه بمسك القلم.</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-bold">٣. دليل التصحيح المنفصل:</strong>
            <span>دليل خاص بالمعلم وولي الأمر يوضح إجابات الأنشطة وسلم التقدير لتوفير خطة دعم مستمرة.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
