'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@context/authContext';
import { getEmployees } from '@api/employees';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { formatDateTime } from '@helpers/dates';
import { Button } from '@/components/ui/button';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchEmployees = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await getEmployees();
      response.forEach((employee) => {
        employee.created_at = formatDateTime(employee.created_at);
      });
      setEmployees(response);
      setError(null);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [isAuthenticated]);

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
      <CardHeader className="flex items-center gap-4">
        <CardTitle className="flex items-center gap-2">
          <Button onClick={fetchEmployees} className="flex items-center">
            <RefreshCw />
          </Button>
        </CardTitle>
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
                <TableRow>
                  <TableHead className="w-[120px]">RUT</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Última Modificación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.rut}>
                    <TableCell className="font-medium">
                      {employee.rut}
                    </TableCell>
                    <TableCell>{employee.name_user}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.created_at}</TableCell>
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
