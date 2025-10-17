// ==================================
// Pokémon API Types
// (Yeh types Pokémon ki list fetch karne ke liye hain)
// ==================================
export interface PokemonListItem {
  name: string;
  url: string;
}

// Pokémon ki list (jab limit/offset use ho)
export interface PaginatedPokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

// Ek single Pokémon ka data (jab naam se search ho)
export interface SinglePokemon {
  id: string;
  name: string;
  image: string;
  types: string[];
  baseExperience: number;
}


// ==================================
// Team API Types
// (Yeh types Team module ke liye hain)
// ==================================

// Ek single team ka structure
export interface Team {
  id: string;
  name: string;
  pokemons: string[];
}

// Pagination ki information ka structure
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Teams ki list ka poora response structure
export interface PaginatedTeamsResponse {
  teams: Team[];
  pagination: PaginationInfo;
}

// Nayi team create karte waqt bheja jane wala data
export interface CreateTeamPayload {
  name: string;
  pokemons: string[];
}

// Team update karte waqt bheja jane wala data (fields optional ho sakti hain)
export interface UpdateTeamPayload {
  name?: string;
  pokemons?: string[];
}