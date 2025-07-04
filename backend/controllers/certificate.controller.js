// // // // const { User, Course, QuizAttempt } = require('../models');
// // // // const path = require('path');
// // // // const generateCertificate = require('../utils/certificateGenerator');

// // // // exports.getCertificate = async (req, res) => {
// // // //   const { courseId, userId } = req.params;

// // // //   try {
// // // //     const user = await User.findByPk(userId);
// // // //     const course = await Course.findByPk(courseId);

// // // //     if (!user || !course) {
// // // //       return res.status(404).json({ error: 'User or course not found' });
// // // //     }

// // // //     const quiz = await QuizAttempt.findOne({
// // // //       where: { user_id: userId, course_id: courseId },
// // // //     });

// // // //     if (!quiz) {
// // // //       return res.status(400).json({ error: 'Please complete the quiz to get the certificate' });
// // // //     }

// // // //     if (!quiz.passed) {
// // // //       return res.status(403).json({ error: 'You need to pass the quiz to get the certificate' });
// // // //     }

// // // //     const filename = await generateCertificate(user, course);
// // // //     const filePath = path.join(__dirname, '../public/certificates', filename);

// // // //     res.download(filePath); // Send file for download
// // // //   } catch (error) {
// // // //     console.error('Certificate generation failed:', error);
// // // //     res.status(500).json({ error: 'Internal Server Error' });
// // // //   }
// // // // };
// // // // // const { User, Course, QuizAttempt } = require('../models');
// // // // // const generateCertificate = require('../utils/certificateGenerator');

// // // // // exports.getCertificate = async (req, res) => {
// // // // //   const { userId, courseId } = req.params;

// // // // //   try {
// // // // //     const user = await User.findByPk(userId);
// // // // //     const course = await Course.findByPk(courseId);
// // // // //     const attempt = await QuizAttempt.findOne({ where: { user_id: userId, course_id: courseId } });

// // // // //     if (!user || !course) {
// // // // //       return res.status(404).json({ message: 'User or course not found.' });
// // // // //     }

// // // // //     if (!attempt) {
// // // // //       return res.status(403).json({ message: 'Complete the quiz to receive your certificate.' });
// // // // //     }

// // // // //     if (!attempt.passed) {
// // // // //       return res.status(403).json({ message: 'You haven\'t passed the quiz yet. Try again!' });
// // // // //     }

// // // // //     const fileName = await generateCertificate(user, course);
// // // // //     return res.status(200).json({
// // // // //       message: 'Certificate generated successfully.',
// // // // //       downloadUrl: `/certificates/${fileName}`,
// // // // //     });

// // // // //   } catch (err) {
// // // // //     console.error('Certificate Error:', err);
// // // // //     res.status(500).json({ message: 'Internal server error.' });
// // // // //   }
// // // // // };
// // // const { User, Course, QuizAttempt } = require('../models');
// // // const path = require('path');
// // // const fs = require('fs');
// // // const generateCertificate = require('../utils/certificateGenerator');

// // // exports.getCertificate = async (req, res) => {
// // //   const { courseId, userId } = req.params;

// // //   try {
// // //     const user = await User.findByPk(userId);
// // //     const course = await Course.findByPk(courseId);

// // //     if (!user || !course) {
// // //       return res.status(404).json({ error: 'User or course not found.' });
// // //     }

// // //     const quiz = await QuizAttempt.findOne({
// // //       where: { user_id: userId, course_id: courseId },
// // //     });

// // //     if (!quiz) {
// // //       return res.status(400).json({ error: 'Please complete the quiz to generate the certificate.' });
// // //     }

// // //     if (!quiz.passed) {
// // //       return res.status(403).json({ error: 'You must pass the quiz to receive the certificate.' });
// // //     }

// // //     const fileName = `${user.id}_${course.id}.pdf`;
// // //     const filePath = path.join(__dirname, '../public/certificates', fileName);

// // //     // Check if file already exists (reuse it if it does)
// // //     if (!fs.existsSync(filePath)) {
// // //       await generateCertificate(user, course);
// // //     }

