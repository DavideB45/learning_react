import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";

// Components import
import ImageShower from "./components/ImageShower";
import TaskCompleted from "./components/TaskCompleted";
import Game from "./components/TrisBoard";
import RobotSetup from "./components/RobotSetup";
import TaskSelector from './components/TaskSelector';
import APlot from './components/APlot';

// Functions import
import { useRos } from "./hooks/useRos";

const navLinkStyles = ({ isActive }) => ({
  color: isActive ? '#007bff' : '#333',
  textDecoration: isActive ? 'none' : 'underline',
  fontWeight: isActive ? 'bold' : 'normal',
  padding: '5px 10px'
});

function ViewButton( { lable, onClick} ){
  return (
    <button onClick={onClick}> {lable} </button>
  )
}

function ManyViews({ imageUrl, taskStat, setViewSrv }) {

  function sendNumber(num){
    setViewSrv.callService({data: num}, (result) => {})
    toast.info("Changing to camera " + ["Front", "Above", "Side"][num])
  }

  return (
    <div>
      <ToastContainer />
      <div className='container'>
        <div className='left'>
          <div>
            <h2>Camera stream</h2>
            <ImageShower imageSrc={imageUrl} />
            <h3>Task Status</h3>
            <TaskCompleted state={taskStat} />
          </div>
          <div>
            <ViewButton onClick={() => sendNumber(0)} lable={"Front"}/>
            <ViewButton onClick={() => sendNumber(1)} lable={"Above"}/>
            <ViewButton onClick={() => sendNumber(2)} lable={"Side "}/>
          </div>
        </div>
        <div className='right'>
          <APlot />
        </div>
      </div>
    </div>
  )
}

function Navigation() {
  const location = useLocation();

  // Hide nav on the picker page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav>
      <NavLink to="/" style={navLinkStyles}>Select</NavLink> |{" "}
      <NavLink to="/executing" style={navLinkStyles}>Robot</NavLink> |{" "}
      <NavLink to="/game" style={navLinkStyles}>Tris</NavLink> |{" "}
      <NavLink to="/list" style={navLinkStyles}>Tasks</NavLink> |{" "}
    </nav>
  );
}


export default function All(){

  const { ros, connected, imageUrl, setViewSrv, taskStat } = useRos()

  return (
    <div>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<RobotSetup/>} />
          <Route 
            path="/executing" 
            element={
              <ManyViews 
                imageUrl={imageUrl}
                taskStat={taskStat}
                setViewSrv={setViewSrv}
              />
            }
          />
          <Route path="/game" element={<Game />} />
          <Route path="/list" element={<TaskSelector ros={ros}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}