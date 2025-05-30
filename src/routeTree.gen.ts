/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as ProfessorsIndexImport } from './routes/professors/index'
import { Route as DepartmentsIndexImport } from './routes/departments/index'
import { Route as CoursesIndexImport } from './routes/courses/index'
import { Route as AllocationsIndexImport } from './routes/allocations/index'
import { Route as ProfessorsNewImport } from './routes/professors/new'
import { Route as DepartmentsNewImport } from './routes/departments/new'
import { Route as CoursesNewImport } from './routes/courses/new'
import { Route as AllocationsNewImport } from './routes/allocations/new'
import { Route as ProfessorsEditIdImport } from './routes/professors/edit/$id'
import { Route as DepartmentsEditIdImport } from './routes/departments/edit/$id'
import { Route as CoursesEditIdImport } from './routes/courses/edit/$id'
import { Route as AllocationsEditIdImport } from './routes/allocations/edit/$id'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ProfessorsIndexRoute = ProfessorsIndexImport.update({
  id: '/professors/',
  path: '/professors/',
  getParentRoute: () => rootRoute,
} as any)

const DepartmentsIndexRoute = DepartmentsIndexImport.update({
  id: '/departments/',
  path: '/departments/',
  getParentRoute: () => rootRoute,
} as any)

const CoursesIndexRoute = CoursesIndexImport.update({
  id: '/courses/',
  path: '/courses/',
  getParentRoute: () => rootRoute,
} as any)

const AllocationsIndexRoute = AllocationsIndexImport.update({
  id: '/allocations/',
  path: '/allocations/',
  getParentRoute: () => rootRoute,
} as any)

const ProfessorsNewRoute = ProfessorsNewImport.update({
  id: '/professors/new',
  path: '/professors/new',
  getParentRoute: () => rootRoute,
} as any)

const DepartmentsNewRoute = DepartmentsNewImport.update({
  id: '/departments/new',
  path: '/departments/new',
  getParentRoute: () => rootRoute,
} as any)

const CoursesNewRoute = CoursesNewImport.update({
  id: '/courses/new',
  path: '/courses/new',
  getParentRoute: () => rootRoute,
} as any)

const AllocationsNewRoute = AllocationsNewImport.update({
  id: '/allocations/new',
  path: '/allocations/new',
  getParentRoute: () => rootRoute,
} as any)

const ProfessorsEditIdRoute = ProfessorsEditIdImport.update({
  id: '/professors/edit/$id',
  path: '/professors/edit/$id',
  getParentRoute: () => rootRoute,
} as any)

const DepartmentsEditIdRoute = DepartmentsEditIdImport.update({
  id: '/departments/edit/$id',
  path: '/departments/edit/$id',
  getParentRoute: () => rootRoute,
} as any)

const CoursesEditIdRoute = CoursesEditIdImport.update({
  id: '/courses/edit/$id',
  path: '/courses/edit/$id',
  getParentRoute: () => rootRoute,
} as any)

