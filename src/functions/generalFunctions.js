
export function dateToYYYY_MM_DD(date) {
    // const year = date.toLocaleString("default", { year: "numeric" });
    const year = date.getFullYear();
    // const month = date.toLocaleString("default", { month: "long" });
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    // const day = date.toLocaleString("default", { day: "numeric" });
    const day = ("0" + date.getDate()).slice(-2)
    const returnDate = year + '-' + month + '-' + day;
    return returnDate;
}