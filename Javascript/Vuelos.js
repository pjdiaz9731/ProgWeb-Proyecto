document.getElementById('flightForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const departureCountry = document.getElementById('departureCountry').value;
    const arrivalCountry = document.getElementById('arrivalCountry').value;
    const date = document.getElementById('date').value;
    const flightType = document.getElementById('flightType').value;
    const accessKey = '407a8d00f1e05537f4188f84f0760e95'; // Reemplazar con tu API Key

    const url = `https://api.aviationstack.com/v1/flightsFuture?departure_country=${departureCountry}&arrival_country=${arrivalCountry}&date=${date}&flight_type=${flightType}&access_key=${accessKey}`;

    try {
        document.getElementById('flightResults').innerHTML = '<p>Cargando datos...</p>';

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }

        const data = await response.json();

        console.log(data); // Verificar la respuesta de la API para depuración

        if (data.pagination.count > 0) {
            displayFlightResults(data.data);
        } else {
            document.getElementById('flightResults').innerHTML = '<p>No se encontraron vuelos para los criterios especificados.</p>';
        }
    } catch (error) {
        console.error('Error:', error); // Detalles del error en consola
        document.getElementById('flightResults').innerHTML = `<p>Error al obtener los datos de vuelos. Intenta nuevamente más tarde. Detalles del error: ${error.message}</p>`;
    }
});

function displayFlightResults(flights) {
    const resultsContainer = document.getElementById('flightResults');
    resultsContainer.innerHTML = ''; // Limpiar resultados previos

    flights.forEach(flight => {
        const flightDiv = document.createElement('div');
        flightDiv.classList.add('flight');

        flightDiv.innerHTML = `
            <p><strong>Aerolínea:</strong> ${flight.airline.name}</p>
            <p><strong>Vuelo:</strong> ${flight.flight.iata}</p>
            <p><strong>Origen:</strong> ${flight.departure.airport}</p>
            <p><strong>Destino:</strong> ${flight.arrival.airport}</p>
            <p><strong>Hora de salida:</strong> ${flight.departure.scheduled}</p>
            <p><strong>Hora de llegada:</strong> ${flight.arrival.scheduled}</p>
            <p><strong>Estado:</strong> ${flight.flight_status}</p>
        `;

        resultsContainer.appendChild(flightDiv);
    });
}


