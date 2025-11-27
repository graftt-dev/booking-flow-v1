import { create } from 'zustand';

export type SkipSize = "2yd" | "3yd" | "4yd" | "6yd" | "8yd" | "12yd" | "14yd" | "16yd";
export type Placement = "driveway" | "road";

interface JourneyState {
  postcode: string;
  address: string;
  lat: number;
  lng: number;
  w3w: string;
  placement: Placement | null;
  wasteType: string;
  items: string[];
  itemQuantities: Record<string, number>;
  size: SkipSize | null;
  providerId: string | null;
  deliveryDate: string;
  collectionDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  totals: {
    base: number;
    extras: number;
    permit: number;
    vat: number;
    total: number;
  };
  flags: {
    onRoadFromHome?: boolean;
  };
  compareList: string[];
  
  setPostcode: (postcode: string) => void;
  setAddress: (address: string) => void;
  setLocation: (lat: number, lng: number, w3w: string) => void;
  setPlacement: (placement: Placement) => void;
  setWasteType: (wasteType: string) => void;
  toggleItem: (item: string) => void;
  setItems: (items: string[]) => void;
  setItemQuantity: (item: string, quantity: number) => void;
  setSize: (size: SkipSize) => void;
  setProviderId: (id: string) => void;
  setDeliveryDate: (date: string) => void;
  setCollectionDate: (date: string) => void;
  setCustomer: (customer: { name: string; email: string; phone: string }) => void;
  setTotals: (totals: { base: number; extras: number; permit: number; vat: number; total: number }) => void;
  setOnRoadFromHome: (value: boolean) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  reset: () => void;
}

const initialState = {
  postcode: '',
  address: '',
  lat: 51.5074,
  lng: -0.1278,
  w3w: '',
  placement: null,
  wasteType: '',
  items: [],
  itemQuantities: {},
  size: null,
  providerId: null,
  deliveryDate: '',
  collectionDate: '',
  customer: {
    name: '',
    email: '',
    phone: '',
  },
  totals: {
    base: 0,
    extras: 0,
    permit: 0,
    vat: 0,
    total: 0,
  },
  flags: {},
  compareList: [],
};

export const useJourneyStore = create<JourneyState>((set) => ({
  ...initialState,
  
  setPostcode: (postcode) => set({ postcode }),
  setAddress: (address) => set({ address }),
  setLocation: (lat, lng, w3w) => set({ lat, lng, w3w }),
  setPlacement: (placement) => set({ placement }),
  setWasteType: (wasteType) => set({ wasteType }),
  toggleItem: (item) => set((state) => {
    const isRemoving = state.items.includes(item);
    const newQuantities = { ...state.itemQuantities };
    
    if (isRemoving) {
      delete newQuantities[item];
      return {
        items: state.items.filter(i => i !== item),
        itemQuantities: newQuantities
      };
    } else {
      newQuantities[item] = 1;
      return {
        items: [...state.items, item],
        itemQuantities: newQuantities
      };
    }
  }),
  setItems: (items) => set({ items, itemQuantities: {} }),
  setItemQuantity: (item, quantity) => set((state) => ({
    itemQuantities: { ...state.itemQuantities, [item]: quantity }
  })),
  setSize: (size) => set({ size }),
  setProviderId: (providerId) => set({ providerId }),
  setDeliveryDate: (deliveryDate) => set({ deliveryDate }),
  setCollectionDate: (collectionDate) => set({ collectionDate }),
  setCustomer: (customer) => set({ customer }),
  setTotals: (totals) => set({ totals }),
  setOnRoadFromHome: (value) => set((state) => ({
    flags: { ...state.flags, onRoadFromHome: value }
  })),
  toggleCompare: (id) => set((state) => ({
    compareList: state.compareList.includes(id)
      ? state.compareList.filter(i => i !== id)
      : state.compareList.length < 3
        ? [...state.compareList, id]
        : state.compareList
  })),
  clearCompare: () => set({ compareList: [] }),
  reset: () => set(initialState),
}));
