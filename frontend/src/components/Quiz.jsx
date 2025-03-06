import { useState, useEffect } from 'react';
import { Button, Radio, RadioGroup, FormControlLabel, TextField, LinearProgress } from '@mui/material';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const filePath = '/ques.txt'; // Assumes ques.txt is in public/

  // Extract questions from the text file
  useEffect(() => {
    const extractQuestions = async () => {
      try {
        console.log('Fetching file from:', filePath);
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.status} - ${response.statusText}`);
        }
        const text = await response.text();
        console.log('File content:', text);

        const lines = text.split('\n').filter(line => line.trim());
        const parsedQuestions = [];
        let currentQuestion = null;

        lines.forEach((line, index) => {
          if (line.match(/^\d+\)\s*Q:/)) {
            if (currentQuestion) parsedQuestions.push(currentQuestion);
            const questionText = line.replace(/^\d+\)\s*Q:\s*/, '').trim();
            currentQuestion = { type: 'theory', text: questionText, id: index, options: [] };
          } else if (line.match(/^\s*\d+\.\s*/)) {
            if (currentQuestion) {
              currentQuestion.type = 'mcq';
              const optionText = line.replace(/^\s*\d+\.\s*/, '').trim();
              const isCorrect = optionText.includes('(correct)');
              const cleanedOption = optionText.replace(' (correct)', '').trim();
              currentQuestion.options.push(cleanedOption);
              if (isCorrect) currentQuestion.correctAnswer = cleanedOption;
            }
          }
        });
        if (currentQuestion) parsedQuestions.push(currentQuestion);

        console.log('Parsed questions:', parsedQuestions);
        setQuestions(parsedQuestions);
      } catch (error) {
        console.error('Error extracting text:', error);
      }
    };

    extractQuestions();
  }, []);

  // Handle answer changes
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Handle quiz submission
  const handleSubmit = () => {
    console.log('Submitted Answers:', answers);
  };

  // Calculate progress for the line
  const progress = questions.length ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Loading state
  if (!questions.length) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5',
        color: '#000',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Quiz</h1>
          <p style={{ fontSize: '1.2rem' }}>Loading questions...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  // Render the UI
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        width: '100%',
        maxWidth: '600px',
        position: 'relative'
      }}>
        {/* Progress Section Above Question Box */}
        <div style={{
          position: 'absolute',
          top: '-50px', // Adjusted to fit text and line
          left: '0',
          width: '100%',
          padding: '0 30px',
          boxSizing: 'border-box',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#000',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: '6px',
              borderRadius: '3px',
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#000',
              }
            }}
          />
        </div>

        {/* Question Content */}
        <h1 style={{
          fontSize: '2rem',
          color: '#000',
          textAlign: 'center',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Quiz
        </h1>
        <h3 style={{
          fontSize: '1.5rem',
          color: '#333',
          marginBottom: '20px',
          lineHeight: '1.4'
        }}>
          {question.text}
        </h3>

        {question.type === 'mcq' ? (
          <RadioGroup
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            sx={{ gap: '10px' }}
          >
            {question.options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                value={option}
                control={<Radio sx={{ color: '#000', '&.Mui-checked': { color: '#000' } }} />}
                label={option}
                sx={{
                  background: '#fafafa',
                  border: '1px solid #e0e0e0',
                  borderRadius: '5px',
                  padding: '8px',
                  transition: 'background 0.2s',
                  '&:hover': { background: '#f0f0f0' }
                }}
              />
            ))}
          </RadioGroup>
        ) : (
          <TextField
            multiline
            rows={4}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            fullWidth
            placeholder="Type your answer here..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '5px',
                background: '#fafafa',
                '&:hover fieldset': { borderColor: '#000' },
                '&.Mui-focused fieldset': { borderColor: '#000' }
              }
            }}
          />
        )}

        {/* Navigation Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '5px',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#333' },
              '&:disabled': { backgroundColor: '#ccc', color: '#666' }
            }}
          >
            Previous
          </Button>
          <Button
            disabled={currentQuestion === questions.length - 1}
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '5px',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#333' },
              '&:disabled': { backgroundColor: '#ccc', color: '#666' }
            }}
          >
            Next
          </Button>
          {currentQuestion === questions.length - 1 && (
            <Button
              onClick={handleSubmit}
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '5px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#333' }
              }}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;