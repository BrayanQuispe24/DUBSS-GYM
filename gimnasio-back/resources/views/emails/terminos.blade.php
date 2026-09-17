<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Registro - Gimnasio UAGRM</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

    <!-- Wrapper Table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F1F5F9; padding: 30px 15px;">
        <tr>
            <td align="center">
                <!-- Main Container Card -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header Banner -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #001C38 0%, #003B70 50%, #990000 100%); padding: 35px 25px; color: #FFFFFF; text-align: center;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 12px;">
                                        <div style="width: 52px; height: 52px; background: #990000; border-radius: 12px; display: inline-block; line-height: 52px; text-align: center; color: #FFFFFF; font-size: 24px; font-weight: bold; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 15px rgba(153, 0, 0, 0.4);">
                                            🏋️
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                                FITGO <span style="color: #FF4D4D;">UAGRM</span>
                            </h1>
                            <p style="margin: 5px 0 0 0; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: rgba(255, 255, 255, 0.8); text-transform: uppercase;">
                                Dirección Universitaria de Bienestar Social
                            </p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 35px 30px; background-color: #FFFFFF;">
                            
                            <!-- Greeting -->
                            <h2 style="margin: 0 0 10px 0; color: #0F172A; font-size: 20px; font-weight: 700;">
                                ¡Bienvenido(a), {{ $nombreCompleto }}! 👋
                            </h2>
                            <p style="margin: 0 0 25px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                                Tu cuenta cliente en la plataforma oficial del <strong>Gimnasio D.U.B.S. UAGRM</strong> ha sido registrada exitosamente.
                            </p>

                            <!-- User Info Badge Box -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border-left: 4px solid #003B70; border-radius: 6px; padding: 15px 20px; margin-bottom: 25px;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748B;">
                                            <strong>Correo Electrónico:</strong> <span style="color: #003B70; font-weight: 600;">{{ $email }}</span>
                                        </p>
                                        <p style="margin: 0; font-size: 13px; color: #64748B;">
                                            <strong>Fecha de Aceptación:</strong> <span style="color: #0F172A; font-weight: 600;">{{ $fecha }}</span>
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Section Title -->
                            <h3 style="margin: 0 0 15px 0; color: #003B70; font-size: 16px; font-weight: 700; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px;">
                                📜 Términos y Condiciones de Uso Aceptados
                            </h3>

                            <p style="margin: 0 0 15px 0; font-size: 14px; color: #475569; line-height: 1.5;">
                                Al completar el formulario de registro, has aceptado expresamente los siguientes compromisos y reglamentos de responsabilidad:
                            </p>

                            <!-- Terms List Table -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px dashed #E2E8F0;">
                                        <strong style="color: #990000; font-size: 14px;">1. Uso Personal e Intransferible:</strong>
                                        <div style="font-size: 13px; color: #475569; margin-top: 3px; line-height: 1.4;">
                                            Tu credencial o pase QR es estrictamente personal. La transferencia o préstamo a terceros causará la suspensión inmediata de la cuenta.
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px dashed #E2E8F0;">
                                        <strong style="color: #990000; font-size: 14px;">2. Cuidado de Instalaciones y Equipos:</strong>
                                        <div style="font-size: 13px; color: #475569; margin-top: 3px; line-height: 1.4;">
                                            Te comprometes a cuidar la infraestructura, pesas y maquinarias del gimnasio D.U.B.S., retornando el material a su lugar asignado.
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px dashed #E2E8F0;">
                                        <strong style="color: #990000; font-size: 14px;">3. Reglamento de Seguridad e Higiene:</strong>
                                        <div style="font-size: 13px; color: #475569; margin-top: 3px; line-height: 1.4;">
                                            Obligatoriedad de uso de indumentaria deportiva adecuada, toalla de mano personal y acatamiento de las indicaciones de los instructores.
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px dashed #E2E8F0;">
                                        <strong style="color: #990000; font-size: 14px;">4. Aptitud Física y Salud:</strong>
                                        <div style="font-size: 13px; color: #475569; margin-top: 3px; line-height: 1.4;">
                                            Declaras estar en condiciones físicas aptas para la realización de actividad deportiva y musculación.
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px dashed #E2E8F0;">
                                        <strong style="color: #990000; font-size: 14px;">5. Uso Responsable del Sistema Digital:</strong>
                                        <div style="font-size: 13px; color: #475569; margin-top: 3px; line-height: 1.4;">
                                            Garantizas la veracidad de tus datos ingresados. Queda estrictamente prohibida la suplantación de identidad o uso malicioso de la plataforma.
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;">
                                        <strong style="color: #990000; font-size: 14px;">6. Tratamiento Administrativo de Datos Personales:</strong>
                                        <div style="font-size: 13px; color: #475569; margin-top: 3px; line-height: 1.4;">
                                            Autorizas expresamente al personal administrativo e instructores D.U.B.S. para consultar y tratar tus datos de registro, asistencias e historial deportivo para validación académica y gestión de procesos del gimnasio.
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Call To Action Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0 10px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ config('app.url') }}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #990000 0%, #7A0000 100%); color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 15px rgba(153, 0, 0, 0.3);">
                                            🚀 Ingresar a mi Cuenta
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 25px 20px; text-align: center; color: #64748B; font-size: 12px; line-height: 1.5;">
                            <p style="margin: 0 0 5px 0; font-weight: 700; color: #003B70;">
                                Dirección Universitaria de Bienestar Social (D.U.B.S.)
                            </p>
                            <p style="margin: 0;">
                                Universidad Autónoma Gabriel René Moreno • Santa Cruz, Bolivia
                            </p>
                            <p style="margin: 10px 0 0 0; font-size: 11px; color: #94A3B8;">
                                Este es un correo automático generado por el sistema. Por favor no responda directamente a este mensaje.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>