import { useState, useEffect } from "react";
import API from "../../utils/API.js";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import './style.css'

function RecentActivity({width, top}) {
   
  const [rows, setRows] = useState([]);
  const [trsx, setTrsx] = useState([]);

  useEffect(() => {
    API.getTransactions()
      .then((res) => setTrsx(res))
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    // { field: 'id', headerName: ' ', width: 70 },  /**hidden to not show the id value */
    { field: "date", headerName: "DATE", width: 230 },
    { field: "description", headerName: "DESCRIPTION", width: 300 },
    { field: "amount", headerName: "AMOUNT", width: 130 },
    // {
    //   field: 'age',
    //   headerName: 'Age',
    //   type: 'number',
    //   width: 90,
    // },
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params) =>
    //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
  ];

  // const rows = [
  //   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  //   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  //   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  //   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  //   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  //   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  //   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  //   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  //   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },

  // ];

  const row = [];
 

  return (
    <div >
          <div  style={{ height: 400, width: `${width}px` , top:`${top}px`}} className="recent-activity-table">
     
      <DataGrid
      
        rows={row}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />

      {trsx.data
        ? trsx.data.forEach((item, index) => {
            row.push({ ...item, id: item._id }); // Adding a 'id' property with index as its value

            console.log(item);
          })
        : null}
    </div>
    </div>
  );
}

export default RecentActivity;
