"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  askQuestion,
  getQuestionsForTender,
  Question,
} from "@/app/services/QnaService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { detectContactInfo } from "@/utils/validationcehck";

interface QnaSectionProps {
  tenderid: string;
}

function QnaSection({ tenderid }: QnaSectionProps) {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validation function
  const validateQuestion = (text: string): string | null => {
    if (!text.trim()) {
      return t("question_cannot_be_empty");
    }

    const detections = detectContactInfo(text);
    const highSeverity = detections.filter((d) => d.severity === "high");

    if (highSeverity.length > 0) {
      const type = highSeverity[0].type;
      return t(`question_contains_contact_information_${type}`);
    }

    return null;
  };

  const fetchQuestions = async () => {
    try {
      const data = await getQuestionsForTender(tenderid);
      setQuestions(data);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [tenderid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateQuestion(newQuestion);
    if (error) {
      setQuestionError(error);
      return;
    }

    setLoading(true);
    try {
      await askQuestion(tenderid, newQuestion.trim());
      setNewQuestion("");
      setQuestionError(null);
      fetchQuestions(); // Refresh list
    } catch (err) {
      console.error("Failed to submit question:", err);
      setQuestionError(t("failed_to_submit_question_please_try_again"));
    } finally {
      setLoading(false);
    }
  };

  const answeredQuestions = questions.filter((q) => q.answer);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t("questions_and_answers")}
      </h2>
      <Tabs defaultValue="qa" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="qa">
            {t("q_a")} ({questions.length})
          </TabsTrigger>
          <TabsTrigger className="w-full" value="ask">
            {t("ask_a_question")}
          </TabsTrigger>
        </TabsList>

        {/* Q&A Tab */}
        <TabsContent value="qa" className="mt-6">
          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((qa) => (
                <div
                  key={qa._id}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100/80"
                >
                  <div className="mb-3">
                    <p className="font-semibold text-gray-800 text-lg mb-1">
                      Q: {qa.question}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(qa.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {qa.answer ? (
                    <div className="pl-4 border-l-4 border-blue-200">
                      <p className="text-gray-700 leading-relaxed">
                        <span className="font-medium text-blue-600">A:</span>{" "}
                        {qa.answer}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">{t("no_answer_yet")}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50/50 rounded-xl">
              <p className="text-gray-500">{t("no_questions_asked_yet")}</p>
            </div>
          )}
        </TabsContent>

        {/* Ask a Question Tab */}
        <TabsContent value="ask" className="mt-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100/80">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="new-question"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  {t("your_question")}
                </Label>
                <Textarea
                  id="new-question"
                  placeholder={t("type_your_question_here")}
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewQuestion(value);
                    // Real-time validation
                    if (questionError) {
                      const newError = validateQuestion(value);
                      setQuestionError(newError);
                    }
                  }}
                  onBlur={() => {
                    setQuestionError(validateQuestion(newQuestion));
                  }}
                  className={`w-full rounded-xl border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20 ${
                    questionError ? "border-red-300 focus:border-red-500" : ""
                  }`}
                />
                {questionError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {questionError}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-all duration-300"
                disabled={loading}
              >
                {loading ? t("submitting") + "..." : t("submit_question")}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default QnaSection;
