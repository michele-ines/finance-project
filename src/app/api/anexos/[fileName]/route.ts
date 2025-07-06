import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(
  request: NextRequest,
  // O tipo do segundo argumento é a chave
  { params }: { params: { fileName: string } } 
) {
  try {
  
    const fileName = (await Promise.resolve(params)).fileName

    if (!fileName) {
      return NextResponse.json({ message: 'Nome do ficheiro não fornecido no URL.' }, { status: 400 });
    }

    const baseName = path.basename(decodeURIComponent(fileName));
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadsDir, baseName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return new NextResponse(null, { status: 204 }); 
    } else {
      return NextResponse.json({ message: 'Arquivo não encontrado.' }, { status: 404 });
    }

  } catch (error) {
    console.error('Erro ao apagar anexo:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}