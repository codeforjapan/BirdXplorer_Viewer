import { Badge } from "@mantine/core";
import type React from "react";

import type { Topic } from "../../generated/api/schemas";
import { useLanguage } from "../../hooks/useLanguage";

type NoteTopicProps = {
  topics: Topic[];
  wrapper: ({ children }: { children: React.ReactNode }) => React.ReactNode;
};

export const NoteTopic = ({ topics, wrapper: Wrapper }: NoteTopicProps) => {
  const language = useLanguage("ja");
  const shortLanguage = language.slice(0, 2);

  return (
    <Wrapper>
      {topics.map((topic) => (
        <TopicBadge
          key={topic.topicId}
          language={shortLanguage}
          topic={topic}
        />
      ))}
    </Wrapper>
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
        <Badge color="green" radius="sm" size="lg" variant="light">
          {labelByLanguage}
        </Badge>
      ) : (
        <Badge color="green" radius="sm" size="lg" variant="light">
          {JSON.stringify(topic.label)}
        </Badge>
      )}
    </>
  );
};
