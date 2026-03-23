import { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

export function useRos(rosIP) {
  const [ros, setRos] = useState(null);
  const [connected, setConnected] = useState(false);
  const [setViewSrv, setSetVewSrv] = useState(null);
  const [paramClient, setParamClient] = useState(null)



  useEffect(() => {
		if(!isValidAddress(rosIP)){
			console.log("Invalid ROS address:", rosIP);
    		return;
		}
		// url: 'ws://192.168.64.3:9090'
		var ros = new ROSLIB.Ros({
			url: 'ws://' + rosIP
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
	}, [rosIP]);

  return { ros, connected, paramClient, setViewSrv};
}

export function isValidAddress(input) {
  if (!input) return false;

  const [host, port] = input.split(":");

  if (!host || !port) return false;

  // Validate port
  const portNum = Number(port);
  if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
    return false;
  }

  // Allow localhost
  if (host === "localhost") return true;

  // Validate IPv4
  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  return ipv4Regex.test(host);
};