import * as XLSX from 'xlsx';

export const exportToExcel = (guests, fileName = 'lista-invitados') => {
    // Transformar los datos para el formato Excel
    const excelData = guests.map(guest => ({
        'Nombre': guest.name || '',
        'Email': guest.email || '',
        'Teléfono': guest.phone || '',
        'Tipo': guest.type ? guest.type.charAt(0).toUpperCase() + guest.type.slice(1) : '',
        'Estado': guest.status === 'confirmed' ? 'Confirmado' :
            guest.status === 'pending' ? 'Pendiente' :
                guest.status === 'declined' ? 'Rechazado' : 'Desconocido',
        'N° Acompañantes': guest.numberOfGuests || 0,
        'Nombres Acompañantes': Array.isArray(guest.additionalGuestNames) ?
            guest.additionalGuestNames.join(', ') : '',
        'Canciones Sugeridas': Array.isArray(guest.suggestedSongs) ?
            guest.suggestedSongs.join(', ') : '',
        'Mensaje Personal': guest.personalMessage || ''
    }));

    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar ancho de columnas
    const colWidths = [
        { wch: 30 }, // Nombre
        { wch: 30 }, // Email
        { wch: 15 }, // Teléfono
        { wch: 15 }, // Tipo
        { wch: 15 }, // Estado
        { wch: 15 }, // N° Acompañantes
        { wch: 40 }, // Nombres Acompañantes
        { wch: 40 }, // Canciones Sugeridas
        { wch: 50 }, // Mensaje Personal
    ];
    ws['!cols'] = colWidths;

    // Agregar la worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Invitados');

    // Guardar el archivo
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};