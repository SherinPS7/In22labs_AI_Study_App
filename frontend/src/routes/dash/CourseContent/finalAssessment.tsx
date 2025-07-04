import { Button } from "@/components/ui/button"
import certificate from "../../../assets/CourseContent/certificate.png"


const FinalAssessment = () => {




  return (
    <div style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem", flexDirection: "column" }}>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem",flexDirection: "column" }}>
        <span style={{fontSize: "32px",fontFamily:"monospace", fontWeight: "bold", color: "#fff"}}>
          Final Assessment
        </span>
        <span style={{fontSize: "14px",fontFamily:"poppins", fontWeight: "bold", color: "GrayText"}}>
          *A minmum of 70% is required to pass the final assessment
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "1rem", marginTop: "1rem" }}>
        <Button style={{backgroundColor:"rgb(2, 200, 114) "}}>Take Assessment</Button>
      </div>
      <div style={{marginTop: "1rem", display: "flex", alignItems: "center",}}>
        <div>
          <span style={{ marginLeft: "1rem", fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
            Your Score : -/15
          </span>
        </div>
      </div>
      <div style={{ marginTop: "1rem", display: "flex", alignItems: "center" }}>
        <span style={{ marginLeft: "1rem", fontSize: "18px", fontWeight: "bold", color: "GrayText" }}>
          Get your certificate of completion{" "}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                // Add your click handler logic here
                console.log("Certificate clicked");
              }}
              style={{ 
                color: "#3b82f6", 
                textDecoration: "underline",
                cursor: "pointer" 
              }}
              >
              click here
            </a>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginLeft: "1rem", marginTop: "1rem",justifyContent: "center"}}>
        <img
          src={certificate}
        />
      </div>
    </div>
  )
}

export default FinalAssessment