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
export const formatUnixDateAmPm = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000);
  
    const now = new Date();
    const isSameDay =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  
    if (isSameDay) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }); // e.g., "2:45 PM"
    }
  
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }); // e.g., "Sep 12, 2024"
  };