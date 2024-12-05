import { Box } from "@mantine/core"
import type { MetaFunction } from "@remix-run/node"
import { useFilter } from "~/hooks/useFilter"

export const meta: MetaFunction = () => {
  return [{ title: "BirdXplorer Viewer" }, { name: "description", content: "" }]
}

export default function Index() {
  const { filters, updateFilter } = useFilter()

  return <Box>Hello World</Box>
}
