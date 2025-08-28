import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("login"); // login | register | dashboard | quiz | score
  const [score, setScore] = useState(0);

  // Auth states
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Store registered users (now persisted in localStorage)
  const [users, setUsers] = useState([]);

  // Quiz questions (persisted in localStorage)
  const [questions, setQuestions] = useState([
    { question: "What is 2 + 2?", options: ["4", "5"], correct: "4" },
  ]);

  // New question inputs
  const [newQuestion, setNewQuestion] = useState("");
  const [newOption1, setNewOption1] = useState("");
  const [newOption2, setNewOption2] = useState("");
  const [newCorrect, setNewCorrect] = useState("");

  // 🔹 Load data from localStorage when app loads
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) setUsers(JSON.parse(savedUsers));

    const savedQuestions = localStorage.getItem("questions");
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
  }, []);

  // Handle Login
  const handleLogin = () => {
    const foundUser = users.find(
      (u) => u.id === userId && u.password === password
    );
    if (foundUser) {
      setError("");
      setPage("dashboard");
    } else {
      setError("Invalid ID or Password!");
    }
  };

  // Handle Register
  const handleRegister = () => {
    if (!userId || !password) {
      setError("Both fields required!");
      return;
    }

    const exists = users.find((u) => u.id === userId);
    if (exists) {
      setError("User already exists!");
      return;
    }

    const newUsers = [...users, { id: userId, password }];
    setUsers(newUsers);

    // ✅ Save to localStorage
    localStorage.setItem("users", JSON.stringify(newUsers));

    setError("");
    alert("Registration successful! Please login.");
    setPage("login");
  };

  // Handle adding a new question
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion || !newOption1 || !newOption2 || !newCorrect) {
      alert("Fill all fields!");
      return;
    }

    const newQuestions = [
      ...questions,
      {
        question: newQuestion,
        options: [newOption1, newOption2],
        correct: newCorrect,
      },
    ];

    setQuestions(newQuestions);

    // ✅ Save to localStorage
    localStorage.setItem("questions", JSON.stringify(newQuestions));

    // Clear input fields
    setNewQuestion("");
    setNewOption1("");
    setNewOption2("");
    setNewCorrect("");
  };

  return (
    <div className="app">
      {/* 🔹 Navbar */}
      <nav className="navbar">
        <h1 className="logo">Quiz App</h1>
        <div className="nav-links">
          {page !== "login" && page !== "register" && (
            <>
              <button onClick={() => setPage("dashboard")}>Dashboard</button>
              <button onClick={() => setPage("quiz")}>Quiz</button>
              <button onClick={() => setPage("score")}>Score</button>
              <button onClick={() => setPage("login")}>Logout</button>
            </>
          )}
        </div>
      </nav>

      <div className="content">
        {/* 🔹 Login Page */}
        {page === "login" && (
          <div className="login">
            <h2>Login</h2>
            <div className="input-box">
              <i className="fa-regular fa-2x fa-circle-user"></i>
              <input
                type="text"
                placeholder="Enter ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <br />
            <div className="input-box">
              <i className="fa-solid fa-2x fa-lock"></i>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br />
            <button onClick={handleLogin}>Login</button>
            <p>
              Don’t have an account?{" "}
              <button onClick={() => setPage("register")}>Register</button>
            </p>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}

        {/* 🔹 Register Page */}
        {page === "register" && (
          <div className="register">
            <h2>Register</h2>
            <div className="input-box">
              <i className="fa-regular fa-2x fa-circle-user"></i>
              <input
                type="text"
                placeholder="Choose ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <br />
            <div className="input-box">
              <i className="fa-solid fa-2x fa-lock"></i>
              <input
                type="password"
                placeholder="Choose Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br />
            <button onClick={handleRegister}>Register</button>
            <p>
              Already have an account?{" "}
              <button onClick={() => setPage("login")}>Login</button>
            </p>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}

        {/* 🔹 Dashboard */}
        {page === "dashboard" && (
          <div className="dashboard">
            <h2>Dashboard</h2>
            <h3>Add a Question</h3>
            <form className="question-form" onSubmit={handleAddQuestion}>
              <input
                type="text"
                placeholder="Question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <input
                type="text"
                placeholder="Option 1"
                value={newOption1}
                onChange={(e) => setNewOption1(e.target.value)}
              />
              <input
                type="text"
                placeholder="Option 2"
                value={newOption2}
                onChange={(e) => setNewOption2(e.target.value)}
              />
              <input
                type="text"
                placeholder="Correct Answer"
                value={newCorrect}
                onChange={(e) => setNewCorrect(e.target.value)}
              />
              <button type="submit">Add Question</button>
            </form>
          </div>
        )}

        {/* 🔹 Quiz */}
        {page === "quiz" && (
          <div className="Quizsolve">
            <h2>Quiz</h2>
            {questions.map((q, i) => (
              <div key={i}>
                <p>
                  Q{i + 1}: {q.question}
                </p>
                {q.options.map((opt, j) => (
                  <button
                    key={j}
                    onClick={() => {
                      if (opt === q.correct) {
                        setScore((prev) => prev + 1);
                      }
                      if (i === questions.length - 1) {
                        setPage("score");
                      }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* 🔹 Score */}
        {page === "score" && (
          <div className="score">
            <h2>Your Score: {score}</h2>
            <button
              onClick={() => {
                setScore(0); // reset score
                setPage("dashboard");
              }}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
