import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import graduationIcon from "../../assets/graduation-hat.png";

const features = [
  "Java",
  "Python",
  "Full Stack Development",
  "Blockchain",
  "Data Science and Analytics",
  "Natural Language Processing",
  "Data Structures and Algorithms",
  "Quantitative Aptitude",
  "Verbal Ability & English Skills",
  "C",
  "Design Analysis of Algorithms",
  "Generative AI Engineering",
  "SQL",
  "Cloud Computation",
];

const MAX_SELECTION = 10;

const FeatureSelection = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : prev.length < MAX_SELECTION
        ? [...prev, feature]
        : prev
    );
  };

  const handleRemove = (feature: string) => {
    setSelectedFeatures((prev) => prev.filter((item) => item !== feature));
  };

  const handleSubmit = () => {
    console.log("Selected Features:", selectedFeatures);
  };

  const filteredFeatures = features.filter((feature) =>
    feature.toLowerCase().includes(search.toLowerCase())
  );

  const progress = (selectedFeatures.length / MAX_SELECTION) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="w-full min-h-screen flex flex-col items-center justify-start bg-black text-green-400 p-6 pt-16 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-green-700 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-700 opacity-30 rounded-full blur-3xl"></div>

      {/* Heading */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <h1 className="text-xl font-bold text-gray-400">Let's Build Your Study Space</h1>
          <img
            src={graduationIcon}
            alt="Graduation Icon"
            className="w-10 h-10"
          />
        </div>
        <h2 className="text-2xl font-extrabold text-white">
          Pick the Features That Fit Your Study Style!
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-10">
          Choose Wisely – Your Future Self is Watching!
        </p>
      </div>

      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search for a course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-4/5 md:w-3/5 p-3 border border-green-500 bg-white text-black rounded-full shadow-md relative z-10 mb-12"
      />

      {/* Progress Bar */}
      <div className="w-4/5 md:w-2/5 mb-6 relative z-10">
        <div className="w-full bg-green-900 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Selected Feature Chips */}
      {selectedFeatures.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-3xl relative z-10">
          {selectedFeatures.map((feature) => (
            <span
              key={feature}
              className="bg-green-600 text-black px-4 py-2 rounded-full text-sm font-medium shadow cursor-pointer hover:bg-red-500 transition"
              onClick={() => handleRemove(feature)}
            >
              {feature} ✕
            </span>
          ))}
        </div>
      )}

      {/* Feature List */}
      <div className="flex flex-wrap justify-center gap-4 mt-0 max-w-3xl relative z-10">
        {filteredFeatures.map((feature, idx) => (
          <motion.button
            key={feature}
            onClick={() => handleFeatureChange(feature)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className={`px-6 py-3 text-sm rounded-xl font-medium shadow-md transition-all duration-200 ease-in-out ${
              selectedFeatures.includes(feature)
                ? "bg-green-500 text-black"
                : "bg-green-900 text-green-300"
            } hover:bg-green-600 hover:text-black hover:bg-opacity-80`}
            style={{ opacity: "0.9" }}
          >
            {feature}
          </motion.button>
        ))}
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 relative z-10"
      >
        <Button
          className="px-10 py-4 text-lg rounded-full shadow-lg transition-all duration-200 ease-in-out hover:brightness-110 hover:scale-105"
          style={{ backgroundColor: "#85CBA0", color: "black" }}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default FeatureSelection;
