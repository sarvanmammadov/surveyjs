import React from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/survey.i18n.js";
import "survey-creator-core/survey-creator-core.i18n.js";
// import { surveyJSON } from "./survey_json";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.min.css";
// import "./index.css";

function SurveyCreatorRenderComponent() {

    const options = {
        showLogicTab: true
    };
    const creator = new SurveyCreator({
      showDesignerTab: true,
      showPreviewTab: true,
      showThemeTab: true,
      showLogicTab: true,
      showJSONEditorTab: false,
      showTranslationTab: true,
    });
    creator.saveThemeFunc = () => {
      localStorage.setItem("surveyTheme", JSON.stringify(creator?.theme));
    };
    creator.onStateChanged.add(() => {
      localStorage.setItem(surveyId, JSON.stringify(creator.JSON));
    }); 
    // creator.JSON = surveyJSON;
    return (<SurveyCreatorComponent creator={creator} />);
}

export default SurveyCreatorRenderComponent;