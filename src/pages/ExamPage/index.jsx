import React, { useState, useEffect } from "react";
import { Survey } from "survey-react-ui";
import * as SurveyCore from "survey-core";
import "survey-core/defaultV2.css";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from 'sweetalert2'; // Import SweetAlert2
import './style.css';

function ExamPage() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      const querySnapshot = await getDocs(collection(db, "exams"));
      const examList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        json: JSON.parse(doc.data().examJson),
      }));
      setExams(examList);
    };

    fetchExams();
  }, []);

  const handleComplete = async (survey) => {
    try {
      const response = {};
  
      survey.getAllQuestions().forEach((question) => {
        const value = survey.data[question.name];
  
        if (question.getType() === "radiogroup" || question.getType() === "checkbox" || question.getType() === "tagbox") {
          const selectedChoices = Array.isArray(value)
            ? value.map((choice) => {
                const choiceItem = question.choices.find((item) => item.value === choice);
                return { value: choice, text: choiceItem ? choiceItem.text : "" };
              })
            : [];
  
          response[question.name] = {
            questionText: question.title || "Untitled Question",
            answer: selectedChoices.length > 0 ? selectedChoices : null,
          };
        } else {
          response[question.name] = {
            questionText: question.title || "Untitled Question",
            answer: value !== undefined ? value : null, // Replace undefined with null
          };
        }
      });
  
      console.log(response);
  
      await addDoc(collection(db, "results"), {
        examId: selectedExam?.id || "unknown",
        response: response,
        timestamp: new Date().toISOString(),
      });
  
      Swal.fire({
        title: "Success!",
        text: "Your response has been saved!",
        icon: "success",
        confirmButtonText: "Close",
      });
    } catch (error) {
      console.error("Error saving response:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while saving your response. Please try again.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };
  

  const handleDelete = async (examId) => {
    try {
      await deleteDoc(doc(db, "exams", examId));
      setExams(exams.filter((exam) => exam.id !== examId));
      
      Swal.fire({
        title: 'Success!',
        text: 'Exam has been deleted successfully.',
        icon: 'success',
        confirmButtonText: 'Close',
      });
    } catch (error) {
      console.error("Error deleting exam:", error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while deleting the exam. Please try again.',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    }
  };

  return (
    <div className="exam-page">
      <h2 className="heading">Saved Exams</h2>
      <ul className="exam-list">
        {exams.map((exam) => (
          <li onClick={() => setSelectedExam(exam)} key={exam.id} className="exam-item">
            <span>{exam.title}</span>
            <button onClick={() => handleDelete(exam.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedExam && (
        <div className="survey-container">
          <h3 className="survey-title">{selectedExam.title}</h3>
          <Survey model={new SurveyCore.Model(selectedExam.json)} onComplete={handleComplete} />
        </div>
      )}
    </div>
  );
}

export default ExamPage;