const AllocationsEditIdRoute = AllocationsEditIdImport.update({
  id: '/allocations/edit/$id',
  path: '/allocations/edit/$id',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/allocations/new': {
      id: '/allocations/new'
      path: '/allocations/new'
      fullPath: '/allocations/new'
      preLoaderRoute: typeof AllocationsNewImport
      parentRoute: typeof rootRoute
    }
    '/courses/new': {
      id: '/courses/new'
      path: '/courses/new'
      fullPath: '/courses/new'
      preLoaderRoute: typeof CoursesNewImport
      parentRoute: typeof rootRoute
    }
    '/departments/new': {
      id: '/departments/new'
      path: '/departments/new'
      fullPath: '/departments/new'
      preLoaderRoute: typeof DepartmentsNewImport
      parentRoute: typeof rootRoute
    }
    '/professors/new': {
      id: '/professors/new'
      path: '/professors/new'
      fullPath: '/professors/new'
      preLoaderRoute: typeof ProfessorsNewImport
      parentRoute: typeof rootRoute
    }
    '/allocations/': {
      id: '/allocations/'
      path: '/allocations'
      fullPath: '/allocations'
      preLoaderRoute: typeof AllocationsIndexImport
      parentRoute: typeof rootRoute
    }
    '/courses/': {
      id: '/courses/'
      path: '/courses'
      fullPath: '/courses'
      preLoaderRoute: typeof CoursesIndexImport
      parentRoute: typeof rootRoute
    }
    '/departments/': {
      id: '/departments/'
      path: '/departments'
      fullPath: '/departments'
      preLoaderRoute: typeof DepartmentsIndexImport
      parentRoute: typeof rootRoute
    }
    '/professors/': {
      id: '/professors/'
      path: '/professors'
      fullPath: '/professors'
      preLoaderRoute: typeof ProfessorsIndexImport
      parentRoute: typeof rootRoute
    }
    '/allocations/edit/$id': {
      id: '/allocations/edit/$id'
      path: '/allocations/edit/$id'
      fullPath: '/allocations/edit/$id'
      preLoaderRoute: typeof AllocationsEditIdImport
      parentRoute: typeof rootRoute
    }
    '/courses/edit/$id': {
      id: '/courses/edit/$id'
      path: '/courses/edit/$id'
      fullPath: '/courses/edit/$id'
      preLoaderRoute: typeof CoursesEditIdImport
      parentRoute: typeof rootRoute
    }
    '/departments/edit/$id': {
      id: '/departments/edit/$id'
      path: '/departments/edit/$id'
      fullPath: '/departments/edit/$id'
      preLoaderRoute: typeof DepartmentsEditIdImport
      parentRoute: typeof rootRoute
    }
    '/professors/edit/$id': {
      id: '/professors/edit/$id'
      path: '/professors/edit/$id'
      fullPath: '/professors/edit/$id'
      preLoaderRoute: typeof ProfessorsEditIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/allocations/new': typeof AllocationsNewRoute
  '/courses/new': typeof CoursesNewRoute
  '/departments/new': typeof DepartmentsNewRoute
  '/professors/new': typeof ProfessorsNewRoute
  '/allocations': typeof AllocationsIndexRoute
  '/courses': typeof CoursesIndexRoute
  '/departments': typeof DepartmentsIndexRoute
  '/professors': typeof ProfessorsIndexRoute
  '/allocations/edit/$id': typeof AllocationsEditIdRoute
  '/courses/edit/$id': typeof CoursesEditIdRoute
  '/departments/edit/$id': typeof DepartmentsEditIdRoute
  '/professors/edit/$id': typeof ProfessorsEditIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/allocations/new': typeof AllocationsNewRoute
  '/courses/new': typeof CoursesNewRoute
  '/departments/new': typeof DepartmentsNewRoute
  '/professors/new': typeof ProfessorsNewRoute
  '/allocations': typeof AllocationsIndexRoute
  '/courses': typeof CoursesIndexRoute
  '/departments': typeof DepartmentsIndexRoute
  '/professors': typeof ProfessorsIndexRoute
  '/allocations/edit/$id': typeof AllocationsEditIdRoute
  '/courses/edit/$id': typeof CoursesEditIdRoute
  '/departments/edit/$id': typeof DepartmentsEditIdRoute
  '/professors/edit/$id': typeof ProfessorsEditIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/allocations/new': typeof AllocationsNewRoute
  '/courses/new': typeof CoursesNewRoute
  '/departments/new': typeof DepartmentsNewRoute
  '/professors/new': typeof ProfessorsNewRoute
  '/allocations/': typeof AllocationsIndexRoute
  '/courses/': typeof CoursesIndexRoute
  '/departments/': typeof DepartmentsIndexRoute
  '/professors/': typeof ProfessorsIndexRoute
  '/allocations/edit/$id': typeof AllocationsEditIdRoute
  '/courses/edit/$id': typeof CoursesEditIdRoute
  '/departments/edit/$id': typeof DepartmentsEditIdRoute
  '/professors/edit/$id': typeof ProfessorsEditIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/allocations/new'
    | '/courses/new'
    | '/departments/new'
    | '/professors/new'
    | '/allocations'
    | '/courses'
    | '/departments'
    | '/professors'
    | '/allocations/edit/$id'
    | '/courses/edit/$id'
    | '/departments/edit/$id'
    | '/professors/edit/$id'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/allocations/new'
    | '/courses/new'
    | '/departments/new'
    | '/professors/new'
    | '/allocations'
    | '/courses'
    | '/departments'
    | '/professors'
    | '/allocations/edit/$id'
    | '/courses/edit/$id'
    | '/departments/edit/$id'
    | '/professors/edit/$id'
  id:
    | '__root__'
    | '/'
    | '/allocations/new'
    | '/courses/new'
    | '/departments/new'
    | '/professors/new'
    | '/allocations/'
    | '/courses/'
    | '/departments/'
    | '/professors/'
    | '/allocations/edit/$id'
    | '/courses/edit/$id'
    | '/departments/edit/$id'
    | '/professors/edit/$id'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AllocationsNewRoute: typeof AllocationsNewRoute
  CoursesNewRoute: typeof CoursesNewRoute
  DepartmentsNewRoute: typeof DepartmentsNewRoute
  ProfessorsNewRoute: typeof ProfessorsNewRoute
  AllocationsIndexRoute: typeof AllocationsIndexRoute
  CoursesIndexRoute: typeof CoursesIndexRoute
  DepartmentsIndexRoute: typeof DepartmentsIndexRoute
  ProfessorsIndexRoute: typeof ProfessorsIndexRoute
  AllocationsEditIdRoute: typeof AllocationsEditIdRoute
  CoursesEditIdRoute: typeof CoursesEditIdRoute
  DepartmentsEditIdRoute: typeof DepartmentsEditIdRoute
  ProfessorsEditIdRoute: typeof ProfessorsEditIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AllocationsNewRoute: AllocationsNewRoute,
  CoursesNewRoute: CoursesNewRoute,
  DepartmentsNewRoute: DepartmentsNewRoute,
  ProfessorsNewRoute: ProfessorsNewRoute,
  AllocationsIndexRoute: AllocationsIndexRoute,
  CoursesIndexRoute: CoursesIndexRoute,
  DepartmentsIndexRoute: DepartmentsIndexRoute,
  ProfessorsIndexRoute: ProfessorsIndexRoute,
  AllocationsEditIdRoute: AllocationsEditIdRoute,
  CoursesEditIdRoute: CoursesEditIdRoute,
  DepartmentsEditIdRoute: DepartmentsEditIdRoute,
  ProfessorsEditIdRoute: ProfessorsEditIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/allocations/new",
        "/courses/new",
        "/departments/new",
        "/professors/new",
        "/allocations/",
        "/courses/",
        "/departments/",
        "/professors/",
        "/allocations/edit/$id",
        "/courses/edit/$id",
        "/departments/edit/$id",
        "/professors/edit/$id"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/allocations/new": {
      "filePath": "allocations/new.tsx"
    },
    "/courses/new": {
      "filePath": "courses/new.tsx"
    },
    "/departments/new": {
      "filePath": "departments/new.tsx"
    },
    "/professors/new": {
      "filePath": "professors/new.tsx"
    },
    "/allocations/": {
      "filePath": "allocations/index.tsx"
    },
    "/courses/": {
      "filePath": "courses/index.tsx"
    },
    "/departments/": {
      "filePath": "departments/index.tsx"
    },
    "/professors/": {
      "filePath": "professors/index.tsx"
    },
    "/allocations/edit/$id": {
      "filePath": "allocations/edit/$id.tsx"
    },
    "/courses/edit/$id": {
      "filePath": "courses/edit/$id.tsx"
    },
    "/departments/edit/$id": {
      "filePath": "departments/edit/$id.tsx"
    },
    "/professors/edit/$id": {
      "filePath": "professors/edit/$id.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
