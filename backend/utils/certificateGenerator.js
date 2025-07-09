const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
//const getStream = require('get-stream'); 
const now = new Date();
const day = String(now.getDate()).padStart(2, '0');
const month = now.toLocaleString('default', { month: 'long' }); // e.g., July
const year = now.getFullYear();
const formattedDate = `${day} ${month} ${year}`;

module.exports = function generateCertificate(user, course) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [2000, 1414], // Exact Canva layout
    });
       // Capture PDF stream in memory
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

    // const fileName = `${user.id}_${course.id}.pdf`;
    // const filePath = path.join(__dirname, '../public/certificates', fileName);
    // const stream = fs.createWriteStream(filePath);
    // doc.pipe(stream);

    // ✅ Asset paths
    const fontPath = path.join(__dirname, '../assets/GreatVibes-Regular.ttf');
    const bgPath = path.join(__dirname, '../assets/certificate_template.png');
console.log("File exists:", fs.existsSync(fontPath));  
    // ✅ Load fonts
    if (fs.existsSync(fontPath)) {
      doc.registerFont('ScriptFont', fontPath);
    } else {
      console.warn('⚠️ Font not found. Falling back.');
      doc.registerFont('ScriptFont', 'Times-Roman');
    }
    doc.registerFont('Regular', 'Times-Roman');
    console.log("Font path:", fontPath);
console.log("Background path:", bgPath);

    // ✅ Background image
    if (fs.existsSync(bgPath)) {
      doc.image(bgPath, 0, 0, { width: 2000, height: 1414 });
    } else {
      doc.rect(0, 0, 2000, 1414).fill('#ffffff');
    }

    // 🎓 Student Name (unchanged)
    doc.font('ScriptFont')
      .fontSize(120)
      .fillColor('#c49a42')
      .text(`${user.first_name} ${user.last_name}`, 0, 600, {
        align: 'center',
      });

    // 📝 New formal paragraph (fills the space below the name)
    doc.font('Regular')
      .fontSize(32)
      .fillColor('#0d3b66')
      .text(
        `This certificate is proudly awarded in recognition of their exceptional commitment, perseverance, and achievement in successfully completing the "${course.course_name}" course. Their unwavering dedication to learning and pursuit of excellence reflect the highest standards of academic success and personal growth.`,
        120, // left/right padding for clean wrapping
        790, // position just below name
        {
          align: 'center',
          width: 1700,
          lineGap: 10,
        }
      );

    // 📅 Awarded on Date
    // doc.font('Regular')
    //   .fontSize(24)
    //   .fillColor('#0d3b66')
    //   .text(`Awarded on ${new Date().toDateString()}`, 0, 930, {
    //     align: 'center',
    //   });
    doc.font('Regular')
  .fontSize(24)
  .fillColor('#0d3b66')
  .text(`Awarded on ${formattedDate}`, 0, 930, {
    align: 'center',
  });
    // ✅ Finalize
    doc.end();

//     stream.on('finish', () => {
//       console.log('✅ Certificate generated:', fileName);
//       resolve(fileName);
//     });

//     stream.on('error', reject);
  });
};
