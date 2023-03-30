export function getPageIndex(limit: number, page?: string): number {
    if (page == undefined || page == "") return 0;
    return parseInt(page) * limit;
}