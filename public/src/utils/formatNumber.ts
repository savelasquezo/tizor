export const formatNumber = (number: number | undefined = 0, mumFractionDigits: number | undefined = 2) => {
    return number.toLocaleString('es-CO', {
        minimumFractionDigits: mumFractionDigits,
        maximumFractionDigits: mumFractionDigits,
    });
};