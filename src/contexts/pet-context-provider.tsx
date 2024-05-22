'use client';

import { addPet, deletePet, editPet } from '@/actions/actions';
import { PetEssentials } from '@/lib/types';
import { Pet } from '@prisma/client';
import {
  PropsWithChildren,
  createContext,
  useOptimistic,
  useState,
} from 'react';
import { toast } from 'sonner';

type PetContextProviderProps = {
  data: Pet[];
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet['id'] | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: Pet['id']) => void;
  handleCheckoutPet: (id: Pet['id']) => Promise<void>;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (petId: Pet['id'], newPetData: PetEssentials) => Promise<void>;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PropsWithChildren<PetContextProviderProps>) {
  // state
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case 'add':
          return [...state, { ...payload, id: Date.now().toString() }];
        case 'edit':
          return state.map((pet) => {
            if (pet.id === payload.id) {
              return { ...pet, ...payload.petData };
            }
            return pet;
          });
        case 'delete':
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // event handlers / actions
  const handleChangeSelectedPetId = (id: Pet['id']) => {
    setSelectedPetId(id);
  };
  const handleCheckoutPet = async (petId: Pet['id']) => {
    setOptimisticPets({ action: 'delete', payload: petId });
    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }
    setSelectedPetId(null);
  };
  const handleAddPet = async (newPet: PetEssentials) => {
    setOptimisticPets({ action: 'add', payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };
  const handleEditPet = async (petId: Pet['id'], petData: PetEssentials) => {
    setOptimisticPets({ action: 'edit', payload: { id: petId, petData } });
    const error = await editPet(petId, petData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleChangeSelectedPetId,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
