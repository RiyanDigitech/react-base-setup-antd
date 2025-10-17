import axios from "@/lib/config/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { buildUrlWithParams } from "@/lib/helpers";

// API se anay walay data ke liye types
interface PokemonListItem {
  name: string;
  url: string;
}

// Type for paginated response
interface PaginatedPokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

// Type for single pokemon response
interface SinglePokemon {
  id: string;
  name: string;
  image: string;
  types: string[];
  baseExperience: number;
}

// Hook ke parameters ke liye type
interface PokemonParams {
  limit?: number;
  offset?: number;
  name?: string;
}

export const useFetchAllPokemons = (params: PokemonParams) => {
  // Data fetch karne wala function
  const fetchPokemonsData = async (): Promise<PaginatedPokemonResponse | SinglePokemon> => {
    // Agar 'name' hai to usko search query mein use karein, warna limit/offset
    const queryParams = params.name ? { name: params.name } : { limit: params.limit, offset: params.offset };
    const url = buildUrlWithParams("/api/pokemon", queryParams);
    const response = await axios.get(url);
    return response.data;
  };

  // useQuery hook
  return useQuery({
    // queryKey ko dynamic banayein takay har different parameter ke liye alag se cache ho
    queryKey: ["pokemons", params],
    queryFn: fetchPokemonsData,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};