import io
import math
import numpy as np
import cv2
from PIL import Image, ImageOps
import mediapipe as mp
from app.schemas.pose_schemas import (
    LandmarkPoint,
    MetricasCorporalesGeometricas,
    AnalisisImagenResultado,
    AnalisisCorporalResponse,
)

# Nombres de puntos anatómicos clave MediaPipe Pose
LANDMARK_NAMES = {
    0: "NOSE",
    7: "LEFT_EAR",
    8: "RIGHT_EAR",
    11: "LEFT_SHOULDER",
    12: "RIGHT_SHOULDER",
    13: "LEFT_ELBOW",
    14: "RIGHT_ELBOW",
    15: "LEFT_WRIST",
    16: "RIGHT_WRIST",
    23: "LEFT_HIP",
    24: "RIGHT_HIP",
    25: "LEFT_KNEE",
    26: "RIGHT_KNEE",
    27: "LEFT_ANKLE",
    28: "RIGHT_ANKLE",
}

class PoseEstimatorService:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=True,
            model_complexity=2,
            enable_segmentation=False,
            min_detection_confidence=0.5,
        )

    def _preprocesar_imagen(self, image_bytes: bytes) -> np.ndarray:
        """Carga la imagen, corrige orientación EXIF y convierte a formato BGR/RGB OpenCV."""
        pil_image = Image.open(io.BytesIO(image_bytes))
        pil_image = ImageOps.exif_transpose(pil_image)
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")
        img_np = np.array(pil_image)
        return img_np

    def procesar_vista(self, image_bytes: bytes, vista: str) -> AnalisisImagenResultado:
        """Procesa una fotografía estática individual y extrae sus landmarks anatómicos."""
        try:
            img_rgb = self._preprocesar_imagen(image_bytes)
            height, width, _ = img_rgb.shape

            results = self.pose.process(img_rgb)

            if not results.pose_landmarks:
                return AnalisisImagenResultado(
                    vista=vista,
                    detectado=False,
                    calidad="INSUFFICIENT",
                    confianza_promedio=0.0,
                    landmarks=[],
                    mensaje="No se detectó ninguna persona en la fotografía.",
                )

            landmarks_list = []
            visibilities = []

            for idx, lm in enumerate(results.pose_landmarks.landmark):
                name = LANDMARK_NAMES.get(idx, f"POINT_{idx}")
                landmarks_list.append(
                    LandmarkPoint(
                        id=idx,
                        name=name,
                        x=round(float(lm.x), 4),
                        y=round(float(lm.y), 4),
                        z=round(float(lm.z), 4),
                        visibility=round(float(lm.visibility), 4),
                    )
                )
                visibilities.append(lm.visibility)

            confianza_promedio = float(np.mean(visibilities)) if visibilities else 0.0

            if confianza_promedio >= 0.75:
                calidad = "EXCELENTE"
            elif confianza_promedio >= 0.55:
                calidad = "ACEPTABLE"
            else:
                calidad = "INSUFFICIENT"

            return AnalisisImagenResultado(
                vista=vista,
                detectado=True,
                calidad=calidad,
                confianza_promedio=round(confianza_promedio, 4),
                landmarks=landmarks_list,
                mensaje="Procesamiento exitoso.",
            )

        except Exception as e:
            return AnalisisImagenResultado(
                vista=vista,
                detectado=False,
                calidad="INSUFFICIENT",
                confianza_promedio=0.0,
                landmarks=[],
                mensaje=f"Error al procesar la imagen: {str(e)}",
            )

    def calcular_metricas_globales(
        self,
        res_frontal: AnalisisImagenResultado,
        res_perfil: AnalisisImagenResultado,
        res_espalda: AnalisisImagenResultado,
    ) -> AnalisisCorporalResponse:
        """Calcula únicamente métricas geométricas sustentadas en los puntos detectados."""
        observaciones = []
        metricas = MetricasCorporalesGeometricas()

        confianzas = [
            r.confianza_promedio for r in [res_frontal, res_perfil, res_espalda] if r.detectado
        ]
        confianza_global = float(np.mean(confianzas)) if confianzas else 0.0

        if confianza_global >= 0.75:
            calidad_global = "EXCELENTE"
        elif confianza_global >= 0.55:
            calidad_global = "ACEPTABLE"
        else:
            calidad_global = "INSUFFICIENT"

        # 1. Vista Frontal (Inclinación de Hombros y Caderas)
        if res_frontal.detectado and res_frontal.landmarks:
            lms_dict = {lm.id: lm for lm in res_frontal.landmarks}
            l_shoulder = lms_dict.get(11)
            r_shoulder = lms_dict.get(12)
            l_hip = lms_dict.get(23)
            r_hip = lms_dict.get(24)

            if l_shoulder and r_shoulder and l_shoulder.visibility > 0.5 and r_shoulder.visibility > 0.5:
                dx = abs(r_shoulder.x - l_shoulder.x)
                dy = abs(r_shoulder.y - l_shoulder.y)
                angulo_hombros = math.degrees(math.atan2(dy, dx if dx > 0 else 1e-6))
                metricas.inclinacion_hombros_grados = round(angulo_hombros, 2)
                metricas.diferencia_vertical_hombros_px = round(dy, 4)

                if angulo_hombros > 3.0:
                    observaciones.append(
                        f"Inclinación geométrica aparente de hombros: {round(angulo_hombros, 1)}°."
                    )

            if l_hip and r_hip and l_hip.visibility > 0.5 and r_hip.visibility > 0.5:
                dx = abs(r_hip.x - l_hip.x)
                dy = abs(r_hip.y - l_hip.y)
                angulo_cadera = math.degrees(math.atan2(dy, dx if dx > 0 else 1e-6))
                metricas.inclinacion_cadera_grados = round(angulo_cadera, 2)

        # 2. Vista Perfil (Alineación Sagital Oreja - Hombro - Cadera)
        if res_perfil.detectado and res_perfil.landmarks:
            lms_dict = {lm.id: lm for lm in res_perfil.landmarks}
            ear = lms_dict.get(7) if lms_dict.get(7, LandmarkPoint(id=0, name="", x=0, y=0, z=0, visibility=0)).visibility > lms_dict.get(8, LandmarkPoint(id=0, name="", x=0, y=0, z=0, visibility=0)).visibility else lms_dict.get(8)
            shoulder = lms_dict.get(11) if lms_dict.get(11, LandmarkPoint(id=0, name="", x=0, y=0, z=0, visibility=0)).visibility > lms_dict.get(12, LandmarkPoint(id=0, name="", x=0, y=0, z=0, visibility=0)).visibility else lms_dict.get(12)
            hip = lms_dict.get(23) if lms_dict.get(23, LandmarkPoint(id=0, name="", x=0, y=0, z=0, visibility=0)).visibility > lms_dict.get(24, LandmarkPoint(id=0, name="", x=0, y=0, z=0, visibility=0)).visibility else lms_dict.get(24)

            if ear and shoulder and hip and ear.visibility > 0.5 and shoulder.visibility > 0.5 and hip.visibility > 0.5:
                v1 = np.array([ear.x - shoulder.x, ear.y - shoulder.y])
                v2 = np.array([hip.x - shoulder.x, hip.y - shoulder.y])
                norm1 = np.linalg.norm(v1)
                norm2 = np.linalg.norm(v2)
                if norm1 > 0 and norm2 > 0:
                    cos_theta = np.dot(v1, v2) / (norm1 * norm2)
                    angle = math.degrees(math.acos(np.clip(cos_theta, -1.0, 1.0)))
                    metricas.alineacion_sagital_oreja_hombro_cadera = round(angle, 2)

        # 3. Vista Posterior (Simetría Espalda)
        if res_espalda.detectado and res_espalda.landmarks:
            lms_dict = {lm.id: lm for lm in res_espalda.landmarks}
            l_sh = lms_dict.get(11)
            r_sh = lms_dict.get(12)
            l_hip = lms_dict.get(23)
            r_hip = lms_dict.get(24)

            if l_sh and r_sh and l_hip and r_hip:
                diff_sh = abs(l_sh.y - r_sh.y)
                diff_hip = abs(l_hip.y - r_hip.y)
                score_simetria = max(0.0, min(100.0, 100.0 - (diff_sh + diff_hip) * 300))
                metricas.simetria_espalda_score = round(score_simetria, 1)

        observaciones.append(
            "Nota: Las mediciones obtenidas son estimaciones geométricas visuales de los puntos anatómicos detectados, no evaluaciones ni diagnósticos clínicos."
        )

        return AnalisisCorporalResponse(
            calidad_global=calidad_global,
            confianza_promedio_global=round(confianza_global, 4),
            metricas=metricas,
            analisis_vistas={
                "frontal": res_frontal,
                "perfil": res_perfil,
                "espalda": res_espalda,
            },
            version_procesamiento="v1.0",
            observaciones=observaciones,
        )
