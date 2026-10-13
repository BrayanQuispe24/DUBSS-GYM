<?php

namespace Database\Seeders;

use App\Models\Ejercicio;
use App\Models\EjercicioGrupoMuscular;
use App\Models\EjercicioImagen;
use App\Models\GrupoMuscular;
use App\Models\TipoEjercicio;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class EjercicioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = base_path('../EJERCICIOS/free-exercise-db/dist/exercises.json');

        if (! File::exists($jsonPath)) {
            $this->command->error("No se encontró el archivo JSON en: {$jsonPath}");

            return;
        }

        $this->command->info("Cargando dataset desde: {$jsonPath}");
        $jsonContent = File::get($jsonPath);
        $exercises = json_decode($jsonContent, true);

        if (! $exercises || ! is_array($exercises)) {
            $this->command->error('El archivo JSON está vacío o tiene un formato inválido.');

            return;
        }

        $this->command->info('Procesando '.count($exercises).' ejercicios...');

        // 1. Mapeos de Categorías a TipoEjercicio (Español)
        $categoriaMap = [
            'strength' => 'Fuerza',
            'cardio' => 'Cardio',
            'stretching' => 'Estiramiento',
            'powerlifting' => 'Powerlifting',
            'olympic weightlifting' => 'Halterofilia',
            'strongman' => 'Strongman',
            'plyometrics' => 'Pliometría',
        ];

        $tiposEjercicioModels = [];
        foreach ($categoriaMap as $key => $nombreEs) {
            $tiposEjercicioModels[$key] = TipoEjercicio::firstOrCreate(
                ['nombre' => $nombreEs],
                ['estado' => true]
            );
        }

        // 2. Mapeos de Músculos a GrupoMuscular (Español)
        $musculoMap = [
            'abdominals' => 'Abdominales',
            'abductors' => 'Abductores',
            'adductors' => 'Aductores',
            'biceps' => 'Bíceps',
            'calves' => 'Pantorrillas',
            'chest' => 'Pecho',
            'forearms' => 'Antebrazos',
            'glutes' => 'Glúteos',
            'hamstrings' => 'Isquiotibiales',
            'lats' => 'Dorsales',
            'lower back' => 'Lumbares',
            'middle back' => 'Espalda Media',
            'neck' => 'Cuello',
            'quadriceps' => 'Cuádriceps',
            'shoulders' => 'Hombros',
            'traps' => 'Trapecios',
            'triceps' => 'Tríceps',
        ];

        $gruposMuscularesModels = [];
        foreach ($musculoMap as $key => $nombreEs) {
            $gruposMuscularesModels[$key] = GrupoMuscular::firstOrCreate(
                ['nombre' => $nombreEs],
                ['descripcion' => 'Grupo muscular de los '.strtolower($nombreEs)]
            );
        }

        // Mapeo de equipamiento
        $equipamientoMap = [
            'body only' => 'Peso corporal',
            'dumbbell' => 'Mancuerna',
            'barbell' => 'Barra',
            'kettlebells' => 'Pesa Rusa (Kettlebell)',
            'cable' => 'Polea',
            'machine' => 'Máquina',
            'bands' => 'Banda Elástica',
            'medicine ball' => 'Balón Medicinal',
            'exercise ball' => 'Pelota de Ejercicio (Fitball)',
            'foam roll' => 'Rodillo de Espuma (Foam Roller)',
            'e-z curl bar' => 'Barra Z',
            'other' => 'Otro',
        ];

        // Mapeo de nivel
        $nivelMap = [
            'beginner' => 'Principiante',
            'intermediate' => 'Intermedio',
            'expert' => 'Avanzado / Experto',
        ];

        // Mapeo de mecánica
        $mecanicaMap = [
            'compound' => 'Compuesto (Multiarticular)',
            'isolation' => 'Aislamiento (Monoarticular)',
        ];

        // Mapeo de fuerza
        $fuerzaMap = [
            'push' => 'Empuje',
            'pull' => 'Tracción / Jalón',
            'static' => 'Isométrico / Estático',
        ];

        $sourceExercisesDir = base_path('../EJERCICIOS/free-exercise-db/exercises');
        $publicStorageEjerciciosDir = storage_path('app/public/ejercicios');

        if (! File::isDirectory($publicStorageEjerciciosDir)) {
            File::makeDirectory($publicStorageEjerciciosDir, 0755, true);
        }

        DB::beginTransaction();

        try {
            $count = 0;
            foreach ($exercises as $item) {
                // Traducir nombre del ejercicio
                $nombreOriginal = $item['name'] ?? $item['id'];
                $nombreEs = $this->traducirNombreEjercicio($nombreOriginal);

                // Obtener TipoEjercicio
                $catKey = strtolower($item['category'] ?? 'strength');
                $tipoEjercicio = $tiposEjercicioModels[$catKey] ?? reset($tiposEjercicioModels);

                // Construir Descripción en Español
                $descripcionLines = [];
                $equip = $equipamientoMap[strtolower($item['equipment'] ?? '')] ?? ($item['equipment'] ?? 'General');
                $nivel = $nivelMap[strtolower($item['level'] ?? '')] ?? ($item['level'] ?? 'General');
                $mecanica = $mecanicaMap[strtolower($item['mechanic'] ?? '')] ?? null;
                $fuerza = $fuerzaMap[strtolower($item['force'] ?? '')] ?? null;

                $descripcionLines[] = "**Equipamiento:** {$equip}";
                $descripcionLines[] = "**Nivel de Dificultad:** {$nivel}";
                if ($mecanica) {
                    $descripcionLines[] = "**Mecánica:** {$mecanica}";
                }
                if ($fuerza) {
                    $descripcionLines[] = "**Fuerza ejercida:** {$fuerza}";
                }

                if (! empty($item['instructions']) && is_array($item['instructions'])) {
                    $descripcionLines[] = "\n**Instrucciones de Ejecución:**";
                    foreach ($item['instructions'] as $idx => $paso) {
                        $pasoEs = $this->traducirPaso($paso);
                        $num = $idx + 1;
                        $descripcionLines[] = "{$num}. {$pasoEs}";
                    }
                }

                $codigoExterno = $item['id'] ?? null;
                $equipRaw = strtolower($item['equipment'] ?? '');
                $nivelRaw = strtolower($item['level'] ?? '');
                $mecanicaRaw = strtolower($item['mechanic'] ?? '');
                $fuerzaRaw = strtolower($item['force'] ?? '');
                $descripcionFinal = implode("\n", $descripcionLines);

                // Crear o Actualizar Ejercicio
                $ejercicio = Ejercicio::updateOrCreate(
                    ['nombre' => $nombreEs],
                    [
                        'codigo_externo' => $codigoExterno,
                        'descripcion' => $descripcionFinal,
                        'id_tipo_ejercicio' => $tipoEjercicio->id,
                        'equipamiento' => $equipamientoMap[$equipRaw] ?? ($item['equipment'] ?? 'General'),
                        'nivel_dificultad' => $nivelMap[$nivelRaw] ?? ($item['level'] ?? 'General'),
                        'mecanica' => $mecanicaMap[$mecanicaRaw] ?? null,
                        'patron_movimiento' => $fuerzaMap[$fuerzaRaw] ?? null,
                        'fuente_origen' => 'free-exercise-db',
                        'url_video' => null,
                    ]
                );

                // Asignar Grupos Musculares Primarios
                if (! empty($item['primaryMuscles']) && is_array($item['primaryMuscles'])) {
                    foreach ($item['primaryMuscles'] as $muscKey) {
                        $muscKeyLower = strtolower($muscKey);
                        if (isset($gruposMuscularesModels[$muscKeyLower])) {
                            EjercicioGrupoMuscular::firstOrCreate([
                                'id_ejercicio' => $ejercicio->id,
                                'id_grupo_muscular' => $gruposMuscularesModels[$muscKeyLower]->id,
                                'tipo_participacion' => 'primario',
                            ]);
                        }
                    }
                }

                // Asignar Grupos Musculares Secundarios
                if (! empty($item['secondaryMuscles']) && is_array($item['secondaryMuscles'])) {
                    foreach ($item['secondaryMuscles'] as $muscKey) {
                        $muscKeyLower = strtolower($muscKey);
                        if (isset($gruposMuscularesModels[$muscKeyLower])) {
                            EjercicioGrupoMuscular::firstOrCreate([
                                'id_ejercicio' => $ejercicio->id,
                                'id_grupo_muscular' => $gruposMuscularesModels[$muscKeyLower]->id,
                                'tipo_participacion' => 'secundario',
                            ]);
                        }
                    }
                }

                // Procesar Galería de Imágenes
                if (! empty($item['images']) && is_array($item['images'])) {
                    foreach ($item['images'] as $ordenImg => $relImagePath) {
                        $sourceImgFile = $sourceExercisesDir.'/'.$relImagePath;
                        if (File::exists($sourceImgFile)) {
                            $targetImgFile = $publicStorageEjerciciosDir.'/'.$relImagePath;
                            $targetSubDir = dirname($targetImgFile);

                            if (! File::isDirectory($targetSubDir)) {
                                File::makeDirectory($targetSubDir, 0755, true);
                            }

                            File::copy($sourceImgFile, $targetImgFile);

                            $fullUrl = asset('storage/ejercicios/'.$relImagePath);
                            $numPaso = $ordenImg + 1;

                            EjercicioImagen::updateOrCreate(
                                [
                                    'id_ejercicio' => $ejercicio->id,
                                    'orden' => $ordenImg,
                                ],
                                [
                                    'path_imagen' => $fullUrl,
                                    'titulo' => "Paso {$numPaso} - {$nombreEs}",
                                    'descripcion' => "Imagen ilustrativa de la postura {$numPaso} para {$nombreEs}",
                                ]
                            );
                        }
                    }
                }

                $count++;
            }

            DB::commit();
            $this->command->info("¡Éxito! Se han migrado {$count} ejercicios completamente en español.");
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->command->error('Error durante la ejecución del seeder: '.$e->getMessage());
            throw $e;
        }
    }

    /**
     * Traduce términos técnicos comunes en títulos de ejercicios al español.
     */
    private function traducirNombreEjercicio(string $name): string
    {
        $diccionario = [
            'Barbell Bench Press - Medium Grip' => 'Press de banca con barra - Agarre medio',
            'Barbell Bench Press' => 'Press de banca con barra',
            'Barbell Full Squat' => 'Sentadilla profunda con barra',
            'Barbell Squat' => 'Sentadilla con barra',
            'Barbell Deadlift' => 'Peso muerto con barra',
            'Barbell Curl' => 'Curl de bíceps con barra',
            'Barbell Lunge' => 'Zancadas con barra',
            'Barbell Shoulder Press' => 'Press militar de hombros con barra',
            'Barbell Shrug' => 'Encogimientos de hombros con barra',
            'Dumbbell Bicep Curl' => 'Curl de bíceps con mancuernas',
            'Dumbbell Bench Press' => 'Press de banca con mancuernas',
            'Dumbbell Flyes' => 'Aperturas con mancuernas',
            'Dumbbell Shoulder Press' => 'Press de hombros con mancuernas',
            'Dumbbell Lunges' => 'Zancadas con mancuernas',
            'Dumbbell Squat' => 'Sentadilla con mancuernas',
            'Dumbbell Shrug' => 'Encogimientos de hombros con mancuernas',
            'Incline Dumbbell Press' => 'Press inclinado con mancuernas',
            'Decline Barbell Bench Press' => 'Press declinado con barra',
            'Decline Dumbbell Bench Press' => 'Press declinado con mancuernas',
            'Cable Crossover' => 'Cruce de poleas',
            'Cable Crunch' => 'Encogimiento abdominal en polea',
            'Cable Pulldown' => 'Jalón al pecho en polea',
            'Lat Pulldown' => 'Jalón al pecho (Polea alta)',
            'Close-Grip Front Lat Pulldown' => 'Jalón al pecho agarre estrecho',
            'Wide-Grip Lat Pulldown' => 'Jalón al pecho agarre ancho',
            'Push-Up' => 'Flexiones de pecho',
            'Push-Ups' => 'Flexiones de pecho',
            'Close-Grip Push-Up' => 'Flexiones de pecho agarre estrecho',
            'Decline Push-Up' => 'Flexiones declinadas',
            'Incline Push-Up' => 'Flexiones inclinadas',
            'Pull-Up' => 'Dominadas en barra',
            'Pull-Ups' => 'Dominadas en barra',
            'Chin-Up' => 'Dominadas supinas',
            'Chin-Ups' => 'Dominadas supinas',
            'Dips - Chest Version' => 'Fondos en paralelas - Pecho',
            'Dips - Triceps Version' => 'Fondos en paralelas - Tríceps',
            'Bench Dips' => 'Fondos entre bancos',
            'Standing Calf Raises' => 'Elevación de talones de pie',
            'Seated Calf Raise' => 'Elevación de talones sentado',
            'Leg Press' => 'Prensa de piernas',
            'Leg Extensions' => 'Extensiones de piernas en máquina',
            'Lying Leg Curls' => 'Curl de piernas acostado',
            'Seated Leg Curl' => 'Curl de piernas sentado',
            'Arnold Dumbbell Press' => 'Press Arnold con mancuernas',
            'EZ-Bar Curl' => 'Curl de bíceps con barra Z',
            'EZ-Bar Skullcrusher' => 'Press francés con barra Z',
            'Preacher Curl' => 'Curl predicador',
            'Concentration Curls' => 'Curl concentrado con mancuerna',
            'Hammer Curls' => 'Curl martillo con mancuernas',
            'Face Pull' => 'Face pull en polea',
            'Hyperextensions Back Extensions' => 'Extensiones lumbares',
            'Russian Twists' => 'Giros rusos abdominales',
            'Mountain Climbers' => 'Escaladores (Mountain Climbers)',
            'Plank' => 'Plancha abdominal',
            'Side Plank' => 'Plancha lateral',
            'Barbell Ab Rollout' => 'Rueda abdominal con barra',
            'Ab Roller' => 'Rueda abdominal',
            'Crunches' => 'Encogimientos abdominales (Crunches)',
            'Air Bike' => 'Bicicleta abdominal',
            'Hanging Leg Raise' => 'Elevación de piernas colgado',
            'Farmers Walk' => 'Paseo del granjero',
            'Clean and Jerk' => 'Cargada y envión (Clean and Jerk)',
            'Snatch' => 'Arrancada (Snatch)',
        ];

        if (isset($diccionario[$name])) {
            return $diccionario[$name];
        }

        // Reemplazo de palabras individuales si no hay coincidencia exacta
        $reemplazos = [
            'Barbell' => 'con barra',
            'Dumbbell' => 'con mancuerna',
            'Kettlebell' => 'con pesa rusa',
            'Cable' => 'en polea',
            'Bands' => 'con bandas',
            'Band' => 'con banda',
            'Machine' => 'en máquina',
            'Bench Press' => 'Press de banca',
            'Shoulder Press' => 'Press de hombros',
            'Chest Press' => 'Press de pecho',
            'Floor Press' => 'Press en suelo',
            'Incline' => 'inclinado',
            'Decline' => 'declinado',
            'Seated' => 'sentado',
            'Standing' => 'de pie',
            'Lying' => 'acostado',
            'Kneeling' => 'de rodillas',
            'Squat' => 'Sentadilla',
            'Squats' => 'Sentadillas',
            'Deadlift' => 'Peso muerto',
            'Deadlifts' => 'Peso muerto',
            'Lunge' => 'Zancada',
            'Lunges' => 'Zancadas',
            'Step-Ups' => 'Subidas al banco',
            'Leg Press' => 'Prensa de piernas',
            'Leg Extensions' => 'Extensiones de piernas',
            'Leg Curl' => 'Curl de piernas',
            'Leg Curls' => 'Curl de piernas',
            'Calf Raise' => 'Elevación de talones',
            'Calf Raises' => 'Elevación de talones',
            'Glute Bridge' => 'Puente de glúteos',
            'Hip Thrust' => 'Empuje de cadera (Hip Thrust)',
            'Bicep Curl' => 'Curl de bíceps',
            'Biceps Curl' => 'Curl de bíceps',
            'Triceps Extension' => 'Extensión de tríceps',
            'Tricep Extension' => 'Extensión de tríceps',
            'Lat Pulldown' => 'Jalón al pecho',
            'Pull-Up' => 'Dominada',
            'Pull-Ups' => 'Dominadas',
            'Push-Up' => 'Flexión de pecho',
            'Push-Ups' => 'Flexiones de pecho',
            'Crunch' => 'Encogimiento abdominal',
            'Crunches' => 'Encogimientos abdominales',
            'Sit-Up' => 'Abdominal',
            'Sit-Ups' => 'Abdominales',
            'Shrug' => 'Encogimiento de hombros',
            'Shrugs' => 'Encogimientos de hombros',
            'Lateral Raise' => 'Elevación lateral',
            'Front Raise' => 'Elevación frontal',
            'Flyes' => 'Aperturas',
            'Flye' => 'Apertura',
            'Close-Grip' => 'agarre estrecho',
            'Wide-Grip' => 'agarre ancho',
            'Reverse-Grip' => 'agarre inverso',
            'Neutral Grip' => 'agarre neutro',
            'One-Arm' => 'a una mano',
            'Single-Arm' => 'a una mano',
            'Single-Leg' => 'a una pierna',
            'Alternating' => 'alternado',
            'Alternate' => 'alternado',
            '3/4' => '3/4',
        ];

        $traducido = strtr($name, $reemplazos);

        return trim(preg_replace('/\s+/', ' ', $traducido));
    }

    /**
     * Traduce frases de instrucciones comunes al español.
     */
    private function traducirPaso(string $paso): string
    {
        $frases = [
            'Lie down on the floor and secure your feet. Your legs should be bent at the knees.' => 'Acuéstate en el suelo y asegura los pies. Tus piernas deben estar dobladas a la altura de las rodillas.',
            'Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position.' => 'Coloca las manos detrás o al lado de la cabeza. Comenzarás con la espalda apoyada en el suelo. Esta será tu posición inicial.',
            'Flex your hips and spine to raise your torso toward your knees.' => 'Flexiona la cadera y la columna para elevar el torso hacia las rodillas.',
            'At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only ¾ of the way down.' => 'En la parte superior de la contracción, el torso debe quedar perpendicular al suelo. Invierte el movimiento bajando solo hasta 3/4 del recorrido.',
            'Repeat for the recommended amount of repetitions.' => 'Repite el movimiento durante la cantidad de repeticiones recomendada.',
            'Stand up straight with a dumbbell in each hand.' => 'Ponte de pie con una mancuerna en cada mano.',
            'Keep your elbows close to your torso at all times.' => 'Mantén los codos cerca del torso en todo momento.',
        ];

        if (isset($frases[$paso])) {
            return $frases[$paso];
        }

        // Reemplazos de palabras genéricas de instrucción
        $reemplazosInst = [
            'Lie down' => 'Acuéstate',
            'Stand up' => 'Ponte de pie',
            'Sit down' => 'Siéntate',
            'Starting position' => 'posición inicial',
            'Repeat' => 'Repite',
            'slowly' => 'lentamente',
            'recommended amount of repetitions' => 'cantidad de repeticiones recomendada',
            'torso' => 'torso',
            'shoulders' => 'hombros',
            'elbows' => 'codos',
            'knees' => 'rodillas',
            'barbell' => 'barra',
            'dumbbell' => 'mancuerna',
            'dumbbells' => 'mancuernas',
        ];

        return strtr($paso, $reemplazosInst);
    }
}
