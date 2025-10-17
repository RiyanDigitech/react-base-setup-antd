import React, { FC } from 'react';
import { useFetchAllDashboard } from '@/services/dashoboard-stats/dashboard-stats'; // Sahi path dein
import TeamPokemonChart from '@/components/modules/dashboard/TeamPokemon'; // Chart component import karein

// API se anay walay data ke structure ke liye types (yeh waise hi rahenge)
interface Team {
  id: string;
  name: string;
  pokemons: string[];
}

interface ApiResponse {
  teams: Team[];
}

const DashboardPage: FC = () => {
  // 1. Hook ko bina <ApiResponse> ke call karein
  const { data, isLoading, isError, error } = useFetchAllDashboard();

  if (isLoading) {
    return <div className='p-5'>Loading dashboard data...</div>;
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return <div className='p-5'>Error fetching data: {errorMessage}</div>;
  }

  // 2. Data ko explicitly type karein (Type Assertion)
  // Is se TypeScript ko pata chal jata hai ke 'data' ka structure 'ApiResponse' jaisa hai.
  // Yeh 'Property 'teams' does not exist' wali error ko theek karta hai.
  const typedData = data as ApiResponse;

  // 3. Ab 'typedData' istemal karein, TypeScript ko ab 'team' ki type pata hai
  // Is se 'implicitly has an 'any' type' wali error theek ho jayegi.
  const chartData = typedData?.teams?.map((team) => ({
    name: team.name,
    pokemonCount: team.pokemons.length,
  })) || [];


  return (
    <div className='p-5'>
      <h3 className='mt-4 mb-2 flex justify-center items-center text-lg'>Team-wise Pokémon Count</h3>
      
      {chartData.length > 0 ? (
        <TeamPokemonChart data={chartData} />
      ) : (
        <p className=' flex justify-center items-center
        text-lg'>No team data available to display.</p>
      )}
    </div>
  );
};

export default DashboardPage;