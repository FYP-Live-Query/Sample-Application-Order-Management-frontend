
import { Box } from '@mui/system';
import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { fetchEventSource } from "@microsoft/fetch-event-source";
import DataService from '../service/DataService';



const serverBaseURL = "http://localhost:8081";

function QueryEditor() {
  const [data, setData] = useState([]);
  let prevData = {ip: '', date: '', browser: '', traffic: 0};

      // const [data, setData] = useState([]);
  const fetchData = async (query) => {
    await DataService.postQuery(query);
    await fetchEventSource(`${serverBaseURL}/query?userId=QWERTY`, {
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
        console.log(parsedData);

        setData(parsedData);


        const divElement = document.getElementById('paragraph');
        

        divElement.innerHTML += parsedData;
        divElement.innerHTML += "<hr><br><br>" ;
        
      },
      onclose() {
        console.log("Connection closed by the server");
      },
      onerror(err) {
        console.log("There was an error from serve", err);
      },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault()
  }

    return (
      <div>
      <Box id='header' bgcolor={'#000000'} color={'white'} w='100%' p={4} textAlign={"center"} fontFamily="Roboto" letterSpacing="30px" fontSize={42}>
        QUERY EDITOR
      </Box>
    
      <div id='paragraph'>
            {/* <div id="time"></div>
            <div id="results"></div> */}
          {/* {data.forEach((el)=>{
              <div>el</div>
          })} */}
          {/* Timestamp: {data[5]}
          Data: {data.slice(0,5)} */}
          
          {/* <TableContainer sx={{ color: '#595959' }}  backgroundcolor='#595959' padding={'10'} >
            <Table sx={{ minWidth: 650 }} aria-label="simple table" variant='simple' >
              <TableHead> 
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell align="right">Data</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                  <TableRow
                    key={data[5]}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    id = "row"
                  >
                  {data.map((object, i) => 
                    <div>
                      <TableCell id="time" component="th" scope="row">object[5]</TableCell> 
                      <TableCell id="data" align="right" >object.slice(0, 5)</TableCell>

                      <TableCell id="time" component="th" scope="row">object[5]</TableCell> 
                      <TableCell id="data" align="right" >object.slice(0, 5)</TableCell>
                    </div>
                  )}
                  </TableRow>

              </TableBody>

            </Table>
          </TableContainer> */}

          {/* <SimpleUserTable data={data.users} isFetching={data.isFetching} /> */}
      </div>
      </div>

    );

}


export default QueryEditor;
