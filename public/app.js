// Datos simulados basados en el modelo de regresión lineal para auto-mpg
// (Representación para la visualización de resultados)
document.addEventListener('DOMContentLoaded', () => {
    
    // Generar datos representativos para las gráficas
    const generateData = () => {
        const realVsPred = [];
        const residuals = [];
        
        // Generar unos 100 puntos de datos que sigan la tendencia de un modelo con R^2 = 0.62 y RMSE = 4.42
        for (let i = 0; i < 100; i++) {
            // Rango de mpg típico: 10 a 45
            const realMpg = 10 + Math.random() * 35;
            
            // Error con distribución normal simulada aproximada centrada en 0 y desviación típica ~ 4.4
            const error = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3 * 4.42 * 2;
            
            const predictedMpg = realMpg + error;
            
            realVsPred.push({ x: realMpg, y: predictedMpg });
            residuals.push({ x: predictedMpg, y: -error }); // Residuo = Real - Predicho
        }
        
        return { realVsPred, residuals };
    };

    const { realVsPred, residuals } = generateData();

    // Configuración común para las gráficas
    Chart.defaults.color = '#cbd5e1';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // 1. Gráfica: Reales vs Predichos
    const ctxScatter = document.getElementById('scatterChart').getContext('2d');
    
    // Línea de tendencia perfecta (y = x)
    const perfectLine = [
        { x: 5, y: 5 },
        { x: 50, y: 50 }
    ];

    new Chart(ctxScatter, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Valores del Modelo',
                    data: realVsPred,
                    backgroundColor: 'rgba(99, 102, 241, 0.6)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Predicción Perfecta',
                    data: perfectLine,
                    type: 'line',
                    borderColor: 'rgba(236, 72, 153, 0.8)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Valores Reales (mpg)' },
                    min: 5,
                    max: 50,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    title: { display: true, text: 'Valores Predichos (mpg)' },
                    min: 5,
                    max: 50,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Real: ${context.raw.x.toFixed(1)}, Pred: ${context.raw.y.toFixed(1)}`;
                        }
                    }
                }
            }
        }
    });

    // 2. Gráfica: Distribución de Residuos
    const ctxResidual = document.getElementById('residualChart').getContext('2d');
    
    // Línea central (0)
    const zeroLine = [
        { x: 5, y: 0 },
        { x: 50, y: 0 }
    ];

    new Chart(ctxResidual, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Residuos',
                    data: residuals,
                    backgroundColor: 'rgba(236, 72, 153, 0.6)',
                    borderColor: 'rgba(236, 72, 153, 1)',
                    borderWidth: 1,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Error Cero',
                    data: zeroLine,
                    type: 'line',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Valores Predichos (mpg)' },
                    min: 5,
                    max: 50,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    title: { display: true, text: 'Residuo (Real - Predicho)' },
                    min: -20,
                    max: 20,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Predicho: ${context.raw.x.toFixed(1)}, Error: ${context.raw.y.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });

    // Efecto simple para links de navegación suaves
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    // --- Data Table Pagination Logic ---
    if (typeof autoMpgData !== 'undefined') {
        const rowsPerPage = 10;
        let currentPage = 1;
        const totalPages = Math.ceil(autoMpgData.length / rowsPerPage);

        const tableHead = document.getElementById('table-head');
        const tableBody = document.getElementById('table-body');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const pageInfo = document.getElementById('page-info');

        // Render Headers
        const headers = Object.keys(autoMpgData[0]);
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            tableHead.appendChild(th);
        });

        // Render Rows
        const renderTable = (page) => {
            tableBody.innerHTML = '';
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const pageData = autoMpgData.slice(start, end);

            pageData.forEach(row => {
                const tr = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = row[header] !== null ? row[header] : 'N/A';
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });

            pageInfo.textContent = `Página ${page} de ${totalPages}`;
            prevBtn.disabled = page === 1;
            nextBtn.disabled = page === totalPages;
        };

        renderTable(currentPage);

        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable(currentPage);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable(currentPage);
            }
        });
    }
});
