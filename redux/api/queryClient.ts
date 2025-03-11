import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 60 * 30 * 1000
      }
    }
})

export default queryClient;