'use client'

import { create } from 'zustand'

export const useEventsState = create((set) => ({
    events: [
        {
            id: 1,
            name: 'Boda de Juan y María',
            date: '2023-08-15',
            time: '18:00',
            location: 'Hotel Plaza',
            capacity: 100,
            description: 'Celebración de boda',
            status: 'Activo',
        },
    ],
    addEvent: (event) => set((state) => ({
        events: [...state.events, event],
    })),
    updateEvent: (id, updatedEvent) => set((state) => ({
        events: state.events.map((event) =>
            event.id === id ? { ...event, ...updatedEvent } : event
        ),
    })),
    deleteEvent: (id) => set((state) => ({
        events: state.events.filter((event) => event.id !== id),
    })),
}))

export const useGuestsState = create((set) => ({
    guests: [
        {
            id: 1,
            eventId: 1,
            name: 'Ana García',
            email: 'ana@example.com',
            phone: '123-456-7890',
            status: 'Pendiente',
        },
    ],
    addGuest: (guest) => set((state) => ({
        guests: [...state.guests, guest],
    })),
    updateGuest: (id, updatedGuest) => set((state) => ({
        guests: state.guests.map((guest) =>
            guest.id === id ? { ...guest, ...updatedGuest } : guest
        ),
    })),
    deleteGuest: (id) => set((state) => ({
        guests: state.guests.filter((guest) => guest.id !== id),
    })),
}))

