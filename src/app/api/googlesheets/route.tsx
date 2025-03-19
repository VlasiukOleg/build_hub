const sheetId = '1mspPVAdnGfDqwEw_QB_rflYKNPenBiD1ZNubfznXtOw';
const apiKey = process.env.GOOGLE_API_KEY; // Використовуйте звичайну змінну середовища

const sheetName = 'TDSheet';
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

export async function GET() {
  try {
    // Виконуємо запит до Google Sheets
    const response = await fetch(url); // Чекаємо завершення запиту
    const data = await response.json(); // Отримуємо JSON-дані

    // Повертаємо дані у форматі JSON
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Помилка при отриманні даних:', error);
    return new Response(JSON.stringify({ error: 'Помилка при отриманні даних' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}