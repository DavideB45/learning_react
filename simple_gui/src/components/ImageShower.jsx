import { Container, Image } from '@mantine/core';

function ImageShower({ imageSrc }) {
  if (!imageSrc) return <div>No image</div>;

  return (
    <Container>
      <Image
        src={imageSrc}
        alt="ROS stream"
        width={512}
        height={512}
        style={{ imageRendering: "pixelated", borderRadius: "8px" }}
      />
    </Container>
  );
}

export default ImageShower;
