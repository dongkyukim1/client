import FestivalNav from "../_components/FestivalNav";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import getFestivals from "../_services/getFestivals";
import { Metadata } from "next";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "축제 / TripPlanner AI",
};

export default async function Layout({ children }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["festivals"],
    queryFn: getFestivals,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <FestivalNav />
      <main className="mt-16 w-dvw h-[calc(100dvh-64px)]">{children}</main>
    </HydrationBoundary>
  );
}
