# 🏦 Prueba Técnica - Frontend Angular 2024

Este proyecto resuelve el ejercicio técnico solicitado para el rol de Frontend Developer usando Angular, cumpliendo con los requisitos funcionales, buenas prácticas, diseño responsive y pruebas unitarias con Jest.

---

## ✅ Funcionalidades implementadas

| Código | Funcionalidad                                                       | Estado     |
|--------|----------------------------------------------------------------------|------------|
| F1     | Listado de productos financieros                                    | ✅ Completo |
| F2     | Búsqueda de productos por nombre o descripción                      | ✅ Completo |
| F3     | Selección de cantidad de registros a mostrar                        | ✅ Completo |
| F4     | Agregar nuevo producto con validaciones y formulario limpio         | ✅ Completo |
| F5     | Edición de producto con ID deshabilitado y validaciones activas     | ✅ Completo |
| F6     | Eliminación de producto con modal de confirmación y alerta exitosa  | ✅ Completo |
| Extra  | Skeleton Loader y loading buttons                                   | ✅ Completo |
| Extra  | Diseño totalmente responsive sin frameworks externos                | ✅ Completo |

---

## 🧪 Cobertura de Pruebas

- **Framework usado:** Jest
- **Cobertura mínima:** ≥ 70%
- Pruebas incluidas:
  - Inicialización de componentes
  - Validaciones (sync y async)
  - Eventos de formulario
  - Acciones de crear, editar y eliminar

---

## 📦 Estructura del Proyecto

- **ProductListComponent:** listado con búsqueda, paginación y loader
- **ProductFormComponent:** formulario de alta y edición con validaciones
- **DropdownMenuComponent:** menú contextual para editar o eliminar
- **ModalConfirmation:** modal con animación y UX de carga
- **AlertModal:** mensajes de éxito tras acciones
- **SkeletonLoader:** tabla simulada mientras carga el contenido

---

## ✅ Validaciones

| Campo         | Reglas                                                                 |
|---------------|------------------------------------------------------------------------|
| id            | Requerido, 3-10 caracteres, validación asíncrona                       |
| name          | Requerido, 5-100 caracteres                                            |
| description   | Requerido, 10-200 caracteres                                           |
| logo          | Requerido                                                              |
| date_release  | Requerido, igual o posterior a hoy                                     |
| date_revision | Calculado automáticamente (+1 año), requerido                         |

---

## ⚙️ Tecnologías usadas

- Angular 16+
- TypeScript
- RxJS
- Jest
- SCSS puro (sin frameworks de UI)
- Git

---

## ▶️ Cómo ejecutar el proyecto

```bash
cd challenge-angular-nttda
npm install
ng serve

## ▶️ Cómo ejecutar el pruebas con Jest
cd challenge-angular-nttda
npm install
npm run test

Autor: Gabriel Witt