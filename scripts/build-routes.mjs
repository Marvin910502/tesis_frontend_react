import {dset} from 'dset'
import fs from 'fs'
import path from 'path'
import prettier from 'prettier'
import {fileURLToPath} from 'url'
import {lazy} from 'react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let routes = {}

// First, we define a walk function that iterates through a directory
/**
 * @param {string} dir
 * @returns {AsyncGenerator<string>}
 * example:
 * for await (const p of walk(path.join(__dirname, "../src/pages"))) {
 * console.log(p);
 * }
 *
 */
async function* walk(dir) {
	for await (const d of await fs.promises.opendir(dir)) {
		const entry = path.join(dir, d.name)
		const routePath = entry.replace(path.join(__dirname, '../src/pages'), '')
		const route = routePath
			.replace('index.tsx', '')
			.replace('.tsx', '')
			.split('/')
			.slice(1)
			.join('.children.')

		const element = ('src/pages' + routePath).replace(/\.[tj]s[x]*$/, '')

		let _path = d.name
			.replace(/\.[tj]s[x]*$/, '')
			.replace(/\[(.+)\]/, (_, args) => ':' + args)
		if (_path === 'page404') {
			_path = '*'
		} else if (_path === 'index') {
			_path = ''
		}

		if (d.name !== d.name.toLowerCase()) {
			yield null
		} else if (d.isDirectory()) {
			dset(routes, route, {
				path: _path,
				element,
				children: {},
				componentName: route.toUpperCase().replaceAll('.', '').replaceAll('[', '').replaceAll(']', '')
			})
			yield* walk(entry)
		} else if (d.isFile()) {
			dset(routes, route, {
				element,
				path: _path,
				componentName: route === '' ? 'Index' : route.toUpperCase().replaceAll('.', '').replaceAll('[', '').replaceAll(']', '')
			})
			yield entry
		}
	}
}

/**
 * @param {Array} routes
 * @param {string} routes[].path
 * @param {string} routes[].element
 * @param {Array} routes[].children
 * @returns {string}
 * example:
 * [
 * { path: "a", element: "a" },
 * { path: "b", element: "b" },
 * { path: "c", element: "c", children: [
 *  { path: "d", element: "d" },
 *  { path: "e", element: "e" },
 *  { path: "f", element: "f" },
 * ]},
 *
 */
function printRoutes(routes) {
	if (routes.length < 2) {
		const route = routes[0]
		if (!route) return ''
		if (route.path !== '_layout') {
			return `{
        path: "${route.path}",
        element: <${route.componentName} />,
      },\n`
		} else {
			return ''
		}
	}
	let str = ``
	for (const route of routes) {
		if (!route.children) {
			str += printRoutes([route])
		} else if (Object.keys(route.children).length !== 0) {
			const layout = Object.values(route.children).find(
				(child) => child.path === '_layout'
			)
			let element = layout
				? `<${layout.componentName} />`
				: '<Outlet />'
			str += `{
        path: "${route.path}",
        element: ${element},
        children: [
          ${printRoutes(Object.values(route.children).sort(routesComparator))}
        ]
      },\n`
		}
	}
	return str
}

function printComponents(routes) {
	let str = ``
	for (const route of routes) {
		if (!route.children && route.path !== '_layout') {
			str += `const ${route.componentName} = Loadable(lazy(() => import("${route.element}")))\n`
		} else if ( route.path !== '_layout' && Object.keys(route.children).length !== 0) {
			const layout = Object.values(route.children).find(
				(child) => child.path === '_layout'
			)
			if (layout) {
				str += `const ${layout.componentName} = Loadable(lazy(() => import("${layout.element}")))\n`
			}

			str += printComponents(Object.values(route.children).sort(routesComparator))
		}

	}
	return str
}

function routesComparator({path: a}, {path: b}) {
	if (a === '/' || b === '*') {
		return -1
	}
	if (a === '*' || b === '/') {
		return 1
	}
	return a < b
}

// Then, use it with a simple async for loop
async function main() {
	for await (const p of walk(path.join(__dirname, '../src/pages'))) {
	}

	const rootRoutes = Object.values(routes).sort(routesComparator)
	const routeDefs = printRoutes(rootRoutes)
	const componentsDefs = printComponents(rootRoutes)
	const file = `
  import { Suspense, lazy, ElementType, ReactNode } from 'react'
  import { Outlet,RouteObject } from 'react-router-dom'
  import LoadingScreen from 'src/components/LoadingScreen'
  type LoadProps = {
    children?: ReactNode | ReactNode[]
  }
  
   const Loadable = (Component: ElementType) => {
    return function Load(props: LoadProps) {
        return (
          <Suspense
            fallback={
            <LoadingScreen />
            }
            >
            <Component {...props} />
		  </Suspense>
		 )
	}
   }
  ${componentsDefs}
  export const routes:RouteObject[] = [${routeDefs}];
 
												  
  `

	fs.writeFileSync(
		path.join(__dirname, '../src/routes/routes.tsx'),
		prettier.format(file, { parser: "babel-ts" })

	)
}

main()
