import { create } from 'zustand'

type PaymentStore = {
  amount: number
  setAmount: (amount: number) => void

  orderName: string
  setOrderName: (orderName: string) => void

  customerKey: string
  setCustomerKey: (customerKey: string) => void
}

const usePaymentStore = create<PaymentStore>()((set) => ({
  amount: 0,
  setAmount: (amount) => set({ amount }),

  orderName: "",
  setOrderName: (orderName) => set({ orderName }),

  customerKey: "",
  setCustomerKey: (customerKey) => set({ customerKey }),
}))

export default usePaymentStore;