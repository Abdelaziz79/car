import { Feather } from "@expo/vector-icons";

export default function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
}) {
  return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}
