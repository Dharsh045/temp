import { useEffect, useState } from "react";

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/attendance")
            .then((res) => res.json())
            .then((data) => {
                if (data.attendance) {
                    setAttendance(data.attendance);
                }
            })
            .catch((error) => console.error("Error fetching attendance:", error));
    }, []);

    return (
        <div>
            <h2>Attendance Records</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Total Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.length > 0 ? (
                        attendance.map((student, index) => (
                            <tr key={index}>
                                <td>{student.studentName}</td>
                                <td>{student.totalHours}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">No attendance data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Attendance;
