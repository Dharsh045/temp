import React from "react";
import "../Styles/reg_form.css"; // Ensure Styles is inside src/

const RegistrationForm = () => {
  return (
    <div className="form-container">
      <h1>NSS Registration</h1>
      <form>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required /><br /><br />

        <label htmlFor="roll_no">Roll No:</label>
        <input type="text" id="roll_no" name="roll_no" required /><br /><br />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required /><br /><br />

        <label htmlFor="phone">Phone:</label>
        <input type="text" id="phone" name="phone" required /><br /><br />

        <label htmlFor="sex">Sex:</label>
        <select id="sex" name="sex">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select><br /><br />

        <label htmlFor="unit">Unit:</label>
        <select id="unit" name="unit">
          <option value="Unit 1">Unit 1</option>
          <option value="Unit 2">Unit 2</option>
          <option value="Unit 3">Unit 3</option>
        </select><br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
