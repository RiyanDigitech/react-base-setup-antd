// import axios from "@/lib/config/axios-instance";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


// import { useNavigate } from "react-router-dom";
// import { buildUrlWithParams } from "@/lib/helpers";
// import { ServiceResponse } from "@/lib/types/service";

// const DashboardManagementService = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   const useFetchAllDashboard = (
   
//   ) => {
//     async function fetchService(): Promise<ServiceResponse> {
//       const url = buildUrlWithParams("/api/teams", {
        
//       });
//       return axios.get(url).then((res) => res.data);
//     }
//     return useQuery({
//       queryFn: fetchService,
//       queryKey: ["dashboard"],
//       retry: 0,
//       refetchOnWindowFocus: false,
//     });
//   };
 

 
//   return {
//     useFetchAllDashboard,
//   };
// };
// export default DashboardManagementService;



import axios from "@/lib/config/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { ServiceResponse } from "@/lib/types/service";
import { buildUrlWithParams } from "@/lib/helpers";

// Direct ek custom hook export karein jo data fetch karega
export const useFetchAllDashboard = () => {

  // Data fetch karne wala function
  async function fetchDashboardData(): Promise<ServiceResponse> {
      const url = buildUrlWithParams("/api/teams", {
        
      });
      return axios.get(url).then((res) => res.data);
    }

  // useQuery hook ko return karein
  return useQuery({
    queryKey: ["dashboard"],       // Data ko cache karne ke liye unique key
    queryFn: fetchDashboardData,   // Data fetch karne wala function
    retry: 0,
    refetchOnWindowFocus: false,
  });
};