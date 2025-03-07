const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { UserCluster, StudentCluster, EventCluster } = require('./models'); // ✅ Fixed import name

// Route to add a new user
router.post('/users/add', async (req, res) => {
  try {
    const { username, password, access_level } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    let userCluster = await UserCluster.findOne();
    if (!userCluster) {
      userCluster = new UserCluster({ users: [] });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    userCluster.users.push({ username, password: hashedPassword, access_level });

    await userCluster.save();
    res.status(201).json({ message: 'User added successfully', users: userCluster.users });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const userCluster = await UserCluster.findOne();
    if (!userCluster) return res.json({ users: [] });
    res.json(userCluster.users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to add a new student
router.post('/students/add', async (req, res) => {
  try {
    const newStudent = req.body;
    let studentCluster = await StudentCluster.findOne();
    if (!studentCluster) {
      studentCluster = new StudentCluster({ students: [] });
    }
    studentCluster.students.push(newStudent);
    await studentCluster.save();
    res.status(201).json({ message: 'Student added successfully', students: studentCluster.students });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all students
router.get('/students', async (req, res) => {
  try {
    const studentCluster = await StudentCluster.findOne();
    if (!studentCluster) return res.json({ students: [] });
    res.json(studentCluster.students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new event
router.post('/events/create', async (req, res) => {
  try {
    const { event_name, event_hours, event_date, start_time } = req.body;

    if (!event_name || !event_hours || !event_date || !start_time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let eventClusterInstance = await EventCluster.findOne();
    if (!eventClusterInstance) {
      eventClusterInstance = new EventCluster({ events: [] });
    }

    // Generate a unique event ID (prev event_id + 1)
    let newEventId = 1000; // Start from 1000 if no events exist
    if (eventClusterInstance.events.length > 0) {
      const lastEvent = eventClusterInstance.events[eventClusterInstance.events.length - 1];
      newEventId = lastEvent.event_id + 1;
    }

    // Add new event to cluster
    eventClusterInstance.events.push({
      event_name,
      event_hours,
      event_date,
      start_time,
      event_id: newEventId,
      participants: [] // Initialize with an empty list
    });

    await eventClusterInstance.save();
    res.status(201).json({ message: "Event created successfully", event_id: newEventId });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all events
router.get('/events', async (req, res) => {
  try {
    const eventCluster = await EventCluster.findOne();
    if (!eventCluster) return res.json({ events: [] });
    res.json(eventCluster.events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: error.message });
  }
});


router.post("/update-attendance", async (req, res) => {
  try {
    const { eventId, rollNumbers } = req.body;
    console.log("Event id :",eventId,"rollNumber :" ,rollNumbers);

    // Find the event using event_id
    const eventCluster = await EventCluster.findOne({ "events.event_id": eventId });
    if (!eventCluster) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find the event object in the cluster
    const eventIndex = eventCluster.events.findIndex(event => event.event_id === eventId);
    const event = eventCluster.events[eventIndex];
    if (!event) {
      return res.status(404).json({ message: "Event not found in cluster" });
    }

    // Add roll numbers to event's participants
    event.participants = [...new Set([...event.participants, ...rollNumbers])];

    // Save updated event cluster
    await eventCluster.save();

    // Update students' events_participated array
    await StudentCluster.updateMany(
      { "students.roll_no": { $in: rollNumbers } },
      { $addToSet: { "students.$.events_participated": eventId } } // ✅ Only updates matched students
    );
    

    res.json({ message: "Attendance updated successfully!" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/events/:eventId", async (req, res) => {
  try {
      const eventId = parseInt(req.params.eventId, 10);

      // Find the event cluster that contains the event
      const eventCluster = await EventCluster.findOne({ "events.event_id": eventId });

      if (!eventCluster) {
          return res.status(404).json({ message: "Event not found" });
      }

      // Find the specific event inside the cluster
      const event = eventCluster.events.find(event => event.event_id === eventId);

      if (!event) {
          return res.status(404).json({ message: "Event not found in cluster" });
      }

      res.json(event);
  } catch (error) {
      console.error("Error fetching event details:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
