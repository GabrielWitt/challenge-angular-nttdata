# 🏦 Prueba Técnica – Frontend Angular 2025

Este proyecto resuelve el ejercicio técnico solicitado para el rol de **Frontend Developer** utilizando **Angular**. Cumple con los requisitos funcionales, buenas prácticas de desarrollo, diseño responsive y pruebas unitarias con **Jest**.

---

## ✅ Funcionalidades Implementadas

| Código | Funcionalidad                                                      | Estado     |
|--------|---------------------------------------------------------------------|------------|
| F1     | Listado de productos financieros                                   | ✅ Completo |
| F2     | Búsqueda de productos por nombre o descripción                     | ✅ Completo |
| F3     | Selección de cantidad de registros a mostrar                       | ✅ Completo |
| F4     | Agregar nuevo producto con validaciones y formulario limpio        | ✅ Completo |
| F5     | Edición de producto con ID deshabilitado y validaciones activas    | ✅ Completo |
| F6     | Eliminación de producto con modal de confirmación y alerta exitosa | ✅ Completo |
| Extra  | Skeleton loader y botones de carga                                 | ✅ Completo |
| Extra  | Diseño 100% responsive sin frameworks externos                     | ✅ Completo |

---

## 🧪 Cobertura de Pruebas

- **Framework usado:** Jest  
- **Cobertura mínima alcanzada:** ≥ 70%

Pruebas implementadas:
- Inicialización de componentes
- Validaciones (sincrónicas y asincrónicas)
- Eventos del formulario
- Acciones de creación, edición y eliminación

---

## 📦 Estructura del Proyecto

- `ProductListComponent`: listado con búsqueda, paginación y loader
- `ProductFormComponent`: formulario de alta/edición con validaciones
- `DropdownMenuComponent`: menú contextual para editar o eliminar
- `ModalConfirmationComponent`: modal con animación y feedback visual
- `AlertModalComponent`: mensajes de éxito tras acciones
- `SkeletonLoaderComponent`: tabla simulada durante carga de contenido

---

## 🛡️ Validaciones

| Campo          | Reglas                                                                  |
|----------------|-------------------------------------------------------------------------|
| `id`           | Requerido, 3–10 caracteres, validación asincrónica                      |
| `name`         | Requerido, 5–100 caracteres                                              |
| `description`  | Requerido, 10–200 caracteres                                             |
| `logo`         | Requerido (URL válida)                                                  |
| `date_release` | Requerido, debe ser igual o posterior a la fecha actual                |
| `date_revision`| Calculado automáticamente (+1 año), requerido                           |

---

## ⚙️ Tecnologías Usadas

- Angular 16+
- TypeScript
- RxJS
- Jest
- SCSS (sin frameworks de UI)
- Git

---

## ▶️ Cómo Ejecutar el Proyecto

```bash
cd challenge-angular-nttdata
npm install
ng serve
```

## 🧪 Cómo Ejecutar las Pruebas con Jest

```bash
cd challenge-angular-nttdata
npm install
npm run test
```

---

**Autor:** Gabriel Witt
