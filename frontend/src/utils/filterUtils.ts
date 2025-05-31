
export const getYearNumber = (minYear: string) => {
    const match = minYear.match(/(\d)\. Schulstufe/);
    return match ? parseInt(match[1], 10) : null;
};