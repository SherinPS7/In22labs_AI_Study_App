import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Course = {
  id: number;
  course_name: string;
};

type Props = {
  onResults?: (courses: Course[]) => void;
};

const SearchBar = ({ onResults }: Props) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Course[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        axios
          .get(`${backendURL}/courses/course/search?query=${searchTerm}`, {
            withCredentials: true,
          })
          .then((res) => {
            setResults(res.data);
            setShowDropdown(true);
            onResults?.(res.data);
          })
          .catch((err) => console.error("Search error:", err));
      } else {
        setResults([]);
        setShowDropdown(false);
        onResults?.([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  return (
    <div className="relative w-full md:w-[58rem]" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search courses..."
        className="w-full px-4 py-2 text-sm rounded-full bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-[#1a1a1a] border border-[#333] rounded-md shadow-xl max-h-64 overflow-y-auto text-sm text-white">
          {results.map((course) => (
            <li
              key={course.id}
              className="px-4 py-2 hover:bg-[#2b2b2b] transition-colors cursor-pointer"
              onClick={() => {
                setSearchTerm(course.course_name);
                setShowDropdown(false);
                navigate(`/course-overview/${course.id}`);
              }}
            >
              {toTitleCase(course.course_name)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
