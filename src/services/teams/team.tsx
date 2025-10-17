import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/config/axios-instance'; // Aapka axios instance
import { Team, PaginatedTeamsResponse, CreateTeamPayload, UpdateTeamPayload } from '@/types'; // Apni types file se import karein

// ====================================================================
// 1. Sab Teams Fetch Karne Ke Liye Hook (Pagination Ke Sath)
// ====================================================================
const fetchTeams = async (page: number, limit: number): Promise<PaginatedTeamsResponse> => {
    const { data } = await axios.get('/api/teams', { params: { page, limit } });
    // API response { teams: [...], totalTeams: ..., ... } hai, hum usko adjust kar rahe hain
    return {
        teams: data.teams,
        pagination: {
            total: data.totalTeams,
            page: data.currentPage,
            limit: limit,
            totalPages: data.totalPages,
        },
    };
};

export const useFetchTeams = (page: number, limit: number) => {
    return useQuery({
        queryKey: ['teams', { page, limit }],
        queryFn: () => fetchTeams(page, limit),
        keepPreviousData: true, // Page change karte waqt pichla data dikhaye
    });
};

// ====================================================================
// 2. Nayi Team Banane Ke Liye Hook
// ====================================================================
const createTeam = async (payload: CreateTeamPayload): Promise<Team> => {
    const { data } = await axios.post('/api/teams', payload);
    return data.team;
};

export const useCreateTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTeam,
        onSuccess: () => {
            // Team create hone par table ko automatically refresh karein
            queryClient.invalidateQueries({ queryKey: ['teams'] });
        },
    });
};

// ====================================================================
// 3. Team Update Karne Ke Liye Hook
// ====================================================================
const updateTeam = async ({ id, payload }: { id: string; payload: UpdateTeamPayload }): Promise<Team> => {
    const { data } = await axios.put(`/api/teams/${id}`, payload);
    return data.team;
};

export const useUpdateTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTeam,
        onSuccess: () => {
            // Team update hone par table ko refresh karein
            queryClient.invalidateQueries({ queryKey: ['teams'] });
        },
    });
};

// ====================================================================
// 4. Team Delete Karne Ke Liye Hook
// ====================================================================
const deleteTeam = async (id: string): Promise<{ message: string }> => {
    const { data } = await axios.delete(`/api/teams/${id}`);
    return data;
};

export const useDeleteTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTeam,
        onSuccess: () => {
            // Team delete hone par table ko refresh karein
            queryClient.invalidateQueries({ queryKey: ['teams'] });
        },
    });
};