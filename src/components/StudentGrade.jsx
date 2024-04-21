import React from 'react';

const StudentGrades = ({ grades }) => {
  return (
    <>
      {grades.map((gradeObj, index) => (
        <td key={index}>Grade: {gradeObj.grade}</td>
      ))}
    </>
  );
};

export default StudentGrades;
