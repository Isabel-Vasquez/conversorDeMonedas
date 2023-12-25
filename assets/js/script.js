const api_url = 'https://mindicador.cl/api/';

async function getExchange(currency) {
	try {
		const response = await fetch(`${api_url}${currency}`);
		const data = await response.json();
		const rates = data.serie ? data.serie.map((item) => item.valor) : [];
		return rates;
	} catch (error) {
		displayError(
			`Error al obtener el historial de tipos de cambio: ${error.message}`,
		);
	}
}

async function convert() {
	const amount = parseFloat(document.getElementById('amount').value);
	const currency = document.getElementById('currency').value;

	if (isNaN(amount) || amount <= 0) {
		displayError('Ingresa un monto.');
		return;
	}

	const rates = await getExchange(currency);
	if (rates.length > 0) {
		const result = amount / rates[0];
		let symbol;

		if (currency === 'dolar') {
			symbol = '$';
		} else if (currency === 'euro') {
			symbol = '€';
		}

		displayResult(`Resultado: ${symbol} ${result.toFixed(2)}`);
		updateChart(rates);
	}
}

function displayResult(message) {
	document.getElementById('result').innerHTML = `<p>${message}</p>`;
}

function displayError(message) {
	document.getElementById(
		'result',
	).innerHTML = `<p style="color: white;">${message}</p>`;
}

const ctx = document.getElementById('chart').getContext('2d');
const labels = Array.from({ length: 10 }, (_, i) =>
	new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
);
const data = [];
const chart = new Chart(ctx, {
	type: 'line',
	data: {
		labels,
		datasets: [
			{
				label: 'Valor de la moneda',
				borderColor: 'rgb(75, 192, 192)',
				data,
			},
		],
	},
});

function updateChart(rates) {
	chart.data.datasets[0].data = rates.reverse();
	chart.update();
}
