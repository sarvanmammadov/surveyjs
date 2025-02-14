import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2"; // Import SweetAlert for confirmation alerts
import "./style.css";

function ResultsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const querySnapshot = await getDocs(collection(db, "results"));
    const resultList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      examId: doc.data().examId,
      response: doc.data().response,
      timestamp: doc.data().timestamp,
    }));
    setResults(resultList);
  };

  const handleDelete = async (resultId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This result will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await deleteDoc(doc(db, "results", resultId));
        setResults(results.filter((result) => result.id !== resultId));

        Swal.fire({
          title: "Deleted!",
          text: "The result has been deleted.",
          icon: "success",
        });
      } catch (error) {
        console.error("Error deleting result:", error);
        Swal.fire({
          title: "Error!",
          text: "Could not delete the result. Please try again.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="results-page">
      <h2 className="heading">Survey Results</h2>
      <ul className="results-list">
        {results.map((result) => (
          <li key={result.id} className="result-item">
            <div className="result-header">
              <p><strong>Exam ID:</strong> {result.examId}</p>
              <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
              <button className="delete-button" onClick={() => handleDelete(result.id)}>Delete</button>
            </div>
            <div className="response-container">
              {Object.entries(result.response).map(([key, value]) => (
                <div key={key} className="question-answer">
                  <p className="question"><strong>Question:</strong> {value.questionText}</p>
                  <p className="answer"><strong>Answer:</strong> {Array.isArray(value.answer) ? value.answer.map(ans => ans.text || ans.value).join(", ") : value.answer}</p>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultsPage;
