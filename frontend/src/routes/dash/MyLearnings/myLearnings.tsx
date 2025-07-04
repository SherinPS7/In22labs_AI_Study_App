import { useEffect, useState } from "react";
import axios from "axios";
import "./myLearning.css";
import { Link } from "react-router-dom";

const MyLearnings = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const userId = 27; // Replace with actual userId if needed

  type Course = {
    id: number;
    course_name: string;
    createdAt: string;
    thumbnail: string;
    progress?: number;
  };

  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${backendURL}/courses/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setCourses(res.data);
        console.log("Enrolled Courses:", res.data);
      } catch (err) {
        console.error("Error fetching enrolled courses", err);
      }
    };

    fetchCourses();
  }, [backendURL, userId]);

  useEffect(() => {
    const fetchProgress = async () => {
      const updatedCourses = await Promise.all(
        courses.map(async (course) => {
          try {
            const res = await axios.get(`${backendURL}/videos/course/progress/${course.id}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const progress = (res.data.watchedVideos / res.data.totalVideos) * 100;
            return { ...course, progress: Math.round(progress) };
          } catch (err) {
            console.error(`Error fetching progress for course ${course.id}`, err);
            return { ...course, progress: 0 };
          }
        })
      );

      setCourses(updatedCourses);
    };

    if (courses.length > 0) {
      fetchProgress();
    }
  }, [backendURL, courses]);

  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const gradients = [
    "linear-gradient(135deg, #09af67,rgb(77, 96, 90))",
    "linear-gradient(135deg,rgb(24, 173, 118),rgb(64, 91, 91))",
    "linear-gradient(135deg,rgb(26, 90, 57),rgb(62, 70, 66))",
    "linear-gradient(135deg,rgb(48, 99, 76),rgb(88, 104, 116))",
    "linear-gradient(135deg,rgb(46, 98, 53),rgb(91, 180, 135))",
    "linear-gradient(135deg,rgb(39, 91, 85),rgb(94, 190, 209))",
    "linear-gradient(135deg,rgb(75, 128, 116),rgb(32, 55, 69))",
  ];

  const getGradientForCourse = (courseId: number) => {
    return gradients[courseId % gradients.length];
  };


  return (
    <div className="mycourses-container">
      <div className="mycourses-header">
        <h2 className="mycourses-heading" style={{ fontFamily: "Poppins", fontSize: "40px",marginLeft: "0rem" }}>MY LEARNINGS</h2>

        <input
          type="text"
          placeholder="Search your courses"
          className="course-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="course-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-thumbnail-placeholder"
              style={{ background: getGradientForCourse(course.id) }}
              >
                <span>{toTitleCase(course.course_name)}</span>
              </div>



              <div className="course-info">
                <h3 className="course-title">{toTitleCase(course.course_name)}</h3>
                <p className="course-date">Enrolled: {new Date(course.createdAt).toLocaleDateString()}</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${course.progress || 0}%` }}
                  ></div>
                </div>


                <Link to={`/course/${course.id}`} className="go-to-course">
                  Go to Course
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results-text">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default MyLearnings;
