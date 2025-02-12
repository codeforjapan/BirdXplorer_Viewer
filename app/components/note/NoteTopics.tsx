import { Badge, Group } from "@mantine/core";

import type { LanguageIdentifierLiteral } from "../../feature/search/language";
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
  language: LanguageIdentifierLiteral;
};

const TopicBadge = ({ topic, language }: TopicBadgeProps) => {
  // ラベルに適した言語の文字がない場合は英語のラベルを表示する
  //  label.en は常に存在することが保証されているので non-null assertion
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const labelByLanguage = topic.label[language] ?? topic.label.en!;

  return (
    <Badge color="green" component="li" radius="sm" size="lg" variant="light">
      {labelByLanguage}
    </Badge>
  );
};
