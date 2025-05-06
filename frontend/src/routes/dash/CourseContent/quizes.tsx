import { Button } from "@/components/ui/button";
import { useState } from "react";
import "./courseContent.css"; // Link to the CSS file

const Quizes = () => {
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

  return (
    <div className="quizes-container">
      <div className="quizes-header">
        <span>Quizes</span>
      </div>

      <div className="quiz-item">
        <input
          type="checkbox"
          checked={isChecked1}
          onChange={() => setIsChecked1(!isChecked1)}
          className="quiz-checkbox"
        />
        <span className="quiz-title">Quiz on topic one</span>
        <div className="quiz-button">
          <Button style={{ backgroundColor: " #0bdc83 " }}>Take Test</Button>
        </div>
      </div>

      <div className="quiz-item">
        <input
          type="checkbox"
          checked={isChecked2}
          onChange={() => setIsChecked2(!isChecked2)}
          className="quiz-checkbox"
        />
        <span className="quiz-title">Quiz on topic two</span>
        <div className="quiz-button">
          <Button style={{ backgroundColor: " #0bdc83 " }}>Take Test</Button>
        </div>
      </div>
    </div>
  );
};

export default Quizes;
