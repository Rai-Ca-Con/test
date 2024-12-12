// QuestionList.jsx
import React from 'react';
import QuestionItem from './QuestionItem';
import { Link } from 'react-router-dom';
const QuestionList = ({ questionsList }) => {
  return (
    <div className="question-list">
      {questionsList.map((question) => (
        <QuestionItem key={question.questionId} question={question} />
      ))}
    </div>
  );
};

export default QuestionList;