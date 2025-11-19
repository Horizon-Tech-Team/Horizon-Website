import { getEventById } from "@/app/actions/actions";
import EventFullInfo from "./EventFullInfo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getEventById(id);

  const metadataBase = new URL("https://horizon-frontend-vert.vercel.app");

  return {
    title: data?.name || "Event",
    description: data?.description || "Details about the event",
    metadataBase,
    openGraph: {
      title: data?.name || "Event",
      description: data?.description || "Details about the event",
      images: [
        {
          url:
            data?.banner_url ||
            "https://gjewacuwtvvhxoazxrco.supabase.co/storage/v1/object/public/events/horizon_og.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data?.name || "Event Details",
      description: data?.description || "Details about the event",
      images: [
        data?.banner_url ||
          "https://gjewacuwtvvhxoazxrco.supabase.co/storage/v1/object/public/events/horizon_og.png",
      ],
    },
  };
}

const EventDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const { data } = await getEventById(id);

  return (
    <div className="max-w-7xl mx-auto md:px-4 md:py-8">
      {data ? (
        <EventFullInfo event={data} />
      ) : (
        <div className="text-center text-red-500 font-semibold">
          Event not found.
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
