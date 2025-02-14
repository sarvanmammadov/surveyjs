import React, { useEffect, useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/survey.i18n.js";
import "survey-creator-core/survey-creator-core.i18n.js";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.min.css";
import { collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

function SurveyCreatorRenderComponent() {
  const [surveyJson, setSurveyJson] = useState(null);
  const [savedSurveys, setSavedSurveys] = useState([]); // Stores all saved surveys

  // Fetch all surveys for the sidebar
  const fetchSavedSurveys = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "survey-json"));
      const surveys = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "Untitled Survey",
        json: doc.data().firstJson ? JSON.parse(doc.data().firstJson) : null,
      }));
      setSavedSurveys(surveys);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  // Fetch a specific survey
  const fetchSurveyResults = async (surveyId) => {
    try {
      const docSnap = await getDoc(doc(db, "survey-json", surveyId));

      if (docSnap.exists()) {
        const data = docSnap.data();
        const firstJson = data.firstJson ? JSON.parse(data.firstJson) : null;
        setSurveyJson(firstJson);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching survey results:", error);
    }
  };

  // Save survey to Firestore
  const saveSurveyToFirestore = async () => {
    try {
      if (!creator.JSON) return;

      const newSurvey = {
        title: creator.JSON.title || "Untitled Survey",
        firstJson: JSON.stringify(creator.JSON),
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(db, "survey-json"), newSurvey);
      alert("Survey saved successfully!");

      // Refresh the sidebar list
      fetchSavedSurveys();
    } catch (error) {
      console.error("Error saving survey:", error);
      alert("Error saving survey. Please try again.");
    }
  };

  useEffect(() => {
    fetchSavedSurveys();
  }, []);

  const options = {
    showLogicTab: true,
  };

  const creator = new SurveyCreator(options);
  const localStorageKey = "survey-json-example";

  creator.JSON = surveyJson || {};

  creator.saveSurveyFunc = (saveNo, callback) => {
    saveSurveyToFirestore(); // Save to Firestore on Save button click
    callback(saveNo, true);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar with saved surveys */}
      <div style={{ width: "300px", padding: "10px", borderRight: "1px solid #ccc" }}>
        <h3>Saved Surveys</h3>
        <ul>
          {savedSurveys.map((survey) => (
            <li
              key={survey.id}
              style={{ cursor: "pointer", marginBottom: "10px" }}
              onClick={() => fetchSurveyResults(survey.id)}
            >
              {survey.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Survey Creator */}
      <div style={{ flex: 1, padding: "10px" }}>
        <SurveyCreatorComponent creator={creator} />
      </div>
    </div>
  );
}

export default SurveyCreatorRenderComponent;
