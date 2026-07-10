import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/MainLayout";
import { Pill } from "../../components/Pill";
import {
  useGetTest,
  useSubjects,
  useTopics,
  useMultiTopicsSubTopics,
  useFetchBulkQuestions,
} from "../../hooks/apiHooks";
import {
  ChevronLeft,
  Award,
  Clock,
  HelpCircle,
  Check,
  Pen,
} from "lucide-react";
import type { ApiQuestion } from "../../hooks/apiHooks";
import {
  isUuid,
  getDifficultyColor,
  formatType,
  getStatusStyle,
} from "../../utils/helper";

const TestView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: testData, isLoading } = useGetTest(id || "");

  // Dynamic Metadata Fetching for Subject & Topics display mappings
  const { data: subjects = [] } = useSubjects();

  const subjectId = testData?.subject
    ? subjects.find(
        (s) => s.id === testData.subject || s.name === testData.subject,
      )?.id || (isUuid(testData.subject) ? testData.subject : "")
    : "";

  const { data: topics = [] } = useTopics(subjectId);
  const testTopicIds = testData?.topics || [];

  // Resolve topic names to UUIDs for sub-topics fetching
  const resolvedTopicIds = testTopicIds
    .map(
      (tid) =>
        topics.find((t) => t.id === tid || t.name === tid)?.id ||
        (isUuid(tid) ? tid : ""),
    )
    .filter(Boolean);

  const { data: subTopicsList = [] } =
    useMultiTopicsSubTopics(resolvedTopicIds);

  // Extract question IDs if they are strings, otherwise they might be full objects
  const rawQuestions = (testData?.questions as (string | ApiQuestion)[]) || [];
  const questionIds = rawQuestions.filter(
    (q): q is string => typeof q === "string",
  );

  // Fetch full details if we only have IDs
  const { data: bulkQuestions, isLoading: isBulkLoading } =
    useFetchBulkQuestions(questionIds);

  if (isLoading || (questionIds.length > 0 && isBulkLoading)) {
    return (
      <MainLayout>
        <div className="space-y-6 p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-9 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-9 w-36 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#d9e5f7]">
            <div className="space-y-2 flex-1">
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
              <div className="h-7 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#d9e5f7] space-y-4">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#d9e5f7] space-y-6">
            <div className="h-5 w-24 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-100 rounded-xl"></div>
              <div className="h-20 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!testData) {
    return (
      <MainLayout>
        <div className="flex h-[calc(100vh-60px)] items-center justify-center bg-[#f8fafc] p-4 text-center">
          <div className="max-w-md bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
            <p className="text-red-500 font-semibold mb-4">Test not found</p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-[#1f59da] text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#1a4bbb]"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const resolvedQuestions: ApiQuestion[] =
    questionIds.length > 0
      ? bulkQuestions || []
      : (rawQuestions as ApiQuestion[]);

  const totalQuestions = resolvedQuestions.length;

  const subjectDisplayName =
    subjects.find((s) => s.id === subjectId)?.name || testData.subject;
  const topicsDisplayName = testTopicIds
    .map((tId) => topics.find((t) => t.id === tId)?.name || tId)
    .join(", ");

  const subTopicsDisplayName =
    testData.sub_topics
      ?.map(
        (stId: string) =>
          subTopicsList.find((st) => st.id === stId)?.name || stId,
      )
      .join(", ") || "Application";

  return (
    <MainLayout>
      <div className="space-y-6 pb-12 p-4 md:p-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-750 cursor-pointer bg-white px-3.5 py-2 rounded-lg border border-gray-150 shadow-2xs hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <button
            onClick={() => navigate(`/tests/editor/${testData.id}`)}
            className="flex items-center gap-2 text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue-hover px-4 py-2 rounded-lg shadow-sm cursor-pointer transition-colors animate-in fade-in duration-100"
          >
            <Pen className="h-4 w-4" />
            Edit Test & Questions
          </button>
        </div>

        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#d9e5f7]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#0b1b3e] text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                {formatType(testData.type)}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyle(testData.status)}`}
              >
                {testData.status === "active" || testData.status === "live"
                  ? "Live"
                  : testData.status || "Draft"}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">{testData.name}</h1>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#6b7280]">
            <div className="flex items-center gap-1.5 border border-gray-250 rounded-lg px-2.5 py-1.5 bg-white shadow-2xs">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span>{testData.total_time || 60} Min</span>
            </div>
            <div className="flex items-center gap-1.5 border border-gray-250 rounded-lg px-2.5 py-1.5 bg-white shadow-2xs">
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              <span>{totalQuestions} Questions</span>
            </div>
            <div className="flex items-center gap-1.5 border border-gray-250 rounded-lg px-2.5 py-1.5 bg-white shadow-2xs">
              <Award className="h-3.5 w-3.5 text-gray-400" />
              <span>{testData.total_marks || totalQuestions * 5} Marks</span>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#d9e5f7] space-y-4">
          <h2 className="text-sm font-bold text-gray-850 border-b border-gray-50 pb-2">
            Test Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Subject</span>
                <span className="text-gray-300 mr-2">:</span>
                <span className="text-gray-700">{subjectDisplayName}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-400 w-24">Topic(s)</span>
                <span className="text-gray-300 mr-2">:</span>
                <div className="flex flex-wrap gap-1">
                  {topicsDisplayName ? (
                    topicsDisplayName
                      .split(",")
                      .map((t) => (
                        <Pill key={t} text={t.trim()} variant="yellow" />
                      ))
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Sub Topic</span>
                <span className="text-gray-300 mr-2">:</span>
                <Pill text={subTopicsDisplayName} variant="yellow" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Difficulty Level</span>
                <span className="text-gray-300 mr-2">:</span>
                <span
                  className={`${getDifficultyColor(testData.difficulty)} text-[10px] font-semibold px-2.5 py-0.5 rounded-lg flex items-center gap-1 capitalize w-fit`}
                >
                  <Award className="h-2.5 w-2.5" />
                  {testData.difficulty || "Easy"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Correct Marks</span>
                <span className="text-gray-300 mr-2">:</span>
                <span className="text-emerald-600 font-bold">
                  +{testData.correct_marks || 4}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Negative Marks</span>
                <span className="text-gray-300 mr-2">:</span>
                <span className="text-red-500 font-bold">
                  {testData.wrong_marks || 1}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions list */}
        <div className="bg-white p-6 rounded-2xl border border-[#d9e5f7] space-y-6">
          <h2 className="text-base font-bold text-gray-800 border-b border-gray-50 pb-3">
            Questions List ({totalQuestions})
          </h2>
          {totalQuestions === 0 ? (
            <div className="text-center py-8 text-gray-400 font-medium text-sm">
              No questions found for this test.
            </div>
          ) : (
            <div className="space-y-6 divide-y divide-gray-100">
              {resolvedQuestions.map((q, idx) => (
                <div key={q.id || idx} className="pt-6 first:pt-0 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="font-semibold text-sm text-gray-800 flex items-start gap-3">
                      <span className="bg-[#f0f4fe] px-2 py-0.5 rounded text-xs text-[#1f59da] font-extrabold border border-[#d9e5f7] shrink-0">
                        Q{idx + 1}
                      </span>
                      <div
                        className="prose prose-sm max-w-none text-gray-850 question-html"
                        dangerouslySetInnerHTML={{ __html: q.question }}
                      />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase bg-gray-50 text-gray-400 px-2 py-0.5 rounded border border-gray-100 shrink-0">
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Options list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pl-10">
                    {[q.option1, q.option2, q.option3, q.option4].map(
                      (opt, oIdx) => {
                        const isCorrect =
                          q.correct_option === `option${oIdx + 1}`;
                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                              isCorrect
                                ? "bg-emerald-50/50 border-emerald-300 text-emerald-800 font-bold"
                                : "border-gray-150 text-gray-650 bg-gray-50/30"
                            }`}
                          >
                            <div
                              className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                                isCorrect
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-gray-300"
                              }`}
                            >
                              {isCorrect && (
                                <Check className="h-3 w-3" strokeWidth={3} />
                              )}
                            </div>
                            <span>{opt}</span>
                          </div>
                        );
                      },
                    )}
                  </div>

                  {q.explanation && (
                    <div className="mt-2 pl-10 text-xs text-gray-500 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <span className="font-bold text-gray-700 block mb-1">
                        Explanation:
                      </span>
                      <div
                        className="question-html"
                        dangerouslySetInnerHTML={{ __html: q.explanation }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TestView;
