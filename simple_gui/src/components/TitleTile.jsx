import { Card } from '@mantine/core';

export default function TitleTile({ text }){

  return (
	<Card.Section withBorder inheritPadding py="md">
		<h2 style={{ margin: 0 }}>{ text }</h2>
	</Card.Section>
  )
}