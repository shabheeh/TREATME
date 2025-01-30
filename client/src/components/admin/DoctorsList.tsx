import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import doctorsService from '../../services/admin/doctorsService';
import { ResponseData } from '../../services/admin/doctorsService';
import { Avatar, Typography } from '@mui/material';




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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const DoctorsList = () => {
  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);  
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
   const [debouncedSearch, setDebouncedSearch] = useState('');
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(searchQuery);
      }, 500);
  
      return () => clearTimeout(timer);
      
    }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await doctorsService.getDoctors({
          page: page + 1, 
          limit: rowsPerPage,
          search: debouncedSearch
        });
        setData(response);
        setError(null);
      } catch (err) {
        setError('Failed to fetch patients data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage, debouncedSearch]);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); 
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          label="Search Doctors"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name, email, or phone..."
        />
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Profile</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Gender</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : ( 
              data?.doctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Doctors found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {/* {searchQuery 
                          ? 'Try adjusting your search input'
                          : 'No patients have been added yet'} */}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) :
              data?.doctors.map((doctor) => (
                <StyledTableRow key={doctor.email}>
                  <StyledTableCell >
                    <Avatar src={doctor.profilePicture} />
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </StyledTableCell>
                  <StyledTableCell>{doctor.gender}</StyledTableCell>
                  <StyledTableCell>{doctor.email}</StyledTableCell>
                  <StyledTableCell>{doctor.phone}</StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={data?.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsCount}
      />
    </Paper>
  );
};

export default DoctorsList;

