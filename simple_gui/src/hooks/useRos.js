import { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

import { toast } from "react-toastify";

export function useRos() {
  const [ros, setRos] = useState(null);
  const [connected, setConnected] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [setViewSrv, setSetVewSrv] = useState(null);
  const [taskStat, setTaskStat] = useState(false);



  useEffect(() => {
		var ros = new ROSLIB.Ros({
			url: 'ws://localhost:9090'
		});
		ros.on('connection', function() {
			console.log('Connected to websocket server.');
		});
		ros.on('error', function(error) {
			console.log('Error connecting to websocket server: ', error);
			setConnected(true);
		});
		ros.on("close", () => {
			console.log("Disconnected from ROS");
			setConnected(false);
		});
		setRos(ros)

		// Update image
		var imageListener = new ROSLIB.Topic({ 
			ros: ros,
			name: '/image',
			messageType: 'sensor_msgs/CompressedImage'
		});
		imageListener.subscribe(function(message) {      
			setImageUrl(`data:image/jpeg;base64,${message.data}`)
		});

		// Show task success
		var taskListener = new ROSLIB.Topic({
			ros: ros,
			name: 'taskCompleted',
			messageType: 'std_msgs/Bool'
		})
		taskListener.subscribe(function(message) {
			setTaskStat(message.data);
			if (message.data)
				toast.success("Task completed", { icon: "✅" , toastId: 1},
			);
		})

		// Service to change camera
		var setViewService = new ROSLIB.Service({
			ros: ros,
			name: '/set_view',
			serviceType: 'simple_server/srv/SetInt'
		})
		setSetVewSrv(setViewService)

		return () => {
			imageListener.unsubscribe();
			taskListener.unsubscribe();
			ros.close();
		};
	}, []);

  return { ros, connected, imageUrl, setViewSrv, taskStat};
}
