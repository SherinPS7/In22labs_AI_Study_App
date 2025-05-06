import { useState } from "react";
import thumbnail from "../../../assets/CourseContent/thumbnail.png";
import profile from "../../../assets/CourseContent/Profile.png";
import "./courseContent.css";

const Content = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="content-container">
      <div className="content-header">
        <span>Content</span>
      </div>

      <div className="content-body">
        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="checkbox"
          />
        </div>

        <div className="content-details">
          <div className="thumbnail-container">
            <img src={thumbnail} className="thumbnail" />
          </div>

          <div className="video-details">
            <span className="video-title">Video content title</span>
            <span className="video-info">views / published on</span>
            <div className="author-details">
              <img src={profile} className="profile-img" />
              <span className="author-name">Author Name</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
