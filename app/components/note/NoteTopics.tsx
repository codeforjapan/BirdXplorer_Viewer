import { Badge } from "@mantine/core";
import type React from "react";

import { useLanguageLiteral } from "../../feature/search/useLanguageLiteral";
import type { Topic } from "../../generated/api/schemas";

type NoteTopicProps = {
  topics: Topic[];
  wrapper: ({ children }: { children: React.ReactNode }) => React.ReactNode;
};

export const NoteTopic = ({ topics, wrapper: Wrapper }: NoteTopicProps) => {
  const shortLanguage = useLanguageLiteral("ja");

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
