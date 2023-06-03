import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DataService from "../service/DataService";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import Tooltip from '@mui/material/Tooltip';
const serverBaseURL = "http://localhost:8081";

function createData(source, date, time, traffic) {
  return { source, date, time, traffic };
}

function DataTable() {

  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const currentTimeInUTC = new Date().getTime();
  // console.log("time: ",currentTimeInUTC)

  useEffect(() => {
    let isMounted = true;

    function getRealtimeData(data) {
      let ls = [];
      data.forEach(element => {
        ls.push(JSON.parse(element));
      });
      return ls;
    }

    const fetchData = async () => {
      await DataService.postData();
      const eventSource = await fetchEventSource(`${serverBaseURL}/orderInfo?userId=QWERTY`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
        },
        onopen(res) {
          if (res.ok && res.status === 200) {
            console.log("Connection made ", res);
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },
        onmessage(event) {
          const parsedData = JSON.parse(event.data);

          if (isMounted) {
            setRows(parsedData);
            setAllRows(prevRows => {
              const newRows = [...prevRows, parsedData];
              return newRows.length > 20 ? newRows.slice(newRows.length - 20) : newRows;
            });
          }
        },
        onclose() {
          console.log("Connection closed by the server");
        },
        onerror(err) {
          console.log("There was an error from server", err);
        },
      });

      return eventSource;
    };

    const eventSource = fetchData();

    return () => {
      isMounted = false;
      eventSource.then(source => source.close());
    };
  }, []);

  // console.log("Data: ", rows);
  console.log("All Data: ", allRows);

  return (
    <TableContainer sx={{ color: '#595959' }} component={Paper} backgroundcolor='#595959' padding={'10'} >
      <Table sx={{ minWidth: 650 }} aria-label="simple table" variant='simple' >
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell align="right">Item Type</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right"><Tooltip title="Total Cost"><div>Total Revenue</div></Tooltip></TableCell>
            <TableCell align="right"><Tooltip title="Total Cost"><div>Total Cost</div></Tooltip></TableCell>
            <TableCell align="right"><Tooltip title="Total Cost"><div>Total Profit</div></Tooltip></TableCell>
            <TableCell align="right"><Tooltip title="Total Cost"><div>Latency</div></Tooltip></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allRows.reverse().map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="right">{row[1]}</TableCell>
              <TableCell align="right">{row[2]}$</TableCell>
              <TableCell align="right">{row[3]}$</TableCell>
              <TableCell align="right">{row[4]}$</TableCell>
              <TableCell align="right">{row[5]}$</TableCell>
              <TableCell component="th" scope="row">{row[6]}</TableCell>
              <TableCell component="th" scope="row">{currentTimeInUTC}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );
}

export default DataTable;
