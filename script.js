const filters = {
    cityCode: 'CAI',
    checkIn: '2022-11-28',
    checkOut: '2022-11-30',
    children_num: 0,
    adults_num: 1,
    ages: 25,
    bed: 0,
    room: 1
}

// reqests sections
function fetchCities() {
    const cities = fetch('https://happytrip.yaso.dev/api/cities')
        .then((response) => response.json())
        .then((data) => data.data)
        .catch(error => swal('an error occured while fetching the cities'))

    return cities;
}
function fetchAllHotels() {
    return fetch(`https://happytrip.yaso.dev/api/hotels/search?destinationCode=${filters.cityCode}&checkIn=${filters.checkIn}&checkOut=${filters.checkOut}&children_num=${filters.children_num}&adults_num=${filters.adults_num}&ages=${filters.ages}&bed[]=${filters.bed}&room_num=${filters.room}`)
        .then((response) => response.json())
        .then((response) => {
            if (response.status_code > 300) {
                for (const error in response.errors) {
                    swal(`${error}: ${response.errors[error]}`);
                }
            }
            return response;
        })
        .then((data) => { return data })
        .catch(error => swal('an error occured while fetching the hotels'))
}
function fetchAvailableHotels(uuid) {
    return fetch(`https://happytrip.yaso.dev/api/hotels/available/${uuid}`)
        .then((response) => response.json())
        .then((response) => {
            if (response.status_code > 300) {
                for (const error in response.errors) {
                    swal(`${error}: ${response.errors[error]}`);
                }
            }
            return response;
        })
        .then((data) => { return data })
        .catch(error => swal('an error occured while fetching the available hotels'))
}
// end of requests sections


//handle rendering cities in dropdown
function renderCities() {
    const list = document.getElementById("cityList");
    fetchCities().then(cities => {
        for (let i = 0; i < cities.length; i++) {
            var li = document.createElement("li");
            var btn = document.createElement("button");
            btn.addEventListener("click", () => {
                filters.cityCode = cities[i].destination;
            })
            btn.appendChild(document.createTextNode(cities[i].name));
            btn.setAttribute('class', 'dropdown-item');
            btn.setAttribute('id', 'btn' + (i + 1));
            btn.setAttribute('type', 'button');
            li.appendChild(btn);
            list.appendChild(li);
        }
    })
}

//mutate the filters object to send filters 
function handleFiltersNums(event, type) {
    filters[type] = event.target.value;
}


//send uuid for search hotels api after filtering data
function sendUUID() {
    return fetchAllHotels().then(res => fetchAvailableHotels(res.searchData.uuid))
}

//handle main table header 
function handleMainTableHeader() {
    sendUUID().then((AvailableHotels) => {
        handleTableData(AvailableHotels.hotels);
        const headers = document.getElementById('headers');
        const HeaderText = ['Hotel Name', 'Category Name', ' Currency', 'Room Description']
        HeaderText.forEach(header => {
            let th = document.createElement('th')
            th.innerHTML = header
            if (headers.childElementCount <= HeaderText.length - 1) {
                headers.appendChild(th);
            }
        })
    })
}

//handle main table body 
function handleTableData(availableHotels) {
    const tableBody = document.getElementById('tableBody');
    tableBody.replaceChildren(tableBody.firstChild); //remove rows from table 
    availableHotels.forEach(hotel => {
        const tr = document.createElement('tr');
        for (const property in hotel) {
            if (property == 'name' || property == 'currency' || property == 'categoryName') {
                const td = document.createElement('td');
                td.innerHTML = hotel[property];
                tr.appendChild(td);
                tableBody.appendChild(tr);
            }
        }
        const btn = document.createElement('button');
        btn.textContent = 'Room Details';
        btn.className = 'btn btn-primary';
        btn.addEventListener('click', () => {
            handleModalHeader();
            handleModalTableData(hotel.rooms)
        })
        btn.setAttribute('class', 'btn btn-primary');
        btn.setAttribute('id', 'details-button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('data-bs-toggle', 'modal');
        btn.setAttribute('data-bs-target', '#exampleModal');
        tr.appendChild(btn);
    })
}


//handle table header of modal table
function handleModalHeader() {
    const headers = document.getElementById('modalHeaders');
    const HeaderText = ['Price', 'Board Code', 'Board Name'];
    HeaderText.forEach(header => {
        let th = document.createElement('th');
        th.innerHTML = header;
        if (headers.childElementCount <= HeaderText.length - 1) {
            headers.appendChild(th)
        }
    })
}

//handle modal (alerting card) table 
function handleModalTableData(rooms) {
    const tableBody = document.getElementById('tableBodyModal')
    console.log("roooms", rooms)

    rooms.forEach(room => {
        console.log("inner roooms", room)

        const tr = document.createElement('tr')
        for (const property in room) {
            if (property == 'name') {
                const td = document.createElement('td')
                td.innerHTML = room[property]
                tr.appendChild(td)
                tableBody.appendChild(tr)
            }
        }

        room.rates.forEach(roomCat => {
            const tr = document.createElement('tr')
            for (const property in roomCat) {
                console.log("property", property);

                if (property == 'boardName' || property == 'boardCode' || property == 'net') {
                    const td = document.createElement('td')
                    td.innerHTML = roomCat[property]
                    tr.appendChild(td)
                    tableBody.appendChild(tr)
                }
            }
        })
        emptyModal(tableBody)
    })

}

//remove elemnts to append new data on click with out duplicatio of data
function emptyModal(element) {
    const modalEl = document.getElementById('exampleModal')
    modalEl.addEventListener('hidden.bs.modal', () => {
        element.replaceChildren(element.firstChild);
    })
}



renderCities();

//pagination
// function handlePagination(pageNum){
//     let paginationBody = document.getElementById('pagination-body');
//     for (let i = 1; i <= pageNum; i++) {
//         let li = document.createElement('li')
//         li.setAttribute('class','page-item')
//         let anchor =  document.createElement('a')
//         anchor.setAttribute('class','page-link')
//         anchor.setAttribute('href','#')
//         anchor.innerHTML=i
//         li.appendChild(anchor);
//         paginationBody.appendChild(li)
//     }
// }
// handlePagination(6)