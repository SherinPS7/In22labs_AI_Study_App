// controllers/notionController.js

const notion = require('../config/notion');

const testConnection = async (req, res) => {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    // Simple call to list pages in the database
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 3, // Limit the number of pages for test
    });

    res.status(200).json({
      message: ' Notion connection successful!',
      pages: response.results.map((page) => ({
        id: page.id,
        created_time: page.created_time,
      })),
    });
  } catch (error) {
    console.error(' Notion API error:', error.body || error.message);
    res.status(500).json({
      message: 'Failed to connect to Notion',
      error: error.body || error.message,
    });
  }
};


const createUserStudyPlan = async (req, res) => {
  try {
    const userId = req.session.user?.id||5;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User not logged in.' });
    }

    const databaseId = process.env.NOTION_DATABASE_ID;

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: `Study Plan for User ${userId}`, // Or just "Study Plan"
              },
            },
          ],
        },
        UserId: {
          rich_text: [
            {
              text: {
                content: userId.toString(),
              },
            },
          ],
        },
      },
    });

    return res.status(201).json({
      message: '🆕 User Study Plan created!',
      pageId: response.id,
      url: response.url,
    });
  } catch (error) {
    console.error('Error creating user page:', error.body || error.message);
    res.status(500).json({
      message: 'Failed to create user page',
      error: error.body || error.message,
    });
  }
};


module.exports = {
  testConnection,
  createUserStudyPlan
};
