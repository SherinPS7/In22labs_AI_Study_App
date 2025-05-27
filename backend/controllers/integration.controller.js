const { google } = require('googleapis');
const { oauth2Client } = require('../config/googlecalender');
const { User, CalendarEvent } = require('../models');

exports.getGoogleAuthUrl = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent',
  });
  res.json({ url });
};

exports.googleCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    const userId = 1; // replace with dynamic user

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await User.update(
      tokens.refresh_token
        ? { google_tokens: tokens }
        : {
            google_tokens: {
              ...user.google_tokens,
              access_token: tokens.access_token,
            },
          },
      { where: { id: userId } }
    );

    res.status(200).json({ message: 'Tokens updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'OAuth error', details: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const user = await User.findByPk(1);
    if (!user?.google_tokens) return res.status(400).json({ error: 'Tokens missing' });

    oauth2Client.setCredentials(user.google_tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const { summary, description, startTime, endTime, days, durationInDays } = req.body;
    const today = new Date();
    const eventStart = new Date(`${today.toISOString().split('T')[0]}T${startTime}:00+05:30`);
    const eventEnd = new Date(`${today.toISOString().split('T')[0]}T${endTime}:00+05:30`);
    const until = new Date(today.setDate(today.getDate() + durationInDays))
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0] + 'Z';

    const recurrence = `RRULE:FREQ=WEEKLY;BYDAY=${days.join(',')};UNTIL=${until}`;

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary,
        description,
        start: { dateTime: eventStart.toISOString(), timeZone: 'Asia/Kolkata' },
        end: { dateTime: eventEnd.toISOString(), timeZone: 'Asia/Kolkata' },
        recurrence: [recurrence],
      },
    });

    await CalendarEvent.create({
      userId: user.id,
      eventId: response.data.id,
      summary,
      description,
      startTime,
      endTime,
      days,
      durationInDays,
    });

    res.json({ eventId: response.data.id, message: 'Event created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Create failed', details: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const user = await User.findByPk(1);
    if (!user?.google_tokens) return res.status(400).json({ error: 'Tokens missing' });

    const { eventId } = req.params;
    const { summary, description, startTime, endTime, days, durationInDays } = req.body;

    oauth2Client.setCredentials(user.google_tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const today = new Date();
    const eventStart = new Date(`${today.toISOString().split('T')[0]}T${startTime}:00+05:30`);
    const eventEnd = new Date(`${today.toISOString().split('T')[0]}T${endTime}:00+05:30`);
    const until = new Date(today.setDate(today.getDate() + durationInDays))
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0] + 'Z';
    const recurrence = `RRULE:FREQ=WEEKLY;BYDAY=${days.join(',')};UNTIL=${until}`;

    const updated = await calendar.events.update({
      calendarId: 'primary',
      eventId,
      requestBody: {
        summary,
        description,
        start: { dateTime: eventStart.toISOString(), timeZone: 'Asia/Kolkata' },
        end: { dateTime: eventEnd.toISOString(), timeZone: 'Asia/Kolkata' },
        recurrence: [recurrence],
      },
    });

    await CalendarEvent.update(
      { summary, description, startTime, endTime, days, durationInDays },
      { where: { userId: user.id, eventId } }
    );

    res.json({ message: 'Event updated on Google Calendar and DB' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const user = await User.findByPk(1);
    if (!user?.google_tokens) return res.status(400).json({ error: 'Tokens missing' });

    const { eventId } = req.params;

    oauth2Client.setCredentials(user.google_tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({ calendarId: 'primary', eventId });
    await CalendarEvent.destroy({ where: { userId: user.id, eventId } });

    res.json({ message: 'Event deleted from Google Calendar and DB' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
};
