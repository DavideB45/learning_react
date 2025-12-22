function ImageShower({ imageSrc }) {
  if (!imageSrc) return <div>No image</div>;

  return (
    <div className="image-container">
      <img
        src={imageSrc}
        alt="ROS stream"
        style={{ 
          width:'512px',
          height:'512px',
          imageRendering: "pixelated"
         }}
      />
    </div>
  );
}

export default ImageShower