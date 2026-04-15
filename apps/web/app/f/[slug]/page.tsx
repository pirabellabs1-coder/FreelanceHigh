import FunnelLandingClient from "./FunnelLandingClient";

export default async function FunnelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <FunnelLandingClient slug={slug} />;
}
