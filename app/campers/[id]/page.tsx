import Container from "@/components/Container/Container";
import CamperDetailsClient from "./CamperDetailsClient";
import type { Camper } from "@/types/types";
import { getCamperByIdServer } from "@/lib/api/serverApi";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // У Next 15 params — Promise, тому розпаковуємо
  const { id } = await params;

  // Серверний axios із абсолютною BASE_URL
  const camper: Camper = await getCamperByIdServer(id);

  return (
    <Container>
      <CamperDetailsClient id={id} camper={camper} />
    </Container>
  );
}