import { useState, useMemo } from 'react';

interface RoomFilters {
    roomType: string;
    status: string;
    floor: string;
}

interface Room {
    id: string;
    number: string;
    name?: string;
    icon?: {
        name: string;
        src: string;
    }[];
    isExpanded: boolean;
}

interface RoomCategory {
    id: string;
    name: string;
    rooms: Room[];
    isExpanded: boolean;
}

export const useRoomFilters = (categories: RoomCategory[]) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<RoomFilters>({
        roomType: '',
        status: '',
        floor: '',
    });

    const filteredCategories = useMemo(() => {
        return categories.map(category => {
            const filteredRooms = category.rooms.filter(room => {
                // Search query filter
                const searchMatch = searchQuery.trim() === '' ||
                    (room.name || room.number).toLowerCase().includes(searchQuery.toLowerCase());

                // Room type filter
                const typeMatch = !filters.roomType || category.id === filters.roomType;

                // Status filter
                const statusMatch = !filters.status ||
                    room.icon?.some(icon => icon.name.toLowerCase() === filters.status.toLowerCase());

                // Floor filter
                const floorMatch = !filters.floor ||
                    room.number.startsWith(filters.floor);

                return searchMatch && typeMatch && statusMatch && floorMatch;
            });

            return {
                ...category,
                rooms: filteredRooms,
                // Auto-collapse empty categories
                isExpanded: category.isExpanded && filteredRooms.length > 0
            };
        }).filter(category => category.rooms.length > 0);
    }, [categories, searchQuery, filters]);

    const updateFilter = (key: keyof RoomFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            roomType: '',
            status: '',
            floor: ''
        });
        setSearchQuery('');
    };

    return {
        searchQuery,
        setSearchQuery,
        filters,
        updateFilter,
        clearFilters,
        filteredCategories
    };
};