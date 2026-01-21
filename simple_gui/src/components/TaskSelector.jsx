import { useState, useEffect } from "react";
import * as ROSLIB from "roslib";
import { ToastContainer, toast } from "react-toastify";

import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

import '../styleList.css'


function SendButton( { lable, onClick} ){
  return (
    <button onClick={onClick}> {lable} </button>
  )
}

function TaskSelector({ ros }) {
  
  const [dropZone, setDropZone] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [mouse, setMouse] = useState([0, 0]);
  const [dragged, setDragged] = useState(null);
  const [items, setItems] = useState([
    "Press red button",
    "Remove batteries",
    "Check batteries",
    "Slide the thing",
    "Press blue button",
    "Order Cable"
  ]);

  const [sendList, setSendList] = useState(null);

  useEffect( () => {
      if (!ros) return;

      var setListSrv = new ROSLIB.Service({
        ros: ros,
        name: '/set_list',
        serviceType: 'simple_server/srv/SetList'
      })
      setSendList(setListSrv)
    }, [ros]
  )

  useEffect(() => {
	// Handle the mouse movemnt
    const handler = (e) => {
      setMouse([e.x, e.y]);
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    if (dragged !== null) {
		const elements = Array.from(document.getElementsByClassName("drop-zone"));
		const positions = elements.map((e) => e.getBoundingClientRect().top);
		const absDifferences = positions.map((v) => Math.abs(v - mouse[1]));
		let result = absDifferences.indexOf(Math.min(...absDifferences));
		if (result > dragged) result += 1;
		setDropZone(result);
    }
  }, [dragged, mouse]);

  useEffect(() => {
    const handler = (e) => {
      if (dragged !== null) {
        e.preventDefault();
        setDragged(null);

        setItems((items) => reorderList([...items], dragged, dropZone));
      }
    };

    document.addEventListener("mouseup", handler);
    return () => document.removeEventListener("mouseup", handler);
  });

  return (
	<>
	  {dragged !== null && (
      <div className="floating list-item" style={{left: `${mouse[0]}px`, top: `${mouse[1]}px`,}}>
        {items[dragged]}
      </div>
    )}
    <div className='list'>
        <div className={`list-item drop-zone ${dragged === null || dropZone !== 0 ? "hidden" : ""}`}/>
        {items.map((value, index) => (
          <>
          {dragged !== index && (
            <>
              <div key={value} className="list-item" onMouseDown={(e) => { e.preventDefault(); setDragged(index); }}>
                {value}
              </div>
              <div className={`list-item drop-zone ${dragged === null || dropZone !== index + 1 ? "hidden" : ""}`} /> {/* drop zone after every item */}
            </>
          )}
          </>
        ))}
    </div>
    <div>
      <ToastContainer />
      <SendButton onClick={
        () => {
          sendList.callService({data: items}, (result) => {
            setIsReady(result.success)
            if (result.success)
              toast.success(result.message)
            else
              toast.error(result.message)
          })
        }
      } lable={"SendList"}/>
      <Link to='/executing'>
      <Button disabled={!isReady}>
        Start
      </Button>
      </Link>
    </div>
	</>
  );
}



const reorderList = (l, start, end) => {
  if (start < end) return _reorderListForward([...l], start, end);
  else if (start > end) return _reorderListBackward([...l], start, end);

  return l; // if start == end
};

const _reorderListForward = (l, start, end) => {
  const temp = l[start];
  for (let i=start; i<end; i++) {
    l[i] = l[i+1];
  }
  l[end - 1] = temp;
  return l;
};

const _reorderListBackward = (l, start, end) => {
  const temp = l[start];
  for (let i = start; i > end; i--) {
    l[i] = l[i - 1];
  }
  l[end] = temp;
  return l;
};

export default TaskSelector