const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_SECRET });

function generateStudyTrackerRows(topics) {
  const rows = [];

  for (let i = 0; i < topics.length; i++) {
    rows.push({
      parent: {},
      properties: {
        Name: { title: [{ text: { content: topics[i] } }] },
        Topic: { rich_text: [{ text: { content: topics[i] } }] },
        ContentType: { select: { name: 'Video' } },
        Status: { select: { name: 'To Do' } },
        Completion: { number: 0 },
        Priority: { select: { name: 'Medium' } },
      },
    });
  }

  rows.push({
    parent: {},
    properties: {
      Name: { title: [{ text: { content: 'Final Exam' } }] },
      Topic: { rich_text: [{ text: { content: 'Full Course' } }] },
      ContentType: { select: { name: 'Final Exam' } },
      Status: { select: { name: 'To Do' } },
      Completion: { number: 0 },
      Priority: { select: { name: 'High' } },
    },
  });

  return rows;
}

async function createCourseMasterPlanInNotion(course, topics, videos) {
  const parentDatabaseId = process.env.NOTION_DATABASE_ID;

  let coursePage;
  try {
    coursePage = await notion.pages.create({
      parent: { database_id: parentDatabaseId },
      properties: {
        Name: { title: [{ text: { content: course.course_name } }] },
        CourseId: { number: Number(course.id) },
        UserId: { number: Number(course.user_id_foreign_key) },
        Progress: { number: course.progress ?? 0 },
      },
    });
  } catch (err) {
    console.error('❌ Failed to create course page:', err.message);
    return { success: false, error: err.message };
  }

  try {
    const trackerDb = await notion.databases.create({
      parent: { page_id: coursePage.id },
      title: [{ type: 'text', text: { content: '📊 Study Tracker' } }],
      properties: {
        Name: { title: {} },
        Topic: { rich_text: {} },
        ContentType: {
          select: {
            options: [
              { name: 'Video', color: 'blue' },
              { name: 'Quiz', color: 'yellow' },
              { name: 'Final Exam', color: 'red' },
            ],
          },
        },
        Status: {
          select: {
            options: [
              { name: 'To Do', color: 'gray' },
              { name: 'In Progress', color: 'orange' },
              { name: 'Done', color: 'green' },
            ],
          },
        },
        Completion: { number: {} },
        Priority: {
          select: {
            options: [
              { name: 'Low', color: 'green' },
              { name: 'Medium', color: 'yellow' },
              { name: 'High', color: 'red' },
            ],
          },
        },
        
      },
    });

    const rows = generateStudyTrackerRows(topics);

    for (const row of rows) {
      row.parent.database_id = trackerDb.id;
      await notion.pages.create(row);
    }

    return { success: true, pageId: coursePage.id, notionDatabaseId: trackerDb.id };
  } catch (err) {
    console.error('❌ Failed to create or populate child database:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { createCourseMasterPlanInNotion };
