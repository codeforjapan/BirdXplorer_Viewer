import { Title } from "@mantine/core";

export default function Test() {
  return (
    <>
      <Title order={2}>テストページ 広聴AI iframe</Title>
      <iframe 
        height="1200px"
        sandbox="allow-scripts allow-popups allow-forms"
        src="/kouchou-ai/52c5c1bc-fb89-4aa9-ab67-b35e2f663cf2/index.html"
        title="広聴AI"
        width="100%"
      />
    </>
  );
}