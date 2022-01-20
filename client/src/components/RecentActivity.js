import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  // [`&.${tableCellClasses.head}`]: {
  //   backgroundColor: theme.palette.common.black,
  //   color: theme.palette.common.white,
  // },
  // [`&.${tableCellClasses.body}`]: {
  //   fontSize: 20,
  // },
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
  const { data } = props;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <StyledTableRow>
          <StyledTableCell component="th" scope="row">
            {data.date}
          </StyledTableCell>
          <StyledTableCell align="right">{data.description}</StyledTableCell>
          <StyledTableCell align="right">${data.amount}</StyledTableCell>
        </StyledTableRow>
      </Table>
    </TableContainer>
  );
}

export default RecentActivity;
