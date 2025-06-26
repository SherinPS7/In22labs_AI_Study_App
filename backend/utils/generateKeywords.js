const openai = require('../config/openai');
const db = require('../models');
const { fetchVideo } = require('./fetchVideo');
const Keywords = db.Keywords;


async function generateKeywords(courseName, courseId){
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: `You are an expert curriculum planner. When given a course name or description, respond ONLY with a JSON object structured like this:

{
  "course": "Course Name",
  "topics": [
    "Topic 1",
    "Topic 2"
  ]
}

Do not include any explanations or extra text. Minimize the number of topics to 3 to 6 based on requirement.`
        },
        {
          role: 'user',
          content: `Course: ${courseName}`
        }
      ],
      temperature: 0.3
    });

    const rawContent = response.choices[0].message.content;

    let topicsJson;
    try {
      topicsJson = JSON.parse(rawContent);
    } catch (err) {
      return { success: false, raw: rawContent, error: 'Failed to parse GPT response' };
    }

    // Store in Keywords table
    const keywords = topicsJson.topics;
    const createdVideos = [];

    for(const keyword of keywords) {
      const keywordEntry = await Keywords.create({
        keyword,
        course_id_foreign_key: courseId
      });
      

      const video = await fetchVideo(keyword, courseId);
      if(video?.success) {
        createdVideos.push(video.video.video_title);
      }

    }

    return { success: true, topics: keywords, videosGenerated : createdVideos };
  } catch (err) {
    console.error('Error generating keywords or videos:', err);
    return { success: false, error: err.message };
  }
};

module.exports = generateKeywords;
