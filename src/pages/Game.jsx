import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Sparkles, Brain, ArrowLeft, RotateCcw } from 'lucide-react';
import './Game.css';

const questions = [
  {
    question: "What's your current vibe?",
    options: [
      { id: 1, text: "Chill & Relaxed", mood: "Healthy" },
      { id: 2, text: "Boss Level Energy", mood: "Protein-Rich" },
      { id: 3, text: "Slightly Dramatic", mood: "Spicy" },
      { id: 4, text: "Sweet & Cozy", mood: "Dessert" },
    ]
  },
  {
    question: "Pick a Color palette",
    options: [
      { id: 1, text: "Warm Yellows & Pinks", vibe: "Sweet" },
      { id: 2, text: "Deep Reds & Browns", vibe: "Meaty" },
      { id: 3, text: "Fresh Greens & Whites", vibe: "Salad" },
      { id: 4, text: "Ocean Blues & Purples", vibe: "Cooling" },
    ]
  },
  {
    question: "In 3 words, you are...",
    options: [
      { id: 1, text: "Fast, Wild, Free", type: "Burger" },
      { id: 2, text: "Classic, Timeless, Bold", type: "Pizza" },
      { id: 3, text: "Light, Airy, Graceful", type: "Japanese" },
      { id: 4, text: "Complex, Rich, Intense", type: "Indian" },
    ]
  }
];

const Game = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleNext = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      generateResult();
    }
  };

  const generateResult = () => {
    // Basic logic to pick a result based on the last answer
    const finalType = answers[answers.length - 1] || "Pizza";
    setResult({
      name: `Signature ${finalType}`,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
      match: "98% Match",
      reason: "Based on your high-octane energy and preference for bold flavors!"
    });
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="game-page">
      <Header />
      <main className="game-main section-padding">
        <div className="container">
          <div className="game-header">
            <Sparkles className="accent-color" size={40} />
            <h1 className="game-title">AI FOOD MOOD <span className="accent">MATCHER</span></h1>
            <p className="game-subtitle">Tell us how you feel, we'll tell you what to eat.</p>
          </div>

          {!result ? (
            <div className="quiz-container">
              <div className="quiz-progress flex-center">
                {questions.map((_, i) => (
                  <div key={i} className={`progress-dot ${i <= step ? 'active' : ''}`}></div>
                ))}
              </div>
              <div className="quiz-card">
                <h2 className="quiz-question">{questions[step].question}</h2>
                <div className="options-grid">
                  {questions[step].options.map((option) => (
                    <button 
                      key={option.id} 
                      className="option-btn"
                      onClick={() => handleNext(option.type || option.mood)}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
              {step > 0 && (
                <button className="back-btn flex-center gap-2" onClick={() => setStep(step - 1)}>
                   <ArrowLeft size={18} /> Back
                </button>
              )}
            </div>
          ) : (
            <div className="result-container">
              <div className="result-card">
                 <div className="result-img-box">
                    <img src={result.image} alt={result.name} />
                    <span className="match-badge">{result.match}</span>
                 </div>
                 <div className="result-info">
                    <h2 className="result-name">You should eat: {result.name}</h2>
                    <p className="result-text">{result.reason}</p>
                    <div className="result-btns">
                       <button className="primary-btn">Order Now</button>
                       <button className="accent-btn flex-center gap-2" onClick={reset}>
                          <RotateCcw size={18} /> Try Again
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Game;
