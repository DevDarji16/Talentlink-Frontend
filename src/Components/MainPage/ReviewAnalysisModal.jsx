import React, { useContext, useEffect, useState } from "react";
import { Theme, ThemeSet } from "../../App";

const ReviewAnalysisModal = ({ isOpen, onClose, reviews }) => {
    const theme=useContext(Theme)
    const setTheme=useContext(ThemeSet)
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        if (isOpen && reviews.length > 0) {
            console.log('reviews in modal', reviews)
            analyzeReviews();
        }
    }, [isOpen]);

    const analyzeReviews = async () => {
        setLoading(true);
        try {
            const text = reviews.map(r => r.comment).join("\n");
            console.log('review wala text', text)

            const response = await window.puter.ai.chat(
                [
                    {
                        role: "system", content: `You are an assistant for a freelancer platform. 
Analyze reviews and always provide clear, professional, and useful insights. 
If there are very few or no reviews, do not ask for more information — instead, 
comment on what is available and fill in the gaps with a general but relevant analysis.

Always cover briefly:
- The overall sentiment (positive/negative/neutral).
- Key strengths based on reviews (even if few).
- Possible areas of improvement.
- A short summary for potential clients.

Keep answers short, 3–5 sentences maximum.`},
                    { role: "user", content: text }
                ],
                { model: "gpt-4o-mini" }
            );

            const aiText = response.message?.content || "⚠️ No response from AI.";
            setAnalysis(aiText.replace(/[#*]/g, ""));
        } catch (err) {
            setAnalysis("⚠️ Could not analyze reviews. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    ✖
                </button>

                <h2 className="text-xl font-bold mb-4">Review Analysis</h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 border-b-2"></div>
                        <p className="mt-4 text-gray-600 animate-pulse">Analyzing reviews…</p>
                    </div>
                ) : (
                    <div className="text-gray-800 whitespace-pre-line">
                        {analysis}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewAnalysisModal;
