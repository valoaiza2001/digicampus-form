import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CaracterizacionForm = () => {
    const [diasSeleccionados, setDiasSeleccionados] = useState([]);

    const toggleDia = (dia, checked) => {
        setDiasSeleccionados((prev) => (checked ? [...prev, dia] : prev.filter((d) => d !== dia)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        });

        // Combinar múltiples checkboxes
        ["videoconferencia", "tipo_conectividad"].forEach((campo) => {
            if (Array.isArray(data[campo])) {
                data[campo] = data[campo].join(", ");
            }
        });

        data.uuid = uuidv4();
        data.coordenadas = `${data.latitud || ""}, ${data.longitud || ""}`;

        // ➕ Calcular cumplimiento
        const camposCumplimiento = [
            "iluminacion",
            "ruido",
            "acustico",
            "aire_acondicionado",
            "tomas",
            "piso",
            "paredes",
            "techo",
            "puerta",
            "ventanas",
            "cortinas",
            "seguridad",
            "mesas_estado",
            "sillas_estado",
            "computadores_estado",
            "pantalla_estado",
            "teclado_estado",
            "raton_estado",
            "auriculares_estado",
            "microfono_estado",
            "camara_estado",
            "disponibilidad_lunes",
            "capacidad_conectividad",
            "conexion_internet",
        ];

        let totalCampos = 0;
        let camposCumplen = 0;

        camposCumplimiento.forEach((campo) => {
            if (data[campo] !== undefined) {
                totalCampos++;
                const valor = data[campo].toString().toLowerCase();
                if (valor === "bueno" || valor === "sí" || valor === "si") {
                    camposCumplen++;
                }
            }
        });

        data.cumplimiento_general = ((camposCumplen / totalCampos) * 100).toFixed(2);

        try {
            const response = await fetch("https://hook.us2.make.com/xpst0mfm0wyquaek1r8ath3fuy29e2ht", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log("Datos enviados:", data);
                alert("Formulario enviado correctamente ✅");
                form.reset();
            } else {
                console.error("Error en el envío:", response.statusText);
                alert("Error al enviar el formulario ❌");
            }
        } catch (error) {
            console.error("Error en la conexión:", error);
            alert("Hubo un problema de conexión con Make.");
        }
    };

    return (
        <form id="caracterizacionForm" onSubmit={handleSubmit}>
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-8">
                    Caracterización de los Sitios - Proyecto DigiCampus
                </h1>

                {/* Información del Evaluador */}
                <section>
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Información del Evaluador</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-medium mb-1" htmlFor="cedula">
                                N° Cédula
                            </label>
                            <input
                                type="text"
                                id="cedula"
                                name="cedula"
                                placeholder="Ej. 1234567890"
                                className="w-full px-4 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1" htmlFor="nombre_completo">
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                id="nombre_completo"
                                name="nombre_completo"
                                placeholder="Ej. Juan Pérez"
                                className="w-full px-4 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1" htmlFor="telefono">
                                Número telefónico
                            </label>
                            <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                placeholder="Ej. 3001234567"
                                className="w-full px-4 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1" htmlFor="correo">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                placeholder="Ej. juan@correo.com"
                                className="w-full px-4 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Información del Sitio */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Información del Sitio</h2>

                    {/* Datos generales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-medium mb-1" htmlFor="ciudad">
                                Ciudad
                            </label>
                            <input
                                type="text"
                                id="ciudad"
                                name="ciudad"
                                className="w-full px-4 py-2 border border-blue-500 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1" htmlFor="institucion">
                                Institución
                            </label>
                            <input
                                type="text"
                                id="institucion"
                                name="institucion"
                                className="w-full px-4 py-2 border border-blue-500 rounded"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block font-medium mb-1" htmlFor="direccion">
                                Dirección
                            </label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                className="w-full px-4 py-2 border border-blue-500 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1" htmlFor="latitud">
                                Latitud
                            </label>
                            <input
                                type="text"
                                id="latitud"
                                name="latitud"
                                className="w-full px-4 py-2 border border-blue-500 rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1" htmlFor="longitud">
                                Longitud
                            </label>
                            <input
                                type="text"
                                id="longitud"
                                name="longitud"
                                className="w-full px-4 py-2 border border-blue-500 rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1" htmlFor="altitud">
                                Altitud
                            </label>
                            <input
                                type="text"
                                id="altitud"
                                name="altitud"
                                className="w-full px-4 py-2 border border-blue-500 rounded"
                            />
                        </div>
                    </div>

                    {/* Condición del sitio */}
                    <div className="mt-6">
                        <label className="block font-medium mb-2">Condición</label>
                        <div className="flex gap-4">
                            <label>
                                <input type="radio" name="condicion_sitio" value="Bueno" className="mr-1" /> Bueno
                            </label>
                            <label>
                                <input type="radio" name="condicion_sitio" value="Regular" className="mr-1" /> Regular
                            </label>
                            <label>
                                <input type="radio" name="condicion_sitio" value="Malo" className="mr-1" /> Malo
                            </label>
                        </div>
                        <textarea
                            name="caracteristicas_sitio"
                            placeholder="Características"
                            className="w-full mt-2 px-4 py-2 border border-blue-500 rounded min-h-[80px]"
                        ></textarea>
                    </div>
                </section>

                {/* Disponibilidad por día */}
                <div className="mt-6">
                    <label className="block font-medium mb-2">Disponibilidad por día</label>
                    <div className="space-y-4">
                        {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                            <div key={dia} className="space-y-2">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name={`disponibilidad_${dia.toLowerCase()}`}
                                        onChange={(e) => toggleDia(dia, e.target.checked)}
                                        className="mr-2"
                                    />
                                    <span className="font-medium">{dia}</span>
                                </label>
                                {diasSeleccionados.includes(dia) && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4">
                                        <input
                                            type="time"
                                            name={`hora_apertura_${dia.toLowerCase()}`}
                                            className="px-4 py-2 border border-blue-500 rounded"
                                            required
                                        />
                                        <input
                                            type="time"
                                            name={`hora_cierre_${dia.toLowerCase()}`}
                                            className="px-4 py-2 border border-blue-500 rounded"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name={`observacion_${dia.toLowerCase()}`}
                                            placeholder="Observación (opcional)"
                                            className="px-4 py-2 border border-blue-500 rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Responsable del Sitio */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">Responsable del Sitio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-medium mb-1" htmlFor="responsable_nombre">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="responsable_nombre"
                                name="responsable_nombre"
                                className="w-full px-4 py-2 border border-blue-500 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1" htmlFor="responsable_telefono">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                id="responsable_telefono"
                                name="responsable_telefono"
                                className="w-full px-4 py-2 border border-blue-500 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1" htmlFor="responsable_correo">
                                Correo
                            </label>
                            <input
                                type="email"
                                id="responsable_correo"
                                name="responsable_correo"
                                className="w-full px-4 py-2 border border-blue-500 rounded"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Condiciones Locativas */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Condiciones Locativas</h2>

                    <div className="space-y-6">
                        {[
                            { name: "iluminacion", label: "Iluminación" },
                            { name: "ruido", label: "Ruido", options: ["Alto", "Medio", "Bajo"] },
                            { name: "acustico", label: "Tratamiento acústico", options: ["Sí", "No"] },
                            { name: "aire_acondicionado", label: "Aire acondicionado", options: ["Sí", "No"] },
                            { name: "tomas", label: "Tomas eléctricas" },
                            { name: "piso", label: "Piso" },
                            { name: "paredes", label: "Paredes" },
                            { name: "techo", label: "Techo" },
                            { name: "puerta", label: "Puerta" },
                            { name: "ventanas", label: "Ventanas" },
                            { name: "cortinas", label: "Cortinas" },
                            { name: "seguridad", label: "Seguridad" },
                        ].map(({ name, label, options }) => (
                            <div key={name}>
                                <label className="block font-medium mb-1">{label}</label>
                                <div className="flex flex-wrap gap-4 mb-2">
                                    {(options || ["Bueno", "Regular", "Malo"]).map((opt) => (
                                        <label key={opt}>
                                            <input type="radio" name={name} value={opt} className="mr-1" />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                                <textarea
                                    name={`${name}_caract`}
                                    placeholder="Características"
                                    className="w-full mt-2 px-4 py-2 border border-blue-500 rounded min-h-[80px]"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mobiliario */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Mobiliario</h2>

                    {/* Mesas */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Mesas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block font-medium mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    name="mesas_cantidad"
                                    className="w-full px-4 py-2 border border-blue-500 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Estado</label>
                                <div className="flex gap-4">
                                    <label>
                                        <input type="radio" name="mesas_estado" value="Bueno" className="mr-1" />
                                        Bueno
                                    </label>
                                    <label>
                                        <input type="radio" name="mesas_estado" value="Regular" className="mr-1" />
                                        Regular
                                    </label>
                                    <label>
                                        <input type="radio" name="mesas_estado" value="Malo" className="mr-1" />
                                        Malo
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block font-medium mb-1">Características</label>
                            <textarea
                                name="mesas_caracteristicas"
                                placeholder="Describe las características de las mesas"
                                className="w-full px-4 py-2 border border-blue-500 rounded min-h-[80px]"
                            ></textarea>
                        </div>
                    </div>

                    {/* Sillas */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Sillas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block font-medium mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    name="sillas_cantidad"
                                    className="w-full px-4 py-2 border border-blue-500 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Estado</label>
                                <div className="flex gap-4">
                                    <label>
                                        <input type="radio" name="sillas_estado" value="Bueno" className="mr-1" />
                                        Bueno
                                    </label>
                                    <label>
                                        <input type="radio" name="sillas_estado" value="Regular" className="mr-1" />
                                        Regular
                                    </label>
                                    <label>
                                        <input type="radio" name="sillas_estado" value="Malo" className="mr-1" />
                                        Malo
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block font-medium mb-1">Características</label>
                            <textarea
                                name="sillas_caracteristicas"
                                placeholder="Describe las características de las sillas"
                                className="w-full px-4 py-2 border border-blue-500 rounded min-h-[80px]"
                            ></textarea>
                        </div>
                    </div>

                    {/* Acomodación */}
                    <div>
                        <label className="block font-medium mb-1">Acomodación</label>
                        <textarea
                            name="acomodacion"
                            placeholder="Describe la disposición del mobiliario en el espacio"
                            className="w-full px-4 py-2 border border-blue-500 rounded min-h-[80px]"
                        ></textarea>
                    </div>
                </section>

                {/* Hardware */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Hardware</h2>

                    {/* Computadores */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Computadores</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block font-medium mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    name="computadores_cantidad"
                                    className="w-full px-4 py-2 border border-blue-500 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Estado</label>
                                <div className="flex flex-wrap gap-4">
                                    <label>
                                        <input type="radio" name="computadores_estado" value="Bueno" className="mr-1" />
                                        Bueno
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="computadores_estado"
                                            value="Regular"
                                            className="mr-1"
                                        />
                                        Regular
                                    </label>
                                    <label>
                                        <input type="radio" name="computadores_estado" value="Malo" className="mr-1" />
                                        Malo
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <input
                                type="text"
                                name="computadores_procesador"
                                placeholder="Procesador"
                                className="px-4 py-2 border border-blue-500 rounded w-full"
                            />
                            <input
                                type="text"
                                name="computadores_ram"
                                placeholder="Memoria RAM"
                                className="px-4 py-2 border border-blue-500 rounded w-full"
                            />
                            <input
                                type="number"
                                name="computadores_almacenamiento"
                                placeholder="Almacenamiento (GB)"
                                className="px-4 py-2 border border-blue-500 rounded w-full"
                            />
                            <input
                                type="number"
                                name="computadores_disponible"
                                placeholder="Disponibilidad almacenamiento (GB)"
                                className="px-4 py-2 border border-blue-500 rounded w-full"
                            />
                        </div>
                    </div>

                    {/* Conexión a Internet */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Conexión a Internet</h3>
                        <div className="flex flex-wrap gap-4 mb-2">
                            <label>
                                <input type="checkbox" name="conexion_internet" value="Cableado" className="mr-1" />
                                Cableado
                            </label>
                            <label>
                                <input type="checkbox" name="conexion_internet" value="Inalámbrico" className="mr-1" />
                                Inalámbrico
                            </label>
                        </div>
                        <textarea
                            name="conexion_caract"
                            placeholder="Características"
                            className="w-full px-4 py-2 border border-blue-500 rounded min-h-[80px]"
                        ></textarea>
                    </div>
                </section>

                {/* Periféricos */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Periféricos</h2>

                    {[
                        { nombre: "pantalla", label: "Pantalla" },
                        { nombre: "teclado", label: "Teclado" },
                        { nombre: "raton", label: "Ratón" },
                        { nombre: "auriculares", label: "Auriculares" },
                        { nombre: "microfono", label: "Micrófono" },
                        { nombre: "camara", label: "Cámara" },
                    ].map(({ nombre, label }) => (
                        <div key={nombre} className="mb-6">
                            <label className="block font-medium mb-1">{label}</label>

                            <div className="flex flex-wrap gap-4 mb-2">
                                <label>
                                    <input type="radio" name={`${nombre}_disp`} value="Sí" className="mr-1" />
                                    Sí
                                </label>
                                <label>
                                    <input type="radio" name={`${nombre}_disp`} value="No" className="mr-1" />
                                    No
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-2">
                                <label>
                                    <input type="radio" name={`${nombre}_estado`} value="Bueno" className="mr-1" />
                                    Bueno
                                </label>
                                <label>
                                    <input type="radio" name={`${nombre}_estado`} value="Regular" className="mr-1" />
                                    Regular
                                </label>
                                <label>
                                    <input type="radio" name={`${nombre}_estado`} value="Malo" className="mr-1" />
                                    Malo
                                </label>
                            </div>

                            <textarea
                                name={`${nombre}_caract`}
                                placeholder="Características"
                                className="w-full px-4 py-2 border border-blue-500 rounded min-h-[80px]"
                            ></textarea>
                        </div>
                    ))}
                </section>

                {/* Software */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Software</h2>

                    {/* Sistema Operativo */}
                    <div className="mb-6">
                        <label className="block font-medium mb-1">Sistema Operativo</label>
                        <div className="flex flex-wrap gap-4 mb-2">
                            <label>
                                <input type="radio" name="sistema_operativo" value="Windows" className="mr-1" />
                                Windows
                            </label>
                            <label>
                                <input type="radio" name="sistema_operativo" value="MacOS" className="mr-1" />
                                MacOS
                            </label>
                            <label>
                                <input type="radio" name="sistema_operativo" value="GNU/Linux" className="mr-1" />
                                GNU/Linux
                            </label>
                        </div>
                        <input
                            type="text"
                            name="sistema_operativo_version"
                            placeholder="Versión del sistema operativo"
                            className="w-full px-4 py-2 border border-blue-500 rounded"
                        />
                    </div>

                    {/* Suite de Ofimática */}
                    <div className="mb-6">
                        <label className="block font-medium mb-1">Suite de Ofimática</label>
                        <input
                            type="text"
                            name="suite_ofimatica"
                            placeholder="Ej. Microsoft Office, LibreOffice"
                            className="w-full px-4 py-2 border border-blue-500 rounded"
                        />
                    </div>

                    {/* Navegador Web */}
                    <div className="mb-6">
                        <label className="block font-medium mb-1">Navegador Web</label>
                        <input
                            type="text"
                            name="navegador_web"
                            placeholder="Ej. Chrome, Firefox, Edge"
                            className="w-full px-4 py-2 border border-blue-500 rounded"
                        />
                    </div>

                    {/* Software de Videoconferencia */}
                    <div className="mb-6">
                        <label className="block font-medium mb-1">Software de videoconferencia</label>
                        <div className="flex flex-wrap gap-4 mb-2">
                            <label>
                                <input type="checkbox" name="videoconferencia" value="Webex" className="mr-1" />
                                Webex
                            </label>
                            <label>
                                <input type="checkbox" name="videoconferencia" value="Meet" className="mr-1" />
                                Meet
                            </label>
                            <label>
                                <input type="checkbox" name="videoconferencia" value="Zoom" className="mr-1" />
                                Zoom
                            </label>
                            <label>
                                <input type="checkbox" name="videoconferencia" value="Teams" className="mr-1" />
                                Teams
                            </label>
                        </div>
                        <textarea
                            name="videoconferencia_caract"
                            placeholder="Características"
                            className="w-full px-4 py-2 border border-blue-500 rounded min-h-[80px]"
                        ></textarea>
                    </div>
                </section>

                {/* Conectividad */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Conectividad</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block font-medium mb-1">Ancho de banda de carga (Mbps)</label>
                            <input
                                type="number"
                                step="any"
                                name="ancho_carga"
                                placeholder="Ej. 10.5"
                                className="w-full px-4 py-2 border border-blue-500 rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Ancho de banda de descarga (Mbps)</label>
                            <input
                                type="number"
                                step="any"
                                name="ancho_descarga"
                                placeholder="Ej. 30.2"
                                className="w-full px-4 py-2 border border-blue-500 rounded"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block font-medium mb-1">Capacidad de conectividad</label>
                        <div className="flex flex-wrap gap-4">
                            <label>
                                <input type="radio" name="capacidad_conectividad" value="Bueno" className="mr-1" />
                                Bueno
                            </label>
                            <label>
                                <input type="radio" name="capacidad_conectividad" value="Regular" className="mr-1" />
                                Regular
                            </label>
                            <label>
                                <input type="radio" name="capacidad_conectividad" value="Malo" className="mr-1" />
                                Malo
                            </label>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block font-medium mb-1">Tipo de conectividad</label>
                        <div className="flex flex-wrap gap-4">
                            <label>
                                <input type="checkbox" name="tipo_conectividad" value="Red cableada" className="mr-1" />
                                Red cableada
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="tipo_conectividad"
                                    value="Red inalámbrica"
                                    className="mr-1"
                                />
                                Red inalámbrica
                            </label>
                        </div>
                    </div>
                </section>

                <div className="mt-10 text-center">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
                    >
                        Enviar formulario
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CaracterizacionForm;
