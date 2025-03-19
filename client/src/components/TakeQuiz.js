import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TakeQuiz() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [correctAnswers, setCorrectAnswers] = useState({});
    const [btnValue, setButton] = useState(false);
    const [count, setCount] = useState(10);
    const [msg, setMsg] = useState('');
    const [isTabActive, setIsTabActive] = useState(true);
    const [cntSwitch, setCntSwitch] = useState(0);
    const [checkSubmit, setCheckSubmit] = useState(false);
    const [colorValue, setColorValue] = useState(true)
    const token = localStorage.getItem('token');

    // GET Quiz Questions
    useEffect(() => {
        const getQuizQuestions = () => {
            fetch(`http://localhost:7000/api/quizzes/${id}`, {
                headers: {
                    'Authorization': `${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    navigate('/login');
                    throw new Error('Invalid token');
                }
                return response.json();
            })
            .then(result => {
                if (result && result.questions) {
                    setQuiz(result);
                } else {
                    alert('Unexpected response format');
                }
            })
            .catch(err => alert(err.message));
        };

        getQuizQuestions();
    }, [id, token, navigate]);

    const handleOptionChange = (questionId, option) => {
        setAnswers({
            ...answers,
            [questionId]: option
        });
    };

    // POST: Submit Quiz Answers
    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }

        const formattedAnswers = Object.keys(answers).map(questionId => ({
            questionId,
            selectedAnswer: answers[questionId]
        }));

        const data = { 
            quizId: quiz._id,
            answers: formattedAnswers
        };

        // console.log("Data: ", data);

        fetch("http://localhost:7000/api/results/submit", {
            method: "POST",
            headers: {                
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if (!response.ok) {
                navigate('/login');
                throw new Error('Invalid token');
            }
            return response.json();
        })
        .then((result) => {
            setMsg('Answers Submitted Successfully!');

            const newCorrectAnswers = {};
            quiz.questions.forEach(question => {
                const userAnswer = answers[question._id];
                const correctAnswer = question.correctAnswer; 
                newCorrectAnswers[question._id] = userAnswer === correctAnswer;
            });
            setCorrectAnswers(newCorrectAnswers);
            setButton(true);
        })
        .catch(err => alert(err.message));
    };

    // Handle Tab Switching
    useEffect(() => {
        if(quiz){
            const handleVisibilityChange = () => {
                const isActive = !document.hidden;
                setIsTabActive(isActive);
    
                if (!isActive) {                
                    let tabFlag = false;
                    setCntSwitch(prevCntSwitch => {
                        const newCntSwitch = prevCntSwitch + 1;
                        setMsg(`WARNING: You have switched tabs ${newCntSwitch} time(s).`);
    
                        if (newCntSwitch === 3 && tabFlag === false) {                     
                            if (Object.keys(answers).length > 0) {
                                setButton(true);
                                handleSubmit();
                                tabFlag=true;
                                setCheckSubmit(true);
                                console.log("333");
                                setTimeout(()=>{
                                    navigate('/my-dashboard')
                                }, 3000);   
                            } else {
                                setButton(true);
                                handleSubmit();
                                tabFlag=true;
                                setCheckSubmit(true);
                                console.log("444");
                                setTimeout(()=>{
                                    navigate('/my-dashboard')
                                }, 1000); 
                            }
                        }
    
                        return newCntSwitch;
                    });
                }
            };
    
            document.addEventListener('visibilitychange', handleVisibilityChange);
    
            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }
    }, [quiz, answers, checkSubmit]);

    // Quiz Timer
    useEffect(() => {
        if (quiz && count > 0) {
            let timerFlag = false;
            const countdownInterval = setInterval(() => {
                setCount(prevCount => {
                    if(prevCount === 6){
                        setColorValue(false);
                    }
                    if (prevCount < 2 && timerFlag===false && checkSubmit === false) {
                        timerFlag = true;
                        clearInterval(countdownInterval);
                        setButton(true);
                        handleSubmit();
                        console.log("555")
                        setTimeout(()=>{
                            navigate('/my-dashboard')
                        }, 3000);                    
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }        
    }, [quiz, answers, count]);

    return (
        <div className="container">
            {quiz && (
                <>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h3>{quiz.title}</h3>
                        <h5 style={{ padding: "5px", backgroundColor: colorValue ? "#70ff70" : "#ff7070", borderRadius: "10px"}}>{count} seconds</h5>
                    </div>
                    <br />
                    <form onSubmit={handleSubmit}>
                        {quiz.questions.map((question, index) => (
                            <div key={index} className="mb-4">
                                <h5>{question.question}</h5>
                                {question.options.map((option, idx) => (
                                    <div key={idx} className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`question-${question._id}`}
                                            id={`question-${question._id}-option-${idx}`}
                                            value={option}
                                            checked={answers[question._id] === option}
                                            onChange={() => handleOptionChange(question._id, option)}
                                        />
                                        <label 
                                            className="form-check-label" 
                                            htmlFor={`question-${question._id}-option-${idx}`}
                                            style={{ 
                                                fontWeight: 'bold',
                                                color: correctAnswers[question._id] === undefined 
                                                    ? 'black' 
                                                    : answers[question._id] === option 
                                                        ? (option === question.correctAnswer ? 'green' : 'red') 
                                                        : 'black',
                                                accentColor: correctAnswers[question._id] === undefined 
                                                    ? 'black' 
                                                    : answers[question._id] === option 
                                                        ? (option === question.correctAnswer ? 'green' : 'red') 
                                                        : 'black'
                                            }}
                                        >
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {btnValue ? (
                            <button type="button" className="btn btn-primary" onClick={() => navigate('/my-dashboard')}>
                                Back to Dashboard
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-primary">Submit</button>
                        )}
                    </form>
                </>
            )}
            <br />
            <div style={{ textAlign: "center", padding: "10px", backgroundColor: msg === '' ? '#ffffff' : '#ffff89' }}>
                {msg}
            </div>
        </div>
    );
}

export default TakeQuiz;