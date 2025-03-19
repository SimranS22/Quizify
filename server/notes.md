1. Create a new quiz: POST /api/quizzes/create
2. Insert questions into a quiz: PUT /api/quizzes/:id/questions
3. Update the title of a quiz: PUT /api/quizzes/:id/title
4. Update a question in a quiz: PUT /api/quizzes/:quizId/questions/:questionId
5. Delete a question from a quiz: DELETE /api/quizzes/:quizId/questions/:questionId
6. Retrieve all quizzes created by the admin: GET /api/quizzes/admin
7. Display all quizzes: GET /api/quizzes
8. Display a single quiz by ID: GET /api/quizzes/:id
9. Delete a quiz by ID: DELETE /api/quizzes/:id


-------------------------------------------------------------------------------------------

// Backend
const authHeader = req.header('Authorization');
if (!authHeader) return res.status(401).send('Access denied. No token provided.');

const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
if (!token) return res.status(401).send('Access denied. No token provided.');

// Frontend
headers: {
    'Authorization': ` Bearer ${token}`
}

-------------------------------------------------------------------------------------------

{
    "message": "Quiz created successfully.",
    "data": {
        "title": "Sample Quiz",
        "createdBy": "67d417c1be006152a64e96c3",
        "questions": [
            {
                "question": "What is the capital of France?",
                "options": [
                    "Paris",
                    "London",
                    "Berlin",
                    "Madrid"
                ],
                "correctAnswer": "Paris",
                "_id": "67d41a2c7c8cd3b9f1c532c1"
            },
            {
                "question": "What is 2 + 2?",
                "options": [
                    "3",
                    "4",
                    "5",
                    "6"
                ],
                "correctAnswer": "4",
                "_id": "67d41a2c7c8cd3b9f1c532c2"
            }
        ],
        "_id": "67d41a2c7c8cd3b9f1c532c0"
    }
}