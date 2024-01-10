import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import API from "../utils/API";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 20,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));



function RecentActivity(props) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    API.getTransactions()
      .then((res) => setRows(res))
      .catch((err) => console.log(err));
  }, []);


  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">DATE</StyledTableCell>
            <StyledTableCell align="left">DESCRIPTION</StyledTableCell>
            <StyledTableCell align="left">AMOUNT</StyledTableCell>
            <StyledTableCell align="left"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.data
            ? rows.data.map((result, index) => (
                <StyledTableRow key={index} data-id={index}>
                  <StyledTableCell component="th" scope="row">
                    {rows.data[index].date}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {rows.data[index].description}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    ${rows.data[index].amount}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RecentActivity;
