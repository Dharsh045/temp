import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/AttendancePage.css";
import QrReader from "./QrReader.js";

const AttendancePage = () => {
  const { eventId } = useParams();
  const numericEventId = eventId ? parseInt(eventId, 10) : null;
  console.log("Extracted eventId:", numericEventId);
  const navigate = useNavigate();

  const [attendanceList, setAttendanceList] = useState([]);
  const [newRollNumber, setNewRollNumber] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editRollNumber, setEditRollNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear local storage when the component first loads
    localStorage.removeItem(`attendance_${numericEventId}`);

    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${numericEventId}`);
        const data = await response.json();

        if (response.ok) {
          console.log("Fetched Event Data:", data);
          setAttendanceList(data.participants || []);
        } else {
          console.error("Error fetching event:", data.message);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [numericEventId]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(`attendance_${numericEventId}`, JSON.stringify(attendanceList));
    }
  }, [attendanceList, numericEventId, loading]);

  const handleQRScan = (scannedData) => {
    if (scannedData) {
      const trimmedRoll = scannedData.trim();
      console.log("Scanned Roll Number:", trimmedRoll);

      setAttendanceList((prevList) => {
        if (prevList.includes(trimmedRoll)) {
          alert("Roll number already exists!");
          return prevList;
        }
        return [...prevList, trimmedRoll];
      });
    }
  };

  const handleManualAdd = () => {
    const trimmedRoll = newRollNumber.trim();
    if (!trimmedRoll) {
      alert("Roll number cannot be empty!");
      return;
    }
    if (attendanceList.includes(trimmedRoll)) {
      alert("Roll number already exists!");
      return;
    }
    setAttendanceList([...attendanceList, trimmedRoll]);
    setNewRollNumber("");
  };

  const handleRemove = (index) => {
    setAttendanceList(attendanceList.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditRollNumber(attendanceList[index]);
  };

  const handleSaveEdit = (index) => {
    const trimmedRoll = editRollNumber.trim();
    if (!trimmedRoll) {
      alert("Roll number cannot be empty!");
      return;
    }
    if (attendanceList.includes(trimmedRoll) && trimmedRoll !== attendanceList[index]) {
      alert("Duplicate roll number detected!");
      return;
    }
    const updatedList = [...attendanceList];
    updatedList[index] = trimmedRoll;
    setAttendanceList(updatedList);
    setEditingIndex(null);
  };

  const handleUpdateAll = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/update-attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: numericEventId,
          rollNumbers: attendanceList,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Updated Successfully!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance. Please try again.");
    } 
  };

  return (
    <div className="attendance-container">
      <header className="header">
        <button className="back-button" onClick={() => navigate("/events")}>
          Back to Events
        </button>
      </header>
      <h1>Attendance List</h1>

      {loading ? (
        <p>Loading event data...</p>
      ) : (
        <>
          <QrReader onScan={handleQRScan} />

          <div className="update-container">
            <button className="update-btn" onClick={handleUpdateAll}>
              Update All
            </button>
          </div>

          <div className="manual-entry">
            <input
              type="text"
              placeholder="Enter roll number"
              value={newRollNumber}
              onChange={(e) => setNewRollNumber(e.target.value)}
            />
            <button className="add-btn" onClick={handleManualAdd}>Add</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Roll Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No attendees yet.</td>
                </tr>
              ) : (
                attendanceList.map((student, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={editRollNumber}
                          onChange={(e) => setEditRollNumber(e.target.value)}
                        />
                      ) : (
                        student
                      )}
                    </td>
                    <td>
                      {editingIndex === index ? (
                        <button className="save-btn" onClick={() => handleSaveEdit(index)}>Save</button>
                      ) : (
                        <>
                          <button className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                          <button className="remove-btn" onClick={() => handleRemove(index)}>Remove</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AttendancePage;
