import {PoData} from "@/app/(protected)/admin/pet/po_data";


export function parsePoHtmlTable(htmlString: string, city: string): PoData[] {
    const result: PoData[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const rows = doc.querySelectorAll('table.table-prices tbody tr');
    rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const district = cells[0].textContent?.trim() || '';
            const gasoline = extractNumber(cells[1].querySelector('.with-tax'));
            const diesel = extractNumber(cells[2].querySelector('.with-tax'));
            const autogas = extractNumber(cells[3].querySelector('.with-tax'));

            result.push({
                district,
                city,
                gasoline,
                diesel,
                autogas
            });
        }
    });


    function extractNumber(element: Element | null): number {
        if (!element) return 0;
        const text = element.textContent?.trim() || "0";
        const cleanText = text.replace(/\s/g, '');
        if (cleanText.indexOf(',') > -1 && cleanText.indexOf('.') > -1) {
            return parseFloat(cleanText.replace(/\./g, '').replace(',', '.')) || 0;
        }
        return parseFloat(cleanText.replace(',', '.')) || 0;
    }
    return result;
}
