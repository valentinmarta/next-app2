"use server"

import type { CreateReservationData, ReservationStatus } from "@/types"
import { mockReservationService } from "@/lib/mock-services"
import { revalidatePath } from "next/cache"

export async function createReservation(data: CreateReservationData) {
  const result = await mockReservationService.createReservation(data)
  revalidatePath("/admin")
  return result
}

export async function updateReservationStatus(reservationId: string, status: ReservationStatus) {
  const result = await mockReservationService.updateReservationStatus(reservationId, status)
  revalidatePath("/admin")
  return result
}
