'use client';

import { Pet } from '@/lib/types';
import { PropsWithChildren, createContext, useState } from 'react';

type PetContextProviderProps = {
  data: Pet[];
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PropsWithChildren<PetContextProviderProps>) {
  // state
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  // event handlers / actions
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };
  const handleCheckoutPet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };
  const handleAddPet = (newPet: Pet) => {
    setPets(prev => [...prev, newPet])
  }

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleChangeSelectedPetId,
        handleCheckoutPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
