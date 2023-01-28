/**
 * Two roles of this file:
 * 1) link the browser and the server (server.js)
 * 2) call the main routine (fetching the current table as is) for each page.
 */

export const makeSqlQuery = (queryText, callback) => {
    //server requests are usually direct urls in the browser, so just 
    //build a url to pass to it for every sql request
    let url = `http://localhost:8080/?queryString=${encodeURI(queryText)}`;
    let data = fetch(url).then(function(response) {
        return response.json();
    }).then((data) => {
        callback(data)
    });
};

export const buildTable = (queryResponses) => {
    let table = document.createElement('table')
    table.setAttribute('id', 'dataTable')
    let headerRow = table.insertRow()
    
    //create column row
    //retrieves column names in the right order using the first result
    for (let column in queryResponses[0]) {
        let cell = document.createElement('th')
        cell.innerText = column
        headerRow.appendChild(cell)
    }

    //create data rows
    queryResponses.forEach(sqlRow => {
        let row = table.insertRow()
        Object.entries(sqlRow).forEach(([key, sqlCell]) => {
            if (key == 'dateOfPurchase') //remove timezone
                //javascript regex, surround with / / to get it recognized    
                sqlCell = sqlCell.replace(/T.*Z/, "")  
            let cell = row.insertCell()
            cell.innerText = sqlCell
        })
    });
    return table;
}

//main routine
if (document.title !== "Custom") 
    makeSqlQuery(`select * from \`${document.title}\``, (data)=> showTable(data))

function showTable(data) {
    let rowHeader = document.getElementById('rowHeader')
    let table = buildTable(data)
    rowHeader.after(table)
}