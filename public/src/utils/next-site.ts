export const nextSite = (): { [key: string]: any } | null => {
    const storedSettings = localStorage.getItem('nextsite.data');
    if (storedSettings) {
        return JSON.parse(storedSettings);
    }
    return null;
};