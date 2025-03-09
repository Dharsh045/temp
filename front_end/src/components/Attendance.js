import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);

    const fetchAttendance = () => {
        fetch("http://localhost:5000/api/attendance")
            .then((res) => res.json())
            .then((data) => {
                console.log("✅ Attendance API Response:", data);
                if (data.attendance) {
                    setAttendance(data.attendance); // ✅ Directly set data
                }
            })
            .catch((error) => console.error("❌ Error fetching attendance:", error));
    };
    

    useEffect(() => {
        fetchAttendance();
    }, []);
    
    useEffect(() => {
        const handleAttendanceUpdate = () => {
            console.log("Received attendanceUpdated event!");
            fetchAttendance();
        };
    
        window.addEventListener("attendanceUpdated", handleAttendanceUpdate);
        return () => {
            window.removeEventListener("attendanceUpdated", handleAttendanceUpdate);
        };
    }, []);
    

    return (
        <div>
            <h2>Attendance Records</h2>
            <table border="1">
            <thead>
                <tr>
                    <th style={{ backgroundColor: "#4CAF50", color: "white" }}>ROLL NUMBER</th>
                    <th style={{ backgroundColor: "#4CAF50", color: "white" }}>TOTAL HOURS</th> {/* ✅ Added column */}
                </tr>
            </thead>
            <tbody>
                {attendance.length > 0 ? (
                    attendance.map((student, index) => (
                        <tr key={index}>
                            <td>{student.studentName}</td>  {/* ✅ Use studentName */}
                            <td>{student.totalHours}</td>   {/* ✅ Use totalHours */}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="2" style={{ color: "red", fontWeight: "bold" }}>
                            No attendance data available
                        </td>
                    </tr>
                )}
            </tbody>

            </table>
        </div>
    );
};

export default Attendance;
