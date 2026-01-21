import { Container, Image } from '@mantine/core';
import { useEffect, useState } from "react";
import * as ROSLIB from "roslib";

function ImageShower({ ros, paramClient }) {

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const request = {
      names: ['stream.type', 'stream.name']
    };
    
    let imageListener = null;
    if (!paramClient) return;
    paramClient.callService(request, function (result) {
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
  }, [paramClient]);
  
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
