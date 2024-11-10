import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@context/authContext';
import {
  getEmployees,
  updateEmployeeRole,
  deleteEmployee,
} from '@api/employees';
import { ArrowUpDown, Search, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import AddEmployeeDialog from '@/components/AddEmployeeDialog';
import { useAlert } from '@context/alertContext';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select';
import ConfirmationDialog from '@/components/ConfirmationDialog';

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      response.forEach((employee) => {
        if (!employee.phone_user) {
          employee.phone_user = 'SIN REGISTRAR';
        }
        if (employee.role_user === 'admin') {
          employee.role = 'Administrador';
        } else {
          employee.role = 'Empleado';
        }
      });
      setEmployees(response);
    } catch (error) {
      showAlert('Error al obtener la lista de empleados', 'error');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (rut) => {
    setEmployeeToDelete(rut);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEmployee(employeeToDelete);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      setDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleRoleChange = async (rut, newRole) => {
    try {
      await updateEmployeeRole(rut, newRole);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee role:', error);
    }
  };

  const sortedEmployees = useMemo(() => {
    let sortableEmployees = [...employees];
    if (sortConfig.key !== null) {
      sortableEmployees.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEmployees;
  }, [employees, sortConfig]);

  const filteredEmployees = sortedEmployees.filter((employee) =>
    employee.name_user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchEmployees();
  }, [isAuthenticated]);

  return (
    <div className="container mx-auto py-10 text-foreground relative">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center">
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
          <Search className="ml-2 h-4 w-4" />
        </div>
        <div className="flex items-center gap-2">
          <AddEmployeeDialog fetchEmployees={fetchEmployees} />
        </div>
      </div>
      <Card className="border-none pt-4">
        <CardContent>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('rut')}
                      className="text-foreground"
                    >
                      <strong>RUT</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name_user')}
                      className="text-foreground"
                    >
                      <strong>Nombre</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('phone_user')}
                      className="text-foreground"
                    >
                      <strong>Teléfono</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('email')}
                      className="text-foreground"
                    >
                      <strong>Email</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('role')}
                      className="text-foreground"
                    >
                      <strong>Rol</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <strong className="text-foreground">Acciones</strong>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.rut}>
                    <TableCell>{employee.rut}</TableCell>
                    <TableCell>{employee.name_user}</TableCell>
                    <TableCell>{employee.phone_user}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <Select
                        value={employee.role}
                        onValueChange={(value) =>
                          handleRoleChange(employee.rut, value)
                        }
                        className="bg-background"
                      >
                        <SelectTrigger>{employee.role}</SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="employee">Empleado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        className="bg-red-500 hover:bg-red-600 p-1"
                        onClick={() => handleDeleteClick(employee.rut)}
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <ConfirmationDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDelete}
        className="bg-background text-foreground"
      />
    </div>
  );
}
