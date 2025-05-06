exports.syncWithNotion = async (req, res) => {
    try {
      // Example: sync plans to Notion
      // Notion API logic here
      res.json({ message: 'Synced with Notion' });
    } catch (err) {
      res.status(500).json({ error: 'Notion sync failed', details: err.message });
    }
  };
  
  exports.syncWithGoogleCalendar = async (req, res) => {
    try {
      // Example: add study sessions to Google Calendar
      // Google Calendar API logic here
      res.json({ message: 'Synced with Google Calendar' });
    } catch (err) {
      res.status(500).json({ error: 'Calendar sync failed', details: err.message });
    }
  };
  