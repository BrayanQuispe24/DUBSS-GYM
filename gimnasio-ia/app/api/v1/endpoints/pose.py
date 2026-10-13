from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.pose_estimator import PoseEstimatorService
from app.schemas.pose_schemas import AnalisisCorporalResponse

router = APIRouter()
pose_service = PoseEstimatorService()

@router.post(
    "/analisis-corporal",
    response_model=AnalisisCorporalResponse,
    summary="Procesar 3 fotografías con MediaPipe Pose y obtener estimación geométrica corporal",
)
async def procesar_fotografias_corporales(
    foto_frontal: UploadFile = File(..., description="Fotografía frontal completa"),
    foto_perfil: UploadFile = File(..., description="Fotografía lateral o de perfil"),
    foto_espalda: UploadFile = File(..., description="Fotografía posterior o de espalda"),
):
    # Validar tipos MIME
    for file, nombre in [(foto_frontal, "frontal"), (foto_perfil, "perfil"), (foto_espalda, "espalda")]:
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El archivo enviado para la vista '{nombre}' no es una imagen válida ({file.content_type}).",
            )

    bytes_frontal = await foto_frontal.read()
    bytes_perfil = await foto_perfil.read()
    bytes_espalda = await foto_espalda.read()

    res_frontal = pose_service.procesar_vista(bytes_frontal, "frontal")
    res_perfil = pose_service.procesar_vista(bytes_perfil, "perfil")
    res_espalda = pose_service.procesar_vista(bytes_espalda, "espalda")

    resultado = pose_service.calcular_metricas_globales(res_frontal, res_perfil, res_espalda)
    return resultado
