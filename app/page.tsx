"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { X, Check } from "lucide-react";

export interface PersonaExcel {
  id: number;
  nombre: string;
  tipoInvitado: string;
  familia: string;
  contacto: string;
  estado: string;
}
export default function Home() {
  let invitados = [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "tipoInvitado": "Regular",
      "familia": "Pérez",
      "contacto": "8888-1111",
      "estado": "Confirmado"
    },
    {
      "id": 2,
      "nombre": "María Gómez",
      "tipoInvitado": "Regular",
      "familia": "Gómez",
      "contacto": "8888-2222",
      "estado": "Pendiente"
    },
    {
      "id": 3,
      "nombre": "Carlos Rodríguez",
      "tipoInvitado": "Regular",
      "familia": "Rodríguez",
      "contacto": "8888-3333",
      "estado": "No asistirá"
    },
    {
      "id": 4,
      "nombre": "Ana Fernández",
      "tipoInvitado": "Regular",
      "familia": "Fernández",
      "contacto": "8888-4444",
      "estado": "Confirmado"
    },
    {
      "id": 5,
      "nombre": "Luis Morales",
      "tipoInvitado": "Padrino",
      "familia": "Morales",
      "contacto": "8888-5555",
      "estado": "Pendiente"
    },
    {
      "id": 6,
      "nombre": "Sofía Vargas",
      "tipoInvitado": "Dama de honor",
      "familia": "Vargas",
      "contacto": "8888-6666",
      "estado": "Confirmado"
    },
    {
      "id": 7,
      "nombre": "Diego Castro",
      "tipoInvitado": "Regular",
      "familia": "Castro",
      "contacto": "8888-7777",
      "estado": "Pendiente"
    },
    {
      "id": 8,
      "nombre": "Valeria Rojas",
      "tipoInvitado": "Regular",
      "familia": "Rojas",
      "contacto": "8888-8888",
      "estado": "Confirmado"
    },
    {
      "id": 9,
      "nombre": "Andrés Navarro",
      "tipoInvitado": "Regular",
      "familia": "Navarro",
      "contacto": "8888-9999",
      "estado": "Pendiente"
    },
    {
      "id": 10,
      "nombre": "Camila Herrera",
      "tipoInvitado": "Dama de honor",
      "familia": "Herrera",
      "contacto": "8888-0000",
      "estado": "Confirmado"
    }
  ]

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<PersonaExcel[]>(invitados);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
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

      setData(jsonData);
      console.log("Datos Excel:", jsonData);
    } catch (error) {
      console.error("Error leyendo el Excel", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container  mx-auto mt-20">
      <Table>
        {data.length > 0 ?
          <TableCaption>Esta es tu lista de invitados.</TableCaption>
          : <TableCaption>Actualmente no tienes invitados.</TableCaption>
        }
        <TableHeader>
          <TableRow>
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
                <TableCell className="font-medium">INV{persona.id.toString().padStart(3, '0')}</TableCell>
                <TableCell>{persona.nombre}</TableCell>
                <TableCell>{persona.tipoInvitado}</TableCell>
                <TableCell>{persona.familia}</TableCell>
                <TableCell>{persona.contacto}</TableCell>
                <TableCell>{persona.estado ? persona.estado : "Pendiente"}</TableCell>
                <TableCell>
                  <Button size="sm" variant={"ghost"} className="mr-2 border border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700">
                    <Check className="mr-2 h-4 w-4" />Confirmar
                  </Button>
                  <Button size="sm" variant={"ghost"} className="border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <X className="mr-2 h-4 w-4" />No asistirá
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Button className="mt-4 mb-20" onClick={handleButtonClick}>Subir lista de invitados</Button>

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
