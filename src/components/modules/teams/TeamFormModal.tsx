import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Spin, Alert, Button } from 'antd'; // Button import karein
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFetchAllPokemons } from '@/services/pokemons/pokemons';
import { useDebounce } from 'use-debounce';
import { TeamFormData, teamSchema } from '@/lib/schemas/team-schema';
import { Team } from '@/lib/types/team';

interface TeamFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TeamFormData) => void;
    initialData?: Team | null;
    isLoading: boolean;
}

const TeamFormModal: React.FC<TeamFormModalProps> = ({ open, onClose, onSubmit, initialData, isLoading }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<TeamFormData>({
        resolver: zodResolver(teamSchema),
    });

    const [pokemonSearch, setPokemonSearch] = useState('');
    const [debouncedSearch] = useDebounce(pokemonSearch, 500);

    const { data: pokemonData, isLoading: isPokemonsLoading, isError } = useFetchAllPokemons({ limit: 1000, name: debouncedSearch });

    const pokemonOptions = pokemonData && 'results' in pokemonData
        ? pokemonData.results.map(p => ({ label: p.name, value: p.name }))
        : [];

    useEffect(() => {
        if (open) { // Form ko sirf modal open hone par reset karein
            if (initialData) {
                reset({ name: initialData.name, pokemons: initialData.pokemons });
            } else {
                reset({ name: '', pokemons: [] });
            }
        }
    }, [initialData, open, reset]);

    const handleFormSubmit = (data: TeamFormData) => {
        onSubmit(data);
    };

    return (
        <Modal
            title={initialData ? 'Edit Team' : 'Create New Team'}
            open={open}
            // 1. 'onOk' prop yahan se hata dein
            onCancel={onClose}
            confirmLoading={isLoading}
            destroyOnClose
            // 2. Custom footer add karein
            footer={[
                <Button key="back" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    loading={isLoading}
                    onClick={handleSubmit(handleFormSubmit)}
                    className='hover:!text-gray-700'

                >
                    {initialData ? 'Update Team' : 'Create Team'}
                </Button>,
            ]}
        >
            <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
                <Form.Item label="Team Name" required validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="e.g., Fire Squad" />}
                    />
                </Form.Item>
                <Form.Item label="Select Pokémon (1-6)" required validateStatus={errors.pokemons ? 'error' : ''} help={errors.pokemons?.message}>
                    <Controller
                        name="pokemons"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                mode="multiple"
                                allowClear
                                placeholder="Select pokémons"
                                options={pokemonOptions}
                                loading={isPokemonsLoading}
                                onSearch={setPokemonSearch}
                                filterOption={false}
                            />
                        )}
                    />
                </Form.Item>
                {isError && <Alert message="Could not load Pokémon list" type="error" />}
            </Form>
        </Modal>
    );
};

export default TeamFormModal;