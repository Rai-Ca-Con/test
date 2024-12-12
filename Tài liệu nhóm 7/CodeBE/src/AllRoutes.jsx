import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './page/Home/Home';
import Questions from './page/Questions/Questions.jsx';
import AskQuestions from './page/AskQuestion/AskQuestion.jsx';
import DisplayQuestions from './page/Questions/DisplayQuestions';
import Tags from './page/Tags/Tags';
import UsersList from './page/Users/UsersList.jsx';
import Auth from './page/Auth/Auth';
import ProfileBio from './page/UserProfile/ProfileBio';
import Users from './page/Users/Users.jsx';
import UserProfile from './page/UserProfile/UserProfile.jsx';
import EditProfileForm from './page/UserProfile/EditProfileForm';
import SearchResult from './page/SearchResult/SearchResult';
import EditQuestion from './page/Questions/EditQuestion';

const AllRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/Auth" element={<Auth />} />
      <Route exact path="/Questions" element={<Questions />} />
      <Route exact path="/AskQuestion" element={<AskQuestions />} />
      <Route exact path="/Questions/:id" element={<DisplayQuestions />} />
      <Route exact path="/Questions/:id/edit" element={<EditQuestion />} /> 
      <Route path="/Tags" element={<Tags />} />
      <Route path="/Users" element={<UsersList />} />
      <Route path="/Users/:id" element={<UserProfile />} /> 
      <Route path="/UserProfile/:id" element={<UserProfile />} />
      <Route path="/EditProfile/:id" element={<EditProfileForm />} />
      <Route path="/Search" element={<SearchResult />} />
    </Routes>
  );
};

export default AllRoutes;