// Admin_Analytics_Dashboard JS goes here
    const ctx = document.getElementById('earningsChart').getContext('2d');
    const earningsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Monthly Earnings (₹)',
          data: [8000, 12000, 15000, 17000, 18500, 21000],
          backgroundColor: 'rgba(207, 10, 44, 0.2)',
          borderColor: '#cf0a2c',
          borderWidth: 2,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });