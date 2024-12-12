import {BrowserRouter as Router} from "react-router-dom"
import { useEffect } from "react";
import './App.css';
import Navbar from './components/Navbar/Navbar';
import AllRoutes from "./AllRoutes";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "./actions/users";

function App() {

  const dispatch=useDispatch();

  // useEffect(()=>{
  //    dispatch(fetchAllQuestions())
  //    dispatch(fetchAllUsers())
  // }, [dispatch])
  
  return (
    <div className="App">
    <Router>
      <div>  
       <Navbar/>
       <AllRoutes/>
      </div>
    </Router>
      
    </div>
  );
}

export default App;
