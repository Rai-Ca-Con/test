import { CREATE_ANSWER, DELETE_ANSWER, GET_ANSWERS, UPDATE_ANSWER_SUCCESS, VOTE_ANSWER_SUCCESS, ANSWERS_ERROR } from "../actions/answers";

const initialState = {
  answersByQuestionId: {},
  error: null,
};

const answersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ANSWERS:
      return {
        ...state,
        answersByQuestionId: {
          ...state.answersByQuestionId,
          [action.payload.questionId]: action.payload.answers,
        },
      };
    case CREATE_ANSWER:
      return {
        ...state,
        answersByQuestionId: {
          ...state.answersByQuestionId,
          [action.payload.questionId]: [
            ...state.answersByQuestionId[action.payload.questionId],
            action.payload.answer,
          ],
        },
      };
    case DELETE_ANSWER:
      return {
        ...state,
        answersByQuestionId: {
          ...state.answersByQuestionId,
          [action.payload.questionId]: state.answersByQuestionId[action.payload.questionId].filter(
            (answer) => answer.answerId !== action.payload.answerId
          ),
        },
      };
    case UPDATE_ANSWER_SUCCESS:
      return {
        ...state,
        answersByQuestionId: {
          ...state.answersByQuestionId,
          [action.payload.questionId]: state.answersByQuestionId[action.payload.questionId].map(
            (answer) => (answer.answerId === action.payload.answerId ? action.payload.answer : answer)
          ),
        },
      };
    case VOTE_ANSWER_SUCCESS:
      return {
        ...state,
        answersByQuestionId: {
          ...state.answersByQuestionId,
          [action.payload.questionId]: state.answersByQuestionId[action.payload.questionId].map(
            (answer) => {
              if (answer.answerId === action.payload.answerId) {
                return {
                  ...answer,
                  score: action.payload.voteType === "UPVOTE" ? answer.score + 1 : answer.score - 1,
                  userVote: action.payload.voteType,
                };
              }
              return answer;
            }
          ),
        },
      };
    case ANSWERS_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default answersReducer;