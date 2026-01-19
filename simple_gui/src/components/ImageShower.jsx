import { Container, Image } from '@mantine/core';
import { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

function ImageShower({ ros, paramClient }) {

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const request = {
      names: ['stream.type', 'stream.name']
    };
    
    // Declare imageListener outside the callback so it's accessible in cleanup
    let imageListener = null;
    
    // Print some information
    paramClient.callService(request, function (result) {
      console.log("this")
      console.log(result.values[1].string_value)
      // Update image
      imageListener = new ROSLIB.Topic({ 
        ros: ros,
        name: result.values[1].string_value,
        messageType: result.values[0].string_value
      });
      
      imageListener.subscribe(function(message) {      
        setImageUrl(`data:image/jpeg;base64,${message.data}`);
      });
    });
    
    return () => {
      if (imageListener) {
        imageListener.unsubscribe();
      }
    };
  }, []);
  
  if (!imageUrl) return <div>No image</div>;

  return (
    <Container>
      <Image
        src={imageUrl}
        alt="ROS stream"
        width={512}
        height={512}
        style={{ imageRendering: "pixelated", borderRadius: "8px" }}
      />
    </Container>
  );
}

export default ImageShower;
