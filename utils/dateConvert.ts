export const formatUnixDate = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return date.toLocaleDateString("en-US", {
        month: "short", // "Sep"
        day: "2-digit", // "09"
        year: "numeric", // "2024"
    });
};

export const formatISODate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
        month: "short", // "Sep"
        day: "2-digit", // "09"
        year: "numeric", // "2024"
    });
}