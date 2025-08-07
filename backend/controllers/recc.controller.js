const { UserFeatures, Videos, Course, Keywords } = require("../models");
const { Op } = require("sequelize");

exports.getRecommendations = async (req, res) => {
  const user_id_foreign_key = req.session.userId;
  if (!user_id_foreign_key) {
    console.log("🚫 Unauthorized: No session use found.");
    return res.status(401).json({ message: "Unauthorized: No session user found." });
  }

  try {
    // 1. Get user's selected keywords/features
    const userFeatures = await UserFeatures.findOne({
      where: { user_id: user_id_foreign_key }
    });
    console.log("📝 User features fetched:", userFeatures?.selected_features);

    if (!userFeatures || !userFeatures.selected_features?.length) {
      console.log("⚠️ No selected features found for user.");
      return res.status(404).json({ message: "No selected features found for this user." });
    }

    const selectedKeywords = userFeatures.selected_features.map(k => k.toLowerCase());

    // 2. Search Courses where course_name ILIKE matches any selected keyword (partial match)
    const courseNameMatches = await Course.findAll({
      where: {
        [Op.or]: selectedKeywords.map(keyword => ({
          course_name: { [Op.iLike]: `%${keyword}%` }
        }))
      },
      include: [{ model: Keywords, attributes: ['keyword'] }] // included keywords for scoring
    });
    console.log(`🔍 Courses matched by course_name: found ${courseNameMatches.length}`);

    const scoredCoursesMap = new Map();

    // Score for course name matches (+3) + keyword matches (+1 per keyword)
    courseNameMatches.forEach(course => {
      const courseNameLower = course.course_name.toLowerCase();
      let score = 0;

      if (selectedKeywords.some(kw => courseNameLower.includes(kw))) {
        score += 3;
      }

      let keywordMatchCount = 0;
      if (Array.isArray(course.Keywords)) {
        keywordMatchCount = course.Keywords.filter(k =>
          selectedKeywords.some(sk => k.keyword.toLowerCase().includes(sk))
        ).length;
      }
      score += keywordMatchCount;

      scoredCoursesMap.set(course.id, { course, score });

      console.log(`✅ Scored course (name match): ${course.course_name} with score ${score}`);
    });

    // 3. If fewer than 3 matched, search keywords table excluding already matched courses (use Op.iLike for partial matching)
    if (scoredCoursesMap.size < 3) {
      const excludedCourseIds = Array.from(scoredCoursesMap.keys());
      console.log(`ℹ️ Less than 3 courses found by name. Searching keywords excluding:`, excludedCourseIds);

      // Build partial matching OR conditions for keywords
      const keywordConditions = selectedKeywords.map(kw => ({
        keyword: { [Op.iLike]: `%${kw}%` }
      }));

      const keywordMatches = await Keywords.findAll({
        where: {
          [Op.and]: [
            { [Op.or]: keywordConditions },
            { course_id_foreign_key: { [Op.notIn]: excludedCourseIds } }
          ]
        },
        include: [{ model: Course, include: [{ model: Keywords, attributes: ['keyword'] }] }],
      });
      console.log(`🔍 Keyword table matches found: ${keywordMatches.length}`);

      for (const kw of keywordMatches) {
        const course = kw.Course;
        if (!course || scoredCoursesMap.has(course.id)) continue;

        let score = 0;
        const courseKeywords = course.Keywords || [];
        // Partial match count for keywords:
        const keywordMatchCount = courseKeywords.filter(k =>
          selectedKeywords.some(sk => k.keyword.toLowerCase().includes(sk))
        ).length;
        score += keywordMatchCount;

        scoredCoursesMap.set(course.id, { course, score });
        console.log(`✅ Scored course (keyword match): ${course.course_name} with score ${score}`);
      }
    }

    if (scoredCoursesMap.size === 0) {
      console.log("⚠️ No matched courses found at all.");
      return res.status(404).json({ message: "No matched courses found." });
    }

    // 4. Sort all scored courses descending by score and pick top 3
    const scoredCoursesArray = Array.from(scoredCoursesMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    console.log("🔝 Top courses after scoring and sorting:");
    scoredCoursesArray.forEach(({ course, score }, idx) => {
      console.log(`   #${idx + 1}: ${course.course_name} (Score: ${score})`);
    });

    // 5. Fetch first videos for these top courses
    const courseIds = scoredCoursesArray.map(item => item.course.id);
    const firstVideos = await Videos.findAll({
      where: { course_id_foreign_key: { [Op.in]: courseIds } },
      order: [['createdAt', 'ASC']],
      attributes: ['course_id_foreign_key', 'video_url'],
    });

    const firstVideoMap = new Map();
    for (const video of firstVideos) {
      if (!firstVideoMap.has(video.course_id_foreign_key)) {
        firstVideoMap.set(video.course_id_foreign_key, video.video_url);
      }
    }
    console.log("🎬 First videos fetched for top courses.");

    // Build final recommendations payload
    const recommendations = scoredCoursesArray.map(({ course, score }) => ({
      id: course.id,
      course_name: course.course_name,
      user_id_foreign_key: course.user_id_foreign_key,
      first_video_url: firstVideoMap.get(course.id) || null,
      score,
    }));

    return res.status(200).json({ recommendations });

  } catch (error) {
    console.error("❌ Error in getRecommendations:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
