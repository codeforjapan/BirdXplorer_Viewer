import { Badge, Group } from "@mantine/core";

import { useLanguageLiteral } from "../../feature/search/useLanguageLiteral";
import type { Topic } from "../../generated/api/schemas";

type NoteTopicProps = {
  topics: Topic[];
};

export const NoteTopic = ({ topics }: NoteTopicProps) => {
  const shortLanguage = useLanguageLiteral("ja");

  return (
    <Group
      component="ul"
      gap="sm"
      title="自動推定したコミュニティノートのトピック"
    >
      {topics.map((topic) => (
        <TopicBadge
          key={topic.topicId}
          language={shortLanguage}
          topic={topic}
        />
      ))}
    </Group>
  );
};

type TopicBadgeProps = {
  topic: Topic;
  language: string;
};

const TopicBadge = ({ topic, language }: TopicBadgeProps) => {
  const labelByLanguage = topic.label[language] ?? topic.label.en;

  return (
    <>
      {labelByLanguage ? (
        <Badge
          color="green"
          component="li"
          radius="sm"
          size="lg"
          variant="light"
        >
          {labelByLanguage}
        </Badge>
      ) : (
        <Badge
          color="green"
          component="li"
          radius="sm"
          size="lg"
          variant="light"
        >
          {JSON.stringify(topic.label)}
        </Badge>
      )}
    </>
  );
};
