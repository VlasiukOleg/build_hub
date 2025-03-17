const sheetId = '1mspPVAdnGfDqwEw_QB_rflYKNPenBiD1ZNubfznXtOw';
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

const sheetName = 'TDSheet';
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

export const fetchGoogleSheetData = () => fetch(url).then(res => res.json());
