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
import {X, Check} from "lucide-react";

export interface PersonaExcel {
  id: number;
  nombre: string;
  tipoInvitado: string;
  familia: string;
  contacto: string;
  estado: string;
}
export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<PersonaExcel[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

   let personas = [
  { "id": 1, "nombre": "Ana", "apellido": "Rodríguez" },
  { "id": 2, "nombre": "Carlos", "apellido": "Méndez" },
  { "id": 3, "nombre": "María", "apellido": "Gómez" },
  { "id": 4, "nombre": "José", "apellido": "Hernández" },
  { "id": 5, "nombre": "Laura", "apellido": "Vargas" },
  { "id": 6, "nombre": "Daniel", "apellido": "Castro" },
  { "id": 7, "nombre": "Sofía", "apellido": "Ramírez" },
  { "id": 8, "nombre": "Andrés", "apellido": "Morales" },
  { "id": 9, "nombre": "Valeria", "apellido": "Jiménez" },
  { "id": 10, "nombre": "Diego", "apellido": "Rojas" },
  { "id": 11, "nombre": "Paula", "apellido": "Navarro" },
  { "id": 12, "nombre": "Luis", "apellido": "Alvarado" },
  { "id": 13, "nombre": "Camila", "apellido": "Salas" },
  { "id": 14, "nombre": "Javier", "apellido": "Pérez" },
  { "id": 15, "nombre": "Natalia", "apellido": "Cordero" },
  { "id": 16, "nombre": "Fernando", "apellido": "Araya" },
  { "id": 17, "nombre": "Lucía", "apellido": "Soto" },
  { "id": 18, "nombre": "Ricardo", "apellido": "Chaves" },
  { "id": 19, "nombre": "Elena", "apellido": "Mora" },
  { "id": 20, "nombre": "Miguel", "apellido": "Pacheco" }
]

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
