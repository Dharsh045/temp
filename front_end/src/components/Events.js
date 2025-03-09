import React, { useState, useEffect } from "react";
import "../Styles/Events.css";
import { Link } from "react-router-dom";
import SwacchthaImg from "../Photos/Swacchtha.jpg"; // Default Image

const Events = () => {
  const [eventsData, setEventsData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventHours, setNewEventHours] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventStartTime, setNewEventStartTime] = useState("");
  const [newEventImage, setNewEventImage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((response) => response.json())
      .then((data) => setEventsData(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEventName || !newEventHours || !newEventDate || !newEventStartTime || !newEventImage) {
      alert("Please fill in all fields.");
      return;
    }

    const base64Image = await convertToBase64(newEventImage);

    const eventData = {
      event_name: newEventName,
      event_hours: newEventHours,
      event_date: newEventDate,
      start_time: newEventStartTime,
      image: base64Image,
    };

    try {
      const response = await fetch("http://localhost:5000/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const data = await response.json();
      const newEvent = {
        event_id: data.event_id,
        event_name: newEventName,
        event_hours: newEventHours,
        event_date: newEventDate,
        start_time: newEventStartTime,
        image: base64Image,
      };

      setEventsData([...eventsData, newEvent]);
      setShowForm(false);
      setNewEventName("");
      setNewEventHours("");
      setNewEventDate("");
      setNewEventStartTime("");
      setNewEventImage(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  const handleRemoveEvent = async (eventId) => {
    console.log("Deleting event with ID:", eventId); // Debugging
  
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/events/${eventId}`, { 
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
  
      setEventsData(eventsData.filter((event) => event.event_id !== eventId));
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete event.");
    }
  };
  

  return (
    <div className="events-container">
      <h1 className="events-title">NSS Events</h1>
      <button className="add-event-btn" onClick={() => setShowForm(true)}>Add New Event</button>

      {showForm && (
        <form className="event-form" onSubmit={handleAddEvent}>
          <input type="text" placeholder="Event Name" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} required />
          <input type="number" placeholder="Event Hours" value={newEventHours} onChange={(e) => setNewEventHours(e.target.value)} required />
          <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} required />
          <input type="time" value={newEventStartTime} onChange={(e) => setNewEventStartTime(e.target.value)} required />
          <input type="file" accept="image/*" onChange={(e) => setNewEventImage(e.target.files[0])} required />
          <button type="submit">Add Event</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <div className="events-list">
        {eventsData.map((event) => (
          <div key={event.event_id} className="event-item">
            <div className="event-image">
              <img src={event.image || SwacchthaImg} alt={event.event_name} />
            </div>
            <div className="event-details">
              <h2 className="event-name">{event.event_name}</h2>
              <p><strong>Hours:</strong> {event.event_hours} hrs</p>
              <p><strong>Date:</strong> {event.event_date}</p>
              <p><strong>Start Time:</strong> {event.start_time}</p>
              <div className="event-actions">
                <Link to={`/attendance/${event.event_id}`}>Attendance</Link>
                <a href="#">Coordinator</a>
                <button className="remove-event-btn" onClick={() => handleRemoveEvent(event.event_id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
