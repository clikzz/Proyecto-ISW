import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@context/authContext";
import { getUsers, updateUserRole, deleteUser } from "@api/user";
import { ArrowUpDown, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import AddUserDialog from "@/components/AddUserDialog";
import { useAlert } from "@context/alertContext";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      response.forEach((user) => {
        if (!user.phone_user) {
          user.phone_user = "SIN REGISTRAR";
        }
        if (user.role_user === "admin") {
          user.role = "Administrador";
        } else {
          user.role = "Empleado";
        }
      });
      setUsers(response);
    } catch (error) {
      showAlert("Error al obtener la lista de empleados", "error");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (rut) => {
    setUserToDelete(rut);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userToDelete);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setUserToDelete(null);
  };

  const handleRoleChange = async (rut, newRole) => {
    try {
      await updateUserRole(rut, newRole);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleImageClick = (imageSrc) => {
    setExpandedImage(imageSrc);
  };

  const handleCloseImage = () => {
    setExpandedImage(null);
  };

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter((user) =>
    user.name_user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
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
          <AddUserDialog fetchUsers={fetchUsers} />
        </div>
      </div>
      <Card className="border-none pt-4">
        <CardContent>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name_user")}
                      className="text-foreground"
                    >
                      <strong>Nombre</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("rut")}
                      className="text-foreground"
                    >
                      <strong>RUT</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("phone_user")}
                      className="text-foreground"
                    >
                      <strong>Teléfono</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("email")}
                      className="text-foreground"
                    >
                      <strong>Email</strong>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("role")}
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
                {filteredUsers.map((user) => (
                  <TableRow key={user.rut}>
                    <TableCell>
                      <figure
                        className="w-12 h-12 rounded-full overflow-hidden shadow-md cursor-pointer"
                        onClick={() => handleImageClick(user.profile_picture)}
                      >
                        <img
                          key={user.profile_picture}
                          src={user.profile_picture}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                        />
                      </figure>
                    </TableCell>
                    <TableCell>{user.name_user}</TableCell>
                    <TableCell>{user.rut}</TableCell>
                    <TableCell>{user.phone_user}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          handleRoleChange(user.rut, value)
                        }
                        className="bg-background"
                      >
                        <SelectTrigger>{user.role}</SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="employee">Empleado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        className="bg-red-500 hover:bg-red-600 p-1"
                        onClick={() => handleDeleteClick(user.rut)}
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
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleCloseImage}
        >
          <img
            src={expandedImage}
            alt="Expanded"
            className="max-w-full max-h-full"
          />
        </div>
      )}
      <ConfirmationDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDelete}
        className="bg-background text-foreground"
      />
    </div>
  );
}
