"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { X, Check, Pause, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface PersonaExcel {
  id: number;
  nombre: string;
  tipoInvitado: string;
  familia: string;
  contacto: string;
  estado: string;
  seleccionado: boolean;
}
export default function Home() {
  let invitados = [
    {
      id: 1,
      nombre: "Juan Pérez",
      tipoInvitado: "Regular",
      familia: "Pérez",
      contacto: "8888-1111",
      estado: "Confirmado",
      seleccionado: false,
    },
    {
      id: 2,
      nombre: "María Gómez",
      tipoInvitado: "Regular",
      familia: "Gómez",
      contacto: "8888-2222",
      estado: "Pendiente",
      seleccionado: false,
    },
    {
      id: 3,
      nombre: "Carlos Rodríguez",
      tipoInvitado: "Regular",
      familia: "Rodríguez",
      contacto: "8888-3333",
      estado: "No asistirá",
      seleccionado: false,
    },
    {
      id: 4,
      nombre: "Ana Fernández",
      tipoInvitado: "Regular",
      familia: "Fernández",
      contacto: "8888-4444",
      estado: "Confirmado",
      seleccionado: false,
    },
    {
      id: 5,
      nombre: "Luis Morales",
      tipoInvitado: "Padrino",
      familia: "Morales",
      contacto: "8888-5555",
      estado: "Pendiente",
      seleccionado: false,
    },
    {
      id: 6,
      nombre: "Sofía Vargas",
      tipoInvitado: "Dama de honor",
      familia: "Vargas",
      contacto: "8888-6666",
      estado: "Confirmado",
      seleccionado: false,
    },
    {
      id: 7,
      nombre: "Diego Castro",
      tipoInvitado: "Regular",
      familia: "Castro",
      contacto: "8888-7777",
      estado: "Pendiente",
      seleccionado: false,
    },
    {
      id: 8,
      nombre: "Valeria Rojas",
      tipoInvitado: "Regular",
      familia: "Rojas",
      contacto: "8888-8888",
      estado: "Confirmado",
      seleccionado: false,
    },
    {
      id: 9,
      nombre: "Andrés Navarro",
      tipoInvitado: "Regular",
      familia: "Navarro",
      contacto: "8888-9999",
      estado: "Pendiente",
      seleccionado: false,
    },
    {
      id: 10,
      nombre: "Camila Herrera",
      tipoInvitado: "Dama de honor",
      familia: "Herrera",
      contacto: "8888-0000",
      estado: "Confirmado",
      seleccionado: false,
    },
  ];

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<PersonaExcel[]>(invitados);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const loadUsuarios = async () => {
    try {
      const response = await fetch('/api/invitados');

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      console.log('Respuesta del API:', data);
      setData(data);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const actualizarInvitado = async (id: number, nuevoEstado: string) => {
    const response = await fetch(`/api/invitados/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        estado: nuevoEstado
      })
    })
    if (response.ok) {
      const actualizado = await response.json();
      setData((preData) =>
        preData.map((persona) =>
          persona.id === id ? { ...persona, estado: actualizado.estado } : persona,
        ),
      );
    }
  }

  const eliminarInvitado = async (id: number) => {
    const response = await fetch(`/api/invitados/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      let filtrado = data.filter((persona) => persona.id !== id);
      setData(filtrado);
    }
  }
  //   const eliminarInvitado = (id: number) => {
  //   let filtrado = data.filter((persona) => persona.id !== id);
  //   setData(filtrado);
  // };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json<PersonaExcel>(sheet, {
        defval: null,
      });

      await crearInvitados(jsonData);
      setData(jsonData);
      console.log("Datos Excel:", jsonData);
    } catch (error) {
      console.error("Error leyendo el Excel", error);
    } finally {
      setIsLoading(false);
    }
  };

  const crearInvitados = async (invitados: PersonaExcel[]) => {
    try {
      const response = await fetch('/api/invitados/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invitados })
      }); 
    } 
      catch (error) {
      console.error('Error creando invitados:', error);
    } 
  }

  const actualizarEstado = (id: number, nuevoEstado: string) => {
    setData((preData) =>
      preData.map((persona) =>
        persona.id === id ? { ...persona, estado: nuevoEstado } : persona,
      ),
    );
  };

  const actualizarEstadosSeleccionados = async (nuevoEstado: string) => {
    try {
      const idsSeleccionados = data
        .filter(persona => persona.seleccionado)
        .map(persona => persona.id)

      await fetch('/api/invitados/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: idsSeleccionados,
          estado: nuevoEstado
        })
      })
      setData(prev =>
        prev.map(p =>
          idsSeleccionados.includes(p.id)
            ? { ...p, estado: nuevoEstado }
            : p
        )
      )
    }
    catch (error) {
      console.error('Error actualizando estados:', error);
    }
  };


  const eliminarInvitadosSeleccionados = async () => {
    try {
      const idsSeleccionados = data
        .filter(persona => persona.seleccionado)
        .map(persona => persona.id)
      await fetch('/api/invitados/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: idsSeleccionados
        })
      })
      setChecked(!checked);
      let filtrado = data.filter((persona) => !persona.seleccionado);
      setData(filtrado);
    }
    catch (error) {
      console.error('Error eliminando invitados:', error);
    }
  };

  const seleccionarInvitado = (id: number) => {
    setData((preData) =>
      preData.map((persona) =>
        persona.id === id
          ? { ...persona, seleccionado: !persona.seleccionado }
          : persona,
      ),
    );
  };

  const seleccionarTodos = () => {
    setChecked(!checked);
    setData((preData) =>
      preData.map((persona) => ({ ...persona, seleccionado: !checked })),
    );
  };

  return (
    <div className="container  mx-auto mt-20">
      {data.some((persona) => persona.seleccionado) ? (
        <div className="w-full items-start space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={"ghost"}
                onClick={() => actualizarEstadosSeleccionados("Confirmado")}
                className="mr-2 border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Confirmar asistencia</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={"ghost"}
                onClick={() => actualizarEstadosSeleccionados("No asistirá")}
                className="border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rechazar asistencia</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={"ghost"}
                onClick={() => actualizarEstadosSeleccionados("Pendiente")}
                className="mr-2 ml-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600"
              >
                <Pause className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Pasar a pendiente</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={"ghost"}
                onClick={() => eliminarInvitadosSeleccionados()}
                className="border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Eliminar</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ) : <div className="w-full items-start space-y-2 h-[40px]"></div>
      }

      <Table>
        {data.length > 0 ? (
          <TableCaption>Esta es tu lista de invitados.</TableCaption>
        ) : (
          <TableCaption>Actualmente no tienes invitados.</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox checked={checked} onCheckedChange={seleccionarTodos} />
            </TableHead>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo de invitado</TableHead>
            <TableHead>Familia</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 &&
            data.map((persona) => (
              <TableRow key={persona.id}>
                <TableCell>
                  <Checkbox
                    checked={persona.seleccionado}
                    onCheckedChange={() => seleccionarInvitado(persona.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  INV{persona.id.toString().padStart(3, "0")}
                </TableCell>
                <TableCell>{persona.nombre}</TableCell>
                <TableCell>{persona.tipoInvitado}</TableCell>
                <TableCell>{persona.familia}</TableCell>
                <TableCell>{persona.contacto}</TableCell>
                <TableCell>
                  {persona.estado ? persona.estado : "Pendiente"}
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={"ghost"}
                        onClick={() =>
                          actualizarInvitado(persona.id, "Confirmado")
                        }
                        className="mr-2 border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Confirmar asistencia</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={"ghost"}
                        onClick={() =>
                          actualizarInvitado(persona.id, "No asistirá")
                        }
                        className="border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rechazar asistencia</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={"ghost"}
                        onClick={() =>
                          actualizarInvitado(persona.id, "Pendiente")
                        }
                        className="mr-2 ml-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600"
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pasar a pendiente</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={"ghost"}
                        onClick={() => eliminarInvitado(persona.id)}
                        className="border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Eliminar</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Button className="mt-4 mb-20" onClick={handleButtonClick}>
        Subir lista de invitados
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
