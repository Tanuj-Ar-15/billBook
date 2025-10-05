import { create } from "zustand";

// ✅ Correct Zustand store syntax
const useAuthStore = create(( get, set) => ({
  user: {name : "uday"} ,            
  token: null,             
  isAuthenticated: false,  
login: ()=> {


  
}
}));

export default useAuthStore;
