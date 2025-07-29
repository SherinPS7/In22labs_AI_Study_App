const { UserFeatures, Videos, Course } = require("../models");
const { Op, fn } = require("sequelize");


exports.getRecommendations = async (req, res) => {
  const user_id_foreign_key = req.session.userId;

  if (!user_id_foreign_key) {
    return res.status(401).json({ message: "Unauthorized: No session user found." });
  }

  try {
    // 1. Fetch selected features
    const userFeatures = await UserFeatures.findOne({
      where: { user_id: user_id_foreign_key }
    });

    if (!userFeatures || !userFeatures.selected_features?.length) {
      return res.status(404).json({ message: "No selected features found for this user." });
    }

    const selectedKeywords = userFeatures.selected_features;

    // 2. Find videos that match selected features in title
    const matchingVideos = await Videos.findAll({
      where: {
        [Op.or]: selectedKeywords.map(keyword => ({
          video_title: { [Op.iLike]: `%${keyword}%` }
        }))
      },
      include: [{ model: Course }]
    });

    // 3. Extract unique courses from matching videos
    const uniqueCourses = [];
    const seenCourseIds = new Set();

    for (const video of matchingVideos) {
      const course = video.Course;
      if (course && !seenCourseIds.has(course.id)) {
        seenCourseIds.add(course.id);

        const firstVideo = await Videos.findOne({
          where: { course_id_foreign_key: course.id },
          order: [['createdAt', 'ASC']],
        });

        uniqueCourses.push({
          id: course.id,
          course_name: course.course_name,
          user_id_foreign_key: course.user_id_foreign_key,
          first_video_url: firstVideo?.video_url || null,
        });
      }
    }

    // 4. Fallback: Random 3 courses if no matches
    if (uniqueCourses.length === 0) {
      const fallbackCourses = await Course.findAll({
        order: [[fn('RANDOM')]],
        limit: 3,
      });

      const fallbackWithVideos = await Promise.all(fallbackCourses.map(async (course) => {
        const firstVideo = await Videos.findOne({
          where: { course_id_foreign_key: course.id },
          order: [['createdAt', 'ASC']],
        });

        return {
          id: course.id,
          course_name: course.course_name,
          user_id_foreign_key: course.user_id_foreign_key,
          first_video_url: firstVideo?.video_url || null,
        };
      }));

      return res.status(200).json({ recommendations: fallbackWithVideos });
    }

    return res.status(200).json({ recommendations: uniqueCourses });

  } catch (error) {
    console.error("❌ Error in getRecommendations:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
