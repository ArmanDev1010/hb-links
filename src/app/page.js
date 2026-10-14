import HomePage from "@/components/Home/HomePage";
import { PRIMARY_AREA } from "@/lib/cities";
import { buildAreaMetadata } from "@/lib/seo";

export const metadata = buildAreaMetadata(PRIMARY_AREA);

export default function Home() {
  return <HomePage area={PRIMARY_AREA} />;
}
