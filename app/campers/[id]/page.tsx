import Container from "@/components/Container/Container";
import CamperDetailsClient from "./CamperDetailsClient";
import type { Camper } from "@/types/types";
import { getCamperByIdServer } from "@/lib/api/serverApi";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return { alternates: { canonical: `/campers/${params.id}` } };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const camper: Camper = await getCamperByIdServer(id);

  return (
    <Container>
      <CamperDetailsClient id={id} camper={camper} />
    </Container>
  );
}
