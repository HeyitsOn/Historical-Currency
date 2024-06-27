const apiKey = '711c10125623bccf6961012e';
const apiUrl = 'https://v6.exchangerate-api.com/v6/711c10125623bccf6961012e/latest/USD';
const usdZarBtn = document.getElementById('usdZarBtn');
const usdEurBtn = document.getElementById('usdEurBtn');
const ctx = document.getElementById('currencyChart').getContext('2d');
let currencyChart;
async function fetchCurrencyData(pair) {
    const url = `${apiUrl}`;
    console.log(`Fetching data from: ${url}`);
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('API Response:', data);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (data.result !== 'success' || !data.conversion_rates) {
            throw new Error(data['error-type'] || 'Failed to fetch data');
        }
        return data.conversion_rates;
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please check the console for more details.');
    }
}
function updateChart(data, pair) {
    if (!data) return;
    const labels = Object.keys(data).map(date => date); 
    const values = Object.values(data).map(rate => rate);
    if (currencyChart) {
        currencyChart.destroy();
    }
    currencyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: pair,
                data: values,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Exchange Rate'
                    }
                }
            }
        }
    });
}
usdZarBtn.addEventListener('click', async () => {
    usdZarBtn.classList.add('active');
    usdEurBtn.classList.remove('active');
    const data = await fetchCurrencyData('ZAR');
    updateChart(data, 'USD/ZAR');
});
usdEurBtn.addEventListener('click', async () => {
    usdEurBtn.classList.add('active');
    usdZarBtn.classList.remove('active');
    const data = await fetchCurrencyData('EUR');
    updateChart(data, 'USD/EUR');
});
(async () => {
    const initialData = await fetchCurrencyData('ZAR');
    updateChart(initialData, 'USD/ZAR');
})();