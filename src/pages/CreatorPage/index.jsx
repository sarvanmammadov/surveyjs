import React, { useState, useEffect } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.min.css";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from 'sweetalert2'; // Import SweetAlert2
import "./style.css";

function CreatorPage() {
  const [savedExams, setSavedExams] = useState([]);

  const fetchSavedExams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "exams"));
      const exams = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "Untitled Exam",
        json: JSON.parse(doc.data().examJson),
      }));
      setSavedExams(exams);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  useEffect(() => {
    fetchSavedExams();
  }, []);

  const options = {
    showLogicTab: true,
  };

  const creator = new SurveyCreator(options);
  creator.saveSurveyFunc = async (saveNo, callback) => {
    try {
      console.log(creator.JSON);
      
      const newExam = {
        title: creator.JSON.title || "Untitled Exam",
        examJson: JSON.stringify(creator.JSON),
        timestamp: new Date().toISOString(),
      };
      console.log(newExam);
      
      await addDoc(collection(db, "exams"), newExam);

      // Replace alert with SweetAlert2
      Swal.fire({
        title: 'Success!',
        text: 'Exam saved successfully!',
        icon: 'success',
        confirmButtonText: 'Close',
      });

      fetchSavedExams();
    } catch (error) {
      console.error("Error saving exam:", error);

      // Show error message with SweetAlert2
      Swal.fire({
        title: 'Error!',
        text: 'There was an error saving your exam.',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    }
    callback(saveNo, true);
  };

  return (
    <div style={{ minHeight: "100%" }}>
      <h2>Survey Creator</h2>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}

export default CreatorPage;
