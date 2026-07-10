import { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./utils/helper";
import LoginPage from "./features/auth/LoginPage";
import MainLayout from "./components/MainLayout";
import TestList from "./features/test-cases/TestList";
import type { Test } from "./features/test-cases/TestList";
import type { QuestionItem } from "./features/test-cases/TestEditor";
import { ClipboardCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useTests,
  useGetTest,
  useFetchBulkQuestions,
  useDeleteTest,
} from "./hooks/apiHooks";
import type { ApiTest, ApiQuestion } from "./hooks/apiHooks";

const TestCreationForm = lazy(
  () => import("./features/test-cases/TestCreationForm"),
);
const TestEditor = lazy(() => import("./features/test-cases/TestEditor"));
const TestPublish = lazy(() => import("./features/test-cases/TestPublish"));
const TestView = lazy(() => import("./features/test-cases/TestView"));

const TestListWrapper = () => {
  const queryClient = useQueryClient();
  const { data: apiTests, isLoading: isTestsLoading } = useTests();
  const navigate = useNavigate();
  const deleteTestMutation = useDeleteTest();

  const handleDeleteTest = (id: string) => {
    deleteTestMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tests"] });
      },
    });
  };

  if (isTestsLoading) {
    return (
      <MainLayout>
        <div className="space-y-6 animate-pulse">
          {/* Top Banner / Actions Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#d9e5f7] shadow-xs">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
              <div className="h-4 w-64 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-10 w-40 bg-gray-200 rounded-xl"></div>
          </div>

          {/* Search bar skeleton */}
          <div className="h-12 w-1/2"></div>

          {/* Grid of Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="relative flex flex-col bg-white rounded-2xl border border-[#d9e5f7] p-5 space-y-4"
              >
                {/* Top Pill / Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-gray-200 rounded-lg"></div>
                    <div className="h-7 w-7 bg-gray-200 rounded-lg"></div>
                    <div className="h-7 w-7 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>

                {/* Title */}
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-gray-200 rounded-md"></div>
                  <div className="h-5 w-40 bg-gray-200 rounded-lg"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Details layout with gray labels and colon alignment */}
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center">
                      <div className="w-16 h-3.5 bg-gray-200 rounded"></div>
                      <span className="text-gray-300 mx-2">:</span>
                      <div className="h-3.5 w-24 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // Map API tests to UI test format
  const tests: Test[] = (apiTests || []).map((t: ApiTest) => ({
    id: t.id,
    name: t.name,
    subject: t.subject,
    topics: t.topics,
    status: t.status
      ? ((t.status?.charAt(0)?.toUpperCase() + t.status.slice(1)) as
          | "Active"
          | "Draft"
          | "Completed")
      : "Active",
    createdDate: t.created_at
      ? t.created_at.split("T")[0]
      : new Date().toISOString().split("T")[0],
    questionsCount: t.total_questions || 25,
    duration: t.total_time || 60,
    type: t.type,
    difficulty: t.difficulty,
  }));

  return (
    <MainLayout>
      <TestList
        tests={tests}
        onDelete={handleDeleteTest}
        onEditStart={(id) => navigate(`/tests/edit/${id}`)}
        onCreateNew={() => navigate("/tests/create")}
      />
    </MainLayout>
  );
};

const TestCreationWrapper = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "Chapterwise" | "PYQ" | "Mock Test"
  >("Chapterwise");

  const formatBreadcrumbTab = (tab: string) => {
    if (tab === "Chapterwise") return "Chapter Wise";
    if (tab === "PYQ") return "PYQ";
    if (tab === "Mock Test") return "Mock Test";
    return tab;
  };

  return (
    <MainLayout
      customBreadcrumbs={[
        "Test Creation",
        "Create Test",
        formatBreadcrumbTab(activeTab),
      ]}
    >
      <TestCreationForm
        onCancel={() => navigate("/")}
        onTabChange={setActiveTab}
        onSubmit={(newTestData) => {
          // Navigate to the editor for this newly created test
          navigate(`/tests/editor/${newTestData.id}`);
        }}
      />
    </MainLayout>
  );
};

const TestEditMetadataWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "Chapterwise" | "PYQ" | "Mock Test"
  >("Chapterwise");

  const formatBreadcrumbTab = (tab: string) => {
    if (tab === "Chapterwise") return "Chapter Wise";
    if (tab === "PYQ") return "PYQ";
    if (tab === "Mock Test") return "Mock Test";
    return tab;
  };

  return (
    <MainLayout
      customBreadcrumbs={[
        "Test Creation",
        "Edit Test",
        formatBreadcrumbTab(activeTab),
      ]}
    >
      <TestCreationForm
        testId={id}
        onCancel={() => navigate("/")}
        onTabChange={setActiveTab}
        onSubmit={(updatedTestData) => {
          navigate(`/tests/editor/${updatedTestData.id}`);
        }}
      />
    </MainLayout>
  );
};

const TestEditorWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    setInitialLoadDone(false);
  }, [id]);

  const { data: testData } = useGetTest(id || "");

  // Determine if the questions list consists of IDs (strings)
  const rawQuestions = (testData?.questions as (string | ApiQuestion)[]) || [];
  const questionIds = rawQuestions.filter(
    (q): q is string => typeof q === "string",
  );

  // Fetch full details if we only have IDs
  const { data: bulkQuestions } = useFetchBulkQuestions(questionIds);

  useEffect(() => {
    if (testData && (questionIds.length === 0 || bulkQuestions)) {
      setInitialLoadDone(true);
    }
  }, [testData, questionIds.length, bulkQuestions]);

  const showSkeleton = !initialLoadDone;

  if (showSkeleton) {
    return (
      <MainLayout>
        <div className="flex h-[calc(100vh-60px)] w-full overflow-hidden bg-white -m-6 md:-m-8 animate-pulse">
          {/* Secondary Sidebar Skeleton */}
          <div className="w-[220px] shrink-0 border-r border-[#d9e5f7] bg-white flex flex-col h-full p-4 space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-8 w-full bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-9 w-full bg-gray-100 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
          {/* Main Area Skeleton */}
          <div className="flex-1 flex flex-col h-full bg-[#f8faff] overflow-hidden">
            <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-[#f4f6fc] bg-white shrink-0">
              <div className="h-5 w-48 bg-gray-200 rounded"></div>
              <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="w-full space-y-6 flex-1 p-6 md:p-8">
              {/* Summary card skeleton */}
              <div className="bg-white p-5 rounded-2xl border border-[#d9e5f7] space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              </div>
              {/* Editor skeleton */}
              <div className="bg-white p-6 rounded-2xl border border-[#d9e5f7] space-y-4">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-32 w-full bg-gray-100 rounded-xl"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-100 rounded-lg"></div>
                  <div className="h-10 bg-gray-100 rounded-lg"></div>
                  <div className="h-10 bg-gray-100 rounded-lg"></div>
                  <div className="h-10 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
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

  const testDetails = {
    id: testData.id,
    name: testData.name,
    subject: testData.subject,
    topic: testData.topics ? testData.topics.join(", ") : "",
    subTopic: testData.sub_topics ? testData.sub_topics.join(", ") : "",
    duration: testData.total_time || 60,
    questionsCount: testData.total_questions || 25,
    correctMarks: testData.correct_marks || 5,
    type: testData.type,
    difficulty: testData.difficulty,
  };

  const apiQuestions =
    questionIds.length > 0
      ? bulkQuestions || []
      : (rawQuestions as ApiQuestion[]);
  const mappedQuestions: QuestionItem[] = apiQuestions.map((q, i) => {
    return {
      id: i + 1,
      text: q.question || "",
      options: [
        q.option1 || "",
        q.option2 || "",
        q.option3 || "",
        q.option4 || "",
      ],
      correctOptionIdx: q.correct_option
        ? parseInt(q.correct_option.replace("option", "")) - 1
        : null,
      solution: q.explanation || "",
      difficulty: q.difficulty
        ? q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)
        : "Easy",
      topic: q.topic || "",
      subtopic: q.subtopic || "",
      isCompleted: !!q.question,
      media_url: q.media_url || "",
    };
  });

  if (mappedQuestions.length === 0) {
    mappedQuestions.push({
      id: 1,
      text: "",
      options: ["", "", "", ""],
      correctOptionIdx: null,
      solution: "",
      difficulty: "Easy",
      topic: testData.topics && testData.topics[0] ? testData.topics[0] : "",
      subtopic: "",
      isCompleted: false,
      media_url: "",
    });
  }

  return (
    <TestEditor
      testDetails={testDetails}
      onExit={() => navigate("/")}
      initialQuestions={mappedQuestions}
    />
  );
};

const TestTrackingWrapper = () => {
  return (
    <MainLayout>
      <div className="bg-white p-8 rounded-2xl border border-[#d9e5f7] shadow-xs max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#f0f4fe] rounded-xl text-[#1f59da]">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Test Tracking</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Monitor tests and exam completions
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Live monitoring systems are operational. Select a test from the
          dashboard to track detailed performance statistics.
        </p>
      </div>
    </MainLayout>
  );
};

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1f59da] border-t-transparent" />
      <p className="text-sm font-semibold text-gray-500">
        Loading PrepRoute...
      </p>
    </div>
  </div>
);

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<TestListWrapper />} />
        <Route path="/tests/create" element={<TestCreationWrapper />} />
        <Route path="/tests/edit/:id" element={<TestEditMetadataWrapper />} />
        <Route path="/tests/editor/:id" element={<TestEditorWrapper />} />
        <Route path="/tests/publish/:id" element={<TestPublish />} />
        <Route path="/tests/view/:id" element={<TestView />} />
        <Route path="/tests/tracking" element={<TestTrackingWrapper />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
