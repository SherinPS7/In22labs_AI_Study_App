
import { ArrowDown, ArrowUp, ArrowUpDown, Crown, Plus } from "lucide-react"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import Content from "./content";
import Quizes from "./quizes";
import FinalAssessment from "./finalAssessment";
import AlternativeContent from "./alternativeContent";
import axios from "axios";


const CourseContent = () => {
  

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { courseId } = useParams();
 // const userId = Number(localStorage.getItem("userId")); // 
 const userId = 27; // ✅ Temporary static userId for testing

type Keyword = {
  id: number;
  keyword: string;
};
  const [courseName, setCourseName] = useState("");
  //const [courseKeywords, setCourseKeywords] = useState([]);
const [courseKeywords, setCourseKeywords] = useState<Keyword[]>([]);

  const [sortOrder, setSortOrder] = useState("");
  const [sortViewCount, setSortViewCount] = useState("");
  const [sortLikes, setSortLikes] = useState("");
console.log("Course ID (static):", courseId);

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

  useEffect(() => {
    const getCourseKeywords = async () => {
      
      try {
        const response = await axios.get(`${backendURL}/keywords/course/${courseId}` , {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        // const keywords = response.data.map((element: { keyword: String; }) => element.keyword);
        // setCourseKeywords(keywords);
        setCourseKeywords(response.data); // full objects with id + keyword

      //  
      // 🔍 Extract keyword IDs
      const keywordIds = response.data.map((k: { id: number }) => k.id);
      console.log("Keyword IDs:", keywordIds);
    } catch (error) {
      console.error("Error fetching course keywords:", error);
      }
    }
    getCourseKeywords();
  },[courseId, backendURL]);

// Convert courseKeywords into array of keyword IDs
const keywordIds = courseKeywords.map((keywordObj: any) => keywordObj.id);
  const handleSortChange = () => {
    if(sortOrder === "") {
      setSortOrder('asc');
    }
    else if(sortOrder === "asc") {
      setSortOrder("desc");
    }
    else {
      setSortOrder("");
    }
  };

  const handleSortViewCountChange = () => {
    if(sortViewCount === "") {
      setSortViewCount('asc');
    }
    else if(sortViewCount === "asc") {
      setSortViewCount("desc");
    }
    else {
      setSortViewCount("");
    }
  };

  const handleSortLikesChange = () => {
    if(sortLikes === "") {
      setSortLikes('asc');
    }
    else if(sortLikes === "asc") {
      setSortLikes("desc");
    }
    else {
      setSortLikes("");
    }
  };



  const getPopularityButtonContent = () => {
    if (sortOrder === "") {
      return { popularityLabel: 'Sort by Popularity', popularityIcon: <ArrowUpDown size={16} /> };
    } else if (sortOrder === 'desc') {
      return { popularityLabel: 'Most Popular', popularityIcon: <ArrowDown size={16} /> };
    } else {
      return { popularityLabel: 'Least Popular', popularityIcon: <ArrowUp size={16} /> };
    }
  };

  const getLikeButtonContent = () => {
    if (sortLikes === "") {
      return { likeLabel: 'Sort by Likes', likeIcon: <ArrowUpDown size={16} /> };
    } else if (sortLikes === 'desc') {
      return { likeLabel: 'Most Liked', likeIcon: <ArrowDown size={16} /> };
    } else {
      return { likeLabel: 'Least Liked', likeIcon: <ArrowUp size={16} /> };
    }
  };

  const getViewCountButtonContent = () => {
    if (sortViewCount === "") {
      return { viewCountLabel: 'Sort by View Count', viewCountIcon: <ArrowUpDown size={16} /> };
    } else if (sortViewCount === 'desc') {
      return { viewCountLabel: 'Most Viewed', viewCountIcon: <ArrowDown size={16} /> };
    } else {
      return { viewCountLabel: 'Least Viewed', viewCountIcon: <ArrowUp size={16} /> };
    }
  };

  // const { popularityLabel, popularityIcon } = getPopularityButtonContent();
  // const { likeLabel, likeIcon} = getLikeButtonContent();
  // const { viewCountLabel, viewCountIcon } = getViewCountButtonContent();


  return (
    <div className="w-full p-4" style={{marginTop: "2rem"}}>
        <main className="flex justify-start md:justify-between items-start md:items-center flex-col md:flex-row gap-4 flex-wrap">
            <main className="flex flex-col gap-1">
                <span className="text-3xl font-semibold tracking-tight text-foreground" 
                      style={{ fontFamily: "Poppins", fontSize: "40px",marginLeft: "1rem" }}>
                    {courseName.toUpperCase()}
                </span>
            </main>
          {/* <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div id="popularity-sort">
              <button 
                onClick={handleSortChange}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "transparent", borderRadius: "8px", border: "none", cursor: "pointer",color:"rgb(195, 246, 224)" }} 
              >
                <span>{popularityLabel}</span>
                {popularityIcon}
              </button>
            </div>
            <div id="viewcount-sort">
              <button 
                onClick={handleSortViewCountChange}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "transparent", borderRadius: "8px", border: "none", cursor: "pointer",color:"rgb(195, 246, 224)"  }} 
              >
                <span>{viewCountLabel}</span>
                {viewCountIcon}
              </button>
            </div>
            <div id="likes-sort">
              <button 
                onClick={handleSortLikesChange}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "transparent", borderRadius: "8px", border: "none", cursor: "pointer",color:"rgb(195, 246, 224)"  }} 
              >
                <span>{likeLabel}</span>
                {likeIcon}
              </button>
            </div>
          </div> */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginLeft: "1rem", marginTop: "1rem" }}>
            {/* <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "rgb(9, 175, 103)", borderRadius: "15px", border: "none", cursor: "default" , margin: '5px', fontSize: "14px"}} disabled>
              content1
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "rgb(9, 175, 103)", borderRadius: "15px", border: "none", cursor: "default", fontSize: "14px" , margin: '5px'}} disabled>
              content1
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "rgb(9, 175, 103)", borderRadius: "15px", border: "none", cursor: "default" , margin: '5px', fontSize: "14px"}} disabled>
              content1
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "rgb(9, 175, 103)", borderRadius: "15px", border: "none", cursor: "default" , margin: '5px', fontSize: "14px"}} disabled>
              content1
            </button> */}
            {courseKeywords.map((keywordObj, index) => (
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
                {keywordObj.keyword}
              </button>
            ))}
          </div>

        </main>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Content courseId={courseId ?? ""} />
        </div>
        <div>
          <Quizes />
        </div>
        <div>
          {/* <FinalAssessment /> */}
          <FinalAssessment userId={userId} keywordIds={keywordIds} />

        </div>
        <div>
          <AlternativeContent />
        </div>
    </div>
  )
}

export default CourseContent;

function async() {
  throw new Error("Function not implemented.");
}
