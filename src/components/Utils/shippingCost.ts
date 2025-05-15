interface ShippingCost {
    cost: number;
    estimatedDays: number;
}

export const calculateShippingCost = (city: string, totalAmount: number): ShippingCost => {
    // Base shipping cost
    let baseCost = 50;

    // Free shipping for orders above 5000
    if (totalAmount >= 5000) {
        return {
            cost: 0,
            estimatedDays: 3
        };
    }

    // Different shipping costs based on city
    switch (city.toLowerCase()) {
        case 'chapainawabganj':
            return {
                cost: baseCost,
                estimatedDays: 1
            };
        case 'chittagong':
            return {
                cost: baseCost + 50,
                estimatedDays: 2
            };
        case 'rajshahi':
        case 'khulna':
        case 'barishal':
        case 'sylhet':
        case 'rangpur':
        case 'mymensingh':
            return {
                cost: baseCost + 100,
                estimatedDays: 3
            };
        default:
            return {
                cost: baseCost + 150,
                estimatedDays: 4
            };
    }
}; 