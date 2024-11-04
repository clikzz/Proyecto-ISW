'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@context/authContext';
import {
  getEmployees,
  updateEmployeeRole,
  deleteEmployee,
} from '@api/employees';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertCircle,
  RefreshCw,
  Trash,
  ArrowUp,
  ArrowDown,
  Search,
} from 'lucide-react';
import { formatDateTime } from '@helpers/dates';
import { Button } from '@/components/ui/button';
import AddEmployeeDialog from '@/components/AddEmployeeDialog';
import { useAlert } from '@context/alertContext';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchValues, setSearchValues] = useState({
    rut: '',
    name: '',
    phone: '',
    email: '',
  });
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();

  const filteredEmployees = employees.filter((employee) => {
    return (
      (employee.name || '')
        .toLowerCase()
        .includes((searchValues.name || '').toLowerCase()) &&
      (employee.email || '')
        .toLowerCase()
        .includes((searchValues.email || '').toLowerCase()) &&
      (employee.role || '')
        .toLowerCase()
        .includes((searchValues.role || '').toLowerCase())
    );
  });

  const handleSearchChange = (key, value) => {
    setSearchValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const fetchEmployees = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await getEmployees();
      showAlert('Lista de empleados actualizada', 'success');
      response.forEach((employee) => {
        if (!employee.phone_user) {
          employee.phone_user = 'SIN REGISTRAR';
        }
        if (employee.role_user === 'admin') {
          employee.role = 'Administrador';
        } else {
          employee.role = 'Empleado';
        }
        employee.created_at = formatDateTime(employee.created_at);
      });
      setEmployees(response);
      setError(null);
    } catch (error) {
      showAlert('Error al obtener la lista de empleados', 'error');
      setError('Failed to fetch employees. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [isAuthenticated]);

  const handleDelete = async (rut) => {
    try {
      const response = await deleteEmployee(rut);
      if (response.message) {
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleRoleChange = async (rut, newRole) => {
    try {
      await updateEmployeeRole(rut, newRole);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee role:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-muted-foreground">
            Please log in to view employees.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={fetchEmployees} className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <AddEmployeeDialog fetchEmployees={fetchEmployees} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 text-red-500">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </div>
        ) : employees.length === 0 ? (
          <div className="flex items-center justify-center p-4 text-muted-foreground">
            No employees found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="font-bold">
                  <TableCell className="min-w-[100px]">
                    RUT
                    <button onClick={() => handleSort('rut')}>
                      {sortConfig.key === 'rut' &&
                      sortConfig.direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    Nombre
                    <button onClick={() => handleSort('name_user')}>
                      {sortConfig.key === 'name_user' &&
                      sortConfig.direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    Teléfono
                    <button onClick={() => handleSort('phone_user')}>
                      {sortConfig.key === 'phone_user' &&
                      sortConfig.direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="min-w-[250px]">
                    Email
                    <button onClick={() => handleSort('email')}>
                      {sortConfig.key === 'email' &&
                      sortConfig.direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    Creado
                    <button onClick={() => handleSort('created_at')}>
                      {sortConfig.key === 'created_at' &&
                      sortConfig.direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    Modificado
                    <button onClick={() => handleSort('updated_at')}>
                      {sortConfig.key === 'updated_at' &&
                      sortConfig.direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    Rol
                    <button onClick={() => handleSort('role')}>
                      {sortConfig.key === 'role' &&
                      sortConfig.direction === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="min-w-[100px]">Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEmployees.map((employee) => (
                  <TableRow key={employee.rut}>
                    <TableCell className="font-medium">
                      {employee.rut}
                    </TableCell>
                    <TableCell>{employee.name_user}</TableCell>
                    <TableCell>{employee.phone_user}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.created_at}</TableCell>
                    <TableCell>{employee.updated_at}</TableCell>
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
                        onClick={() => handleDelete(employee.rut)}
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
