import React, { useEffect, useState } from "react";
import RecentActivity from "../../components/RecentActivity";
import LeftNav from "../../components/LeftNav";
import Pagination from "../../components/pagination/Pagination";
import API from "../../utils/API";
import "./style.css";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

function Activity() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    API.getTransactions()
      .then((res) => setTransactions(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <LeftNav />
      <div className="activity">
        <div className="card-group col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Pending</h5>
              <p className="card-text">$400.00</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Posted</h5>
              <p className="card-text">$434.10</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Balance</h5>
              <p className="card-text">$834.10</p>
            </div>
          </div>
        </div>

        <TableHead>
          <TableRow>
            <StyledTableCell align="left">DATE</StyledTableCell>
            <StyledTableCell align="left">DESCRIPTION</StyledTableCell>
            <StyledTableCell align="left">AMOUNT</StyledTableCell>
            <StyledTableCell align="left"></StyledTableCell>
          </TableRow>
        </TableHead>

        <div className="recent-pos col-md-8">
          {(transactions.data && transactions.data.length > 0 ? 
          transactions.data.length : 0) ? (
            <>
              <Pagination
                transactions={transactions}
                dataLimit={5}
                pageLimit={5}
              />
            </>
          ) : (
            <h1>No transactions to display</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default Activity;