// // //     // Send the file as a download
// // //     res.download(filePath, fileName, (err) => {
// // //       if (err) {
// // //         console.error('Error sending certificate:', err);
// // //         return res.status(500).json({ error: 'Failed to send certificate file.' });
// // //       }
// // //     });

// // //   } catch (error) {
// // //     console.error('Certificate generation failed:', error);
// // //     res.status(500).json({ error: 'Internal server error while generating certificate.' });
// // //   }
// // // };
// // const { User, Course, QuizAttempt } = require('../models');
// // const path = require('path');
// // const fs = require('fs');
// // const generateCertificate = require('../utils/certificateGenerator');

// // exports.getCertificate = async (req, res) => {
// //   const { courseId, userId } = req.params;

// //   try {
// //     const user = await User.findByPk(userId);
// //     const course = await Course.findByPk(courseId);

// //     if (!user || !course) {
// //       return res.status(404).json({ error: 'User or course not found' });
// //     }

// //     const quiz = await QuizAttempt.findOne({
// //       where: { user_id: userId, course_id: courseId },
// //     });

// //     if (!quiz) {
// //       return res.status(400).json({ error: 'Please complete the quiz to get the certificate' });
// //     }

// //     if (!quiz.passed) {
// //       return res.status(403).json({ error: 'You need to pass the quiz to get the certificate' });
// //     }

// //     const filename = await generateCertificate(user, course);
// //     const filePath = path.join(__dirname, '../public/certificates', filename);

// //     if (!fs.existsSync(filePath)) {
// //       return res.status(500).json({ error: 'Certificate generation failed' });
// //     }

// //     const downloadURL = `http://localhost:5000/certificates/${filename}`;
// //     return res.status(200).json({ success: true, url: downloadURL });

// //   } catch (error) {
// //     console.error('Certificate generation failed:', error);
// //     return res.status(500).json({ error: 'Internal Server Error' });
// //   }
// // };
// const { User, Course, QuizAttempt } = require('../models');
// const path = require('path');
// const fs = require('fs');
// const generateCertificate = require('../utils/certificateGenerator');

// exports.getCertificate = async (req, res) => {
//   const { courseId, userId } = req.params;

//   try {
//     const user = await User.findByPk(userId);
//     const course = await Course.findByPk(courseId);

//     if (!user || !course) {
//       return res.status(404).json({ error: 'User or course not found' });
//     }

//     const quiz = await QuizAttempt.findOne({
//       where: { user_id: userId, course_id: courseId },
//     });

//     if (!quiz) {
//       return res.status(400).json({ error: 'Complete the quiz to receive a certificate' });
//     }

//     if (!quiz.passed) {
//       return res.status(403).json({ error: 'You must pass the quiz to get the certificate' });
//     }

//     const filename = `${userId}_${courseId}.pdf`;
//     const filePath = path.join(__dirname, '../public/certificates', filename);

//     // 📄 If certificate doesn't exist, generate it
//     if (!fs.existsSync(filePath)) {
//       await generateCertificate(user, course);
//     }

//     // 🎯 Send the file directly for download
//     return res.download(filePath, `${course.course_name}_Certificate.pdf`);

//   } catch (error) {
//     console.error('❌ Certificate generation failed:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
const { User, Course, QuizAttempt } = require('../models');
const generateCertificate = require('../utils/certificateGenerator'); // this will return a PDF buffer

exports.getCertificate = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.session.userId;
  try {
    const user = await User.findByPk(userId);
    const course = await Course.findByPk(courseId);

    if (!user || !course) {
      return res.status(404).json({ error: 'User or course not found' });
    }

    const quiz = await QuizAttempt.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    if (!quiz) {
      return res.status(400).json({ error: 'Complete the quiz to receive a certificate' });
    }

    if (!quiz.passed) {
      return res.status(403).json({ error: 'You must pass the quiz to get the certificate' });
    }

    // 🧠 Generate the PDF certificate in memory
    const pdfBuffer = await generateCertificate(user, course); // <-- this must return Buffer

    // 📤 Stream PDF directly to user (no file saved)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${course.course_name}_Certificate.pdf"`);
    return res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Certificate generation failed:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
