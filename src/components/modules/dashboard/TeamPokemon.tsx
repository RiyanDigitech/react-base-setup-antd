import React, { FC } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LabelList // 1. Yahan LabelList ko import karein
} from 'recharts';

// Interfaces waise hi rahenge
interface ChartData {
  name: string;
  pokemonCount: number;
}

interface TeamPokemonChartProps {
  data: ChartData[];
}

const TeamPokemonChart: FC<TeamPokemonChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }} // Thora sa top margin add kiya takay label fit hojaye
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis 
          allowDecimals={false} 
          label={{ value: 'Number of Pokémon', angle: -90, position: 'insideLeft' }} 
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="pokemonCount" fill="#8884d8" name="Pokémon Count">
          {/* 2. Bas yeh line add karein */}
          <LabelList dataKey="pokemonCount" position="top" style={{ fill: 'black' }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TeamPokemonChart;