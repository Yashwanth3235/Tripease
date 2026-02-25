const STORAGE_KEY = 'travel_planner_trips';

export const getTrips = () => {
    const trips = localStorage.getItem(STORAGE_KEY);
    return trips ? JSON.parse(trips) : [];
};

export const getTripById = (id) => {
    const trips = getTrips();
    return trips.find(trip => trip.id === id);
};

export const saveTrip = (tripData) => {
    const trips = getTrips();
    const newTrip = {
        ...tripData,
        id: Date.now().toString(), // Simple ID generation
        createdAt: new Date().toISOString(),
        status: 'Planned',
        activities: [],
        expenses: [],
        totalBudget: tripData.budget || 0,
        spent: 0
    };

    trips.push(newTrip);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return newTrip;
};

export const updateTrip = (updatedTrip) => {
    const trips = getTrips();
    const index = trips.findIndex(t => t.id === updatedTrip.id);
    if (index !== -1) {
        trips[index] = updatedTrip;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    }
};

export const deleteTrip = (id) => {
    const trips = getTrips();
    const filteredTrips = trips.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTrips));
};
