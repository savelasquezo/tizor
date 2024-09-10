export const formatNumber = (number: number | undefined = 0) => {
    return number.toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};