const sheetId = '1mspPVAdnGfDqwEw_QB_rflYKNPenBiD1ZNubfznXtOw';
const apiKey = 'AIzaSyDnZChYVXcoQYhK9Hi0WVIu_9vnZUdPAQY';
const sheetName = 'TDSheet';
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

export const fetchGoogleSheetData = () => fetch(url).then(res => res.json());
