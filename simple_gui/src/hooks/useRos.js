import { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

export function useRos() {
  const [ros, setRos] = useState(null);
  const [connected, setConnected] = useState(false);
  const [setViewSrv, setSetVewSrv] = useState(null);
  const [paramClient, setParamClient] = useState(null)



  useEffect(() => {
		// url: 'ws://192.168.64.3:9090'
		var ros = new ROSLIB.Ros({
			url: 'ws://localhost:9090'
			//url: 'ws://192.168.64.3:9090'
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

		var paramCl = new ROSLIB.Service({
				ros: ros,
				name: '/config_node/get_parameters',
				serviceType: 'rcl_interfaces/srv/GetParameters'
			}
		)
		setParamClient(paramCl)

		// Service to change camera
		var setViewService = new ROSLIB.Service({
			ros: ros,
			name: '/set_view',
			serviceType: 'simple_server/srv/SetInt'
		})
		setSetVewSrv(setViewService)

		return () => {
			ros.close();
		};
	}, []);

  return { ros, connected, paramClient, setViewSrv};
}
