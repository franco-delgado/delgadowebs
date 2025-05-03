<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, .user-scalable=no,.initial-scale=1.0,.minimum-scale=1.0">
	<meta name="keywords" content="web desarrollo pagina sitio">
	<meta name="description" content="pagina para los turnos de las farmacias aimogasta, negocios, publicidad">
	<meta name="autor" content="Franco Delgado">
	<meta name="robots" content="index, aimogasta, farmacia, turno, rioja">
	<meta charset="utf-8">
	<link rel="icon" href="icon.jpg">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<title>Muestra</title>
</head>
<body style="background-color: gainsboro;">
    <?php
require('fpdf/fpdf.php'); // Incluye la clase FPDF
$texto = "funciona bien";

$pdf = new FPDF();  // Crea una nueva instancia de la clase
$pdf->AddPage();    // Agrega una nueva página

$pdf->SetFont('Arial','B',16);  // Establece la fuente, estilo y tamaño
$pdf->Cell(40,10,'Tu negocio', 0, 1, 'C'); // Agrega texto a la página
$pdf->SetFont('Arial','',12); // Cambiamos la fuente para las siguientes líneas

// Segunda línea
$pdf->Cell(0, 8, 'segunda linea', 0, 1);

// Tercera línea
$pdf->Cell(0, 8, $texto, 0, 1);


$pdf->Output();  // Genera el archivo PDF (puede ser descargado o mostrado en el navegador)

// Crear nuevo documento PDF
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// Establecer información del documento
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Tu Nombre/Empresa');
$pdf->SetTitle('Ticket de Venta');

// Deshabilitar cabecera y pie de página por defecto
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);

// Establecer márgenes
$pdf->SetMargins(10, 10, 10, true);

// Añadir una página
$pdf->AddPage();

// Establecer fuente
$pdf->SetFont('helvetica', '', 10);

// Contenido del ticket
$html = '<h1>Ticket de Venta</h1>';
$html .= '<p>Producto: Tomaco - $300</p>';
$html .= '<p>Producto: Papa - $5.000</p>';
$html .= '<hr>';
$html .= '<h3>Total: $5.300</h3>';

// Escribir el HTML en el PDF
$pdf->writeHTML($html, true, false, true, false, '');

// Generar el archivo PDF y forzar la descarga (o guardar en el servidor)
$pdf->Output('ticket.pdf', 'D'); // 'D' para descarga, 'F' para guardar en archivo
?>
</body>
</html>