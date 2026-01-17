// "use client";

// import useSWR from "swr";

// const fetcher = (url: string) => fetch(url).then(res => res.json());

// export function useRates() {
//   const { data, error, isLoading } = useSWR(
//     "https://sapnashrijewellers.in/rate/rates.json",
//     fetcher,
//     {
//       refreshInterval:  1 * 1000, // 5 minutes
//       revalidateOnFocus: false,
//     }
//   );

//   return {
//     rates: data,
//     isLoading,
//     isError: error,
//   };
// }
