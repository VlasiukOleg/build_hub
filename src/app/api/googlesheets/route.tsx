const sheetId = '1mqxvkhDcdpyb-9t1Bn3BxgkztNr9kx1sa_OsMEG5qeA';
const apiKey = process.env.GOOGLE_API_KEY; // Використовуйте звичайну змінну середовища

const sheetName = 'TDSheet';
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

export async function GET() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Помилка при отриманні даних:', error);
    return new Response(
      JSON.stringify({ error: 'Помилка при отриманні даних' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
