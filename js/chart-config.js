// Chart Configuration
function createProgressChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['15.04', '16.04', '17.04', '18.04', '19.04', '20.04', '21.04'],
            datasets: [{
                label: 'Basic Flow',
                data: [10, 30, 50, 100, 150, 200, 300],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4
            }, {
                label: 'Neck Wrap',
                data: [0, 5, 10, 20, 30, 50, 50],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                tension: 0.4
            }, {
                label: 'High/Low Whip',
                data: [0, 0, 5, 15, 20, 30, 30],
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Postęp treningowy (liczba powtórzeń)',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}