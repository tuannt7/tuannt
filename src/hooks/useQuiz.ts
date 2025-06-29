import { useState, useEffect, useRef } from 'react';
import { Question, QuizState } from '../types/quiz';

export const useQuiz = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    allQuestions: [],
    currentQuestionIndex: 0,
    selectedAnswers: [],
    score: 0,
    isCompleted: false,
    isLoading: false,
    error: null,
    isConfiguring: false,
    mode: 'study',
    timeLimit: null,
    timeRemaining: null,
    isTimerActive: false,
  });

  const [currentSourceName, setCurrentSourceName] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (quizState.isTimerActive && quizState.timeRemaining !== null && quizState.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setQuizState(prev => {
          if (prev.timeRemaining === null || prev.timeRemaining <= 1) {
            // Time's up - auto finish quiz
            return {
              ...prev,
              timeRemaining: 0,
              isTimerActive: false,
              isCompleted: true,
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1,
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [quizState.isTimerActive, quizState.timeRemaining]);

  // Auto-finish quiz when time runs out
  useEffect(() => {
    if (quizState.timeRemaining === 0 && !quizState.isCompleted) {
      finishQuiz();
    }
  }, [quizState.timeRemaining, quizState.isCompleted]);

  const loadQuestions = async (sourceUrl: string, sourceName?: string) => {
    setQuizState(prev => ({ ...prev, isLoading: true, error: null }));
    setCurrentSourceName(sourceName || 'Custom Source');
    
    try {
      const response = await fetch(sourceUrl);
      
      if (!response.ok) {
        throw new Error(`Không thể tải dữ liệu: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Dữ liệu không đúng định dạng. Cần là một mảng các câu hỏi.');
      }

      if (data.length === 0) {
        throw new Error('Không có câu hỏi nào trong bộ dữ liệu.');
      }
      
      // Transform data to match our Question interface
      const questions: Question[] = data.map((item: any, index: number) => {
        // Validate required fields
        if (!item.question) {
          throw new Error(`Câu hỏi ${index + 1} thiếu trường "question".`);
        }

        if (!item.options || !Array.isArray(item.options)) {
          throw new Error(`Câu hỏi ${index + 1} thiếu trường "options" hoặc không phải là mảng.`);
        }

        if (item.options.length < 2) {
          throw new Error(`Câu hỏi ${index + 1} cần có ít nhất 2 đáp án.`);
        }

        // Process options and find correct answer
        let options: string[] = [];
        let correctIndex = -1;
        let correctCount = 0;
        let correctAnswers: number[] = [];
        
        item.options.forEach((option: any, optionIndex: number) => {
          // Support both old format (string array with separate correct field) and new format (object array)
          if (typeof option === 'string') {
            // Old format: options is array of strings, correct answer is specified separately
            options.push(option);
            if (item.correct === optionIndex || item.correctAnswer === optionIndex) {
              correctCount++;
              correctIndex = optionIndex;
              correctAnswers.push(optionIndex);
            }
          } else if (typeof option === 'object' && option !== null) {
            // New format: options is array of objects with text and isCorrect
            if (!option.text || typeof option.isCorrect !== 'boolean') {
              throw new Error(`Câu hỏi ${index + 1}, đáp án ${optionIndex + 1} không đúng định dạng. Cần có "text" và "isCorrect".`);
            }
            
            options.push(option.text);
            
            if (option.isCorrect === true) {
              correctCount++;
              correctIndex = optionIndex;
              correctAnswers.push(optionIndex);
            }
          } else {
            throw new Error(`Câu hỏi ${index + 1}, đáp án ${optionIndex + 1} không đúng định dạng. Phải là string hoặc object có "text" và "isCorrect".`);
          }
        });

        // For old format, if no correct answer found in options loop, check item.correct or item.correctAnswer
        if (correctCount === 0 && (typeof item.correct === 'number' || typeof item.correctAnswer === 'number')) {
          const correctIdx = item.correct ?? item.correctAnswer;
          if (correctIdx >= 0 && correctIdx < options.length) {
            correctIndex = correctIdx;
            correctCount = 1;
          }
        }

        // Validate that exactly one correct answer exists
        if (correctCount === 0) {
          throw new Error(`Câu hỏi ${index + 1} không có đáp án đúng nào. Cần có "isCorrect: true" hoặc trường "correct"/"correctAnswer".`);
        }

        if (correctCount > 1) {
          // Log detailed information about the problematic question
          console.error(`🔍 Chi tiết câu hỏi ${index + 1} có ${correctCount} đáp án đúng:`);
          console.error('Câu hỏi:', item.question);
          console.error('Các đáp án:');
          item.options.forEach((option: any, optionIndex: number) => {
            if (typeof option === 'object') {
              console.error(`  ${optionIndex + 1}. "${option.text}" - isCorrect: ${option.isCorrect}`);
            } else {
              console.error(`  ${optionIndex + 1}. "${option}" - correct index: ${item.correct ?? item.correctAnswer}`);
            }
          });
          console.error('Các đáp án được đánh dấu đúng:', correctAnswers.map(i => i + 1));
          console.error('Dữ liệu gốc của câu hỏi:', JSON.stringify(item, null, 2));
          
          throw new Error(`Câu hỏi ${index + 1} có ${correctCount} đáp án đúng. Chỉ được có đúng 1 đáp án đúng.

🔍 Chi tiết câu hỏi:
"${item.question}"

Các đáp án được đánh dấu đúng:
${correctAnswers.map(i => `- Đáp án ${i + 1}: "${typeof item.options[i] === 'object' ? item.options[i].text : item.options[i]}"`).join('\n')}

Vui lòng kiểm tra dữ liệu JSON và đảm bảo chỉ có 1 đáp án có "isCorrect": true hoặc chỉ định đúng trường "correct".`);
        }

        return {
          id: index + 1,
          question: item.question,
          options,
          correct: correctIndex,
          explanation: item.explanation || '',
        };
      });

      console.log(`✅ Đã tải thành công ${questions.length} câu hỏi từ ${sourceName || 'Custom Source'}`);

      setQuizState(prev => ({
        ...prev,
        allQuestions: questions,
        isLoading: false,
        error: null,
        isConfiguring: true, // Show setup screen after loading
      }));
    } catch (error) {
      let errorMessage = 'Có lỗi xảy ra khi tải câu hỏi.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      console.error('❌ Lỗi tải dữ liệu:', errorMessage);

      setQuizState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const startQuiz = (config: { questionCount: number | 'all'; randomize: boolean; mode: 'study' | 'exam'; timeLimit: number | null }) => {
    let selectedQuestions = [...quizState.allQuestions];
    
    // Randomize if requested
    if (config.randomize) {
      selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
    }
    
    // Limit questions if not 'all'
    if (config.questionCount !== 'all') {
      selectedQuestions = selectedQuestions.slice(0, config.questionCount);
    }

    // Calculate time remaining in seconds
    const timeRemaining = config.timeLimit ? config.timeLimit * 60 : null;

    setQuizState(prev => ({
      ...prev,
      questions: selectedQuestions,
      selectedAnswers: new Array(selectedQuestions.length).fill(null),
      isConfiguring: false,
      currentQuestionIndex: 0,
      score: 0,
      isCompleted: false,
      mode: config.mode,
      timeLimit: config.timeLimit,
      timeRemaining,
      isTimerActive: timeRemaining !== null,
    }));
  };

  const selectAnswer = (answerIndex: number) => {
    if (quizState.isCompleted) return;

    const newSelectedAnswers = [...quizState.selectedAnswers];
    newSelectedAnswers[quizState.currentQuestionIndex] = answerIndex;

    setQuizState(prev => ({
      ...prev,
      selectedAnswers: newSelectedAnswers,
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const previousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const finishQuiz = () => {
    // Stop timer
    setQuizState(prev => ({ ...prev, isTimerActive: false }));
    
    // Calculate score
    const score = quizState.selectedAnswers.reduce((acc, answer, index) => {
      if (answer === quizState.questions[index]?.correct) {
        return acc + 1;
      }
      return acc;
    }, 0);

    setQuizState(prev => ({
      ...prev,
      score,
      isCompleted: true,
      isTimerActive: false,
    }));
  };

  const restartQuiz = () => {
    // Reset timer to original time limit
    const timeRemaining = quizState.timeLimit ? quizState.timeLimit * 60 : null;
    
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      selectedAnswers: new Array(prev.questions.length).fill(null),
      score: 0,
      isCompleted: false,
      timeRemaining,
      isTimerActive: timeRemaining !== null,
    }));
  };

  const resetQuiz = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setQuizState({
      questions: [],
      allQuestions: [],
      currentQuestionIndex: 0,
      selectedAnswers: [],
      score: 0,
      isCompleted: false,
      isLoading: false,
      error: null,
      isConfiguring: false,
      mode: 'study',
      timeLimit: null,
      timeRemaining: null,
      isTimerActive: false,
    });
    setCurrentSourceName('');
  };

  const backToSetup = () => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setQuizState(prev => ({
      ...prev,
      isConfiguring: true,
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswers: [],
      score: 0,
      isCompleted: false,
      timeLimit: null,
      timeRemaining: null,
      isTimerActive: false,
    }));
  };

  return {
    ...quizState,
    currentSourceName,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    restartQuiz,
    resetQuiz,
    loadQuestions,
    startQuiz,
    backToSetup,
  };
};