import Container from "@/components/Container/Container";
import CamperDetailsClient from "./CamperDetailsClient";
import type { Camper } from "@/types/types";
import { getCamperByIdServer } from "@/lib/api/serverApi";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    alternates: { canonical: `/campers/${id}` },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  let camper: Camper | null = null;
  try {
    camper = await getCamperByIdServer(id);
  } catch {
    notFound();
  }

  if (!camper) notFound();

  return (
    <Container>
      <CamperDetailsClient id={id} camper={camper} />
    </Container>
  );
}
