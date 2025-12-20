import { Container, Stack } from "@mantine/core";

import { AboutSection } from "~/components/about-section";
import { FeatureSection } from "~/components/feature-section";
import { ReportCardSection } from "~/components/report-card-section/ReportCardSection";

import type { Route } from "./+types/_index";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loader = (_args: Route.LoaderArgs) => {
  return {};
};

export default function Index({}: Route.ComponentProps) {
  return (
    <main>
      <Container className="py-8" size="xl">
        <Stack gap="xl">
          <AboutSection />
          <FeatureSection />
          <ReportCardSection />
        </Stack>
      </Container>
    </main>
  );
}
