"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/components/ui/label";
import { Textarea } from "./ui/components/ui/textarea";
import { Button } from "./ui/components/ui/button";
import { askQuestion, getQuestionsForTender, Question } from "@/app/services/QnaService";

interface QnaSectionProps {
  tenderid: string;
}

function QnaSection({ tenderid }: QnaSectionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!newQuestion.trim()) return;
    setLoading(true);
    try {
      await askQuestion(tenderid, newQuestion.trim());
      setNewQuestion("");
      fetchQuestions(); // Refresh list
    } catch (err) {
      console.error("Failed to submit question:", err);
    } finally {
      setLoading(false);
    }
  };

  const answeredQuestions = questions.filter((q) => q.answer);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Questions & Answers
      </h2>
      <Tabs defaultValue="qa" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 rounded-xl p-1">
          <TabsTrigger
            value="qa"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
          >
            Q&A ({answeredQuestions.length})
          </TabsTrigger>
          <TabsTrigger
            value="ask"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
          >
            Ask a Question
          </TabsTrigger>
        </TabsList>

        {/* Q&A Tab */}
        <TabsContent value="qa" className="mt-6">
          {answeredQuestions.length > 0 ? (
            <div className="space-y-4">
              {answeredQuestions.map((qa) => (
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
                  {qa.answer && (
                    <div className="pl-4 border-l-4 border-blue-200">
                      <p className="text-gray-700 leading-relaxed">
                        <span className="font-medium text-blue-600">A:</span>{" "}
                        {qa.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50/50 rounded-xl">
              <p className="text-gray-500">No questions answered yet</p>
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
                  Your Question
                </Label>
                <Textarea
                  id="new-question"
                  placeholder="Type your question here..."
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full rounded-xl border-gray-200/50 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Question"}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default QnaSection;
