
// import { ArrowDown, ArrowUp, ArrowUpDown, Crown, Plus } from "lucide-react"
import { useEffect, useState } from "react";
import { Link, Router, useNavigate, useParams } from "react-router-dom"
import CourseOverviewContent from "./courseOverviewContent";
import axios from "axios";
import { CourseOverviewBreadCrumbs } from "./breadcrumbs";


const CourseOverview = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { courseId } = useParams();

  const [courseName, setCourseName] = useState("");
  const [courseKeywords, setCourseKeywords] = useState([]);


  useEffect(() => {
      const getCourseName = async () => {

      try {
        const response = await axios.get(`${backendURL}/courses/${courseId}`, {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        setCourseName(response.data.course_name);
      }
      catch (error) {
        console.error("Error fetching course name:", error);
      }
    };
    getCourseName();
  }, [courseId, backendURL]);

  const [isEnrolled, setIsEnrolled] = useState(false);

useEffect(() => {
  const ifAlreadyEnrolled = async () => {
    try {
      const response = await axios.get(`${backendURL}/courses/user/2`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const enrolledCourses = response.data;
      console.log("Enrolled Courses:", enrolledCourses);

      const foundCourse = enrolledCourses.find((course: { ref_course_id: number; id: number }) =>
        course.ref_course_id === Number(courseId) || course.id === Number(courseId)
      );

      setIsEnrolled(foundCourse);
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  ifAlreadyEnrolled();
}, [backendURL, courseId]);



  useEffect(() => {
    const getCourseKeywords = async () => {
      
      try {
        const response = await axios.get(`${backendURL}/keywords/course/${courseId}` , {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const keywords = response.data.map((element: { keyword: String; }) => element.keyword);
        setCourseKeywords(keywords);
      }
      catch (error) {
        console.error("Error fetching course keywords:", error);
      }
    }
    getCourseKeywords();
  },[courseId, backendURL]);


const [showEnrollConfirm, setShowEnrollConfirm] = useState(false);
const handleEnroll = () => {
  setShowEnrollConfirm(true); // open the confirmation popup
};

const navigate = useNavigate();

const confirmEnrollment = async () => {
  try {
    await axios.post(`${backendURL}/courses/enroll`, {
      courseId,
    }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    setShowEnrollConfirm(false); // close popup
    navigate("/mylearnings");
  } catch (error) {
    console.error("Enrollment failed:", error);
    // setShowEnrollConfirm(false);
  }
};





  return (
    <div className="w-full p-4" style={{marginTop: "1rem"}}>
        <main className="flex justify-start md:justify-between items-start md:items-center flex-col md:flex-row gap-4 flex-wrap">
           <main className="flex justify-between items-start w-full flex-wrap gap-4">
  <div className="flex flex-col gap-1">
    <CourseOverviewBreadCrumbs courseName={courseName.toUpperCase()} />
  </div>

  {/* <div>
    <button
      className="enroll-course-btn"
      onClick={handleEnroll}
      style={{ marginRight: "1rem",marginTop:"-1rem" }}
    >
      Enroll Course
    </button>
  </div> */}
  <div>
    <button
      className="enroll-course-btn"
      onClick={!isEnrolled ? handleEnroll : undefined}
      disabled={isEnrolled}
      style={{
        marginRight: "0rem",
        marginTop: "-1rem",
        backgroundColor: isEnrolled ? "gray" : "", // change style when disabled
        cursor: isEnrolled ? "not-allowed" : "pointer",
        opacity: isEnrolled ? 0.7 : 1
      }}
    >
      {isEnrolled ? "Already Enrolled" : "Enroll Course"}
    </button>
  </div>

</main>
{showEnrollConfirm && (
  <div className="modal-overlay" onClick={() => setShowEnrollConfirm(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-title">Confirm Enrollment</h2>
      <p style={{ marginTop: "0.5rem", marginBottom: "1.5rem" }}>
        Are you sure you want to enroll in this course?
      </p>
      <div className="modal-actions">
        <button
          className="modal-cancel"
          onClick={() => setShowEnrollConfirm(false)}
        >
          Cancel
        </button>
        <button className="modal-create" onClick={confirmEnrollment}>
          Yes, Enroll
        </button>
      </div>
    </div>
  </div>
)}

          
          {/* <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginLeft: "1rem", marginTop: "1rem" }}>
            
            {courseKeywords.map((keyword, index) => (
              <button 
                key={index} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  padding: "0.5rem 1rem", 
                  backgroundColor: "rgb(9, 175, 103)", 
                  borderRadius: "1rem", 
                  border: "none", 
                  cursor: "default",
                  margin: '5px',
                  fontSize: "14px"
                }} 
                disabled
              >
                {keyword}
              </button>
            ))}
          </div> */}
<div
  style={{
    width: "100%",
    marginTop: "1rem",
    padding: "1.5rem 2rem",
    // backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.6)",
    color: "rgb(214, 255, 219)",
    fontFamily: "monospace",
  }}
>
    <h3
    style={{
      fontSize: "22px",
      fontWeight: 600,
      marginBottom: "1rem",
      borderBottom: "1px solid #2e2e2e",
      paddingBottom: "0.5rem",
    }}
  >
    What you will learn
  </h3>
  <ul
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)", // fixed 3 equal-width columns
      gap: "0.75rem 2rem",
      paddingLeft: "1rem",
      listStyleType: "disc",
      margin: 0,
    }}
  >
    {courseKeywords.map((keyword, index) => (
      <li
        key={index}
        style={{
          fontSize: "15px",
          lineHeight: "1.6",
          wordBreak: "break-word",
          opacity: 0.9,
        }}
      >
        {keyword}
      </li>
    ))}
  </ul>
</div>






        </main>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <CourseOverviewContent courseId={courseId ?? ""} />
        </div>
        {/* <div>
          <Quizes />
        </div>
        <div>
          <FinalAssessment />
        </div>
        <div>
          <AlternativeContent />
        </div> */}
    </div>
  )
}

export default CourseOverview;
