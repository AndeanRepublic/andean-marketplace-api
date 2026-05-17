/**
 * Strategy Pattern para filtrado de órdenes basado en rol.
 * Cada rol (ADMIN, SELLER) implementa su propia lógica de filtrado.
 *
 * Sigue el patrón Strategy para permitir agregar nuevos roles
 * sin modificar el código existente (Open/Closed Principle).
 */
export interface OrderFilterStrategy {
	/**
	 * Construye el filtro MongoDB para obtener órdenes según el rol del usuario.
	 * @param user - Usuario autenticado con rol y datos del token JWT
	 * @returns Filtro MongoDB (objeto query) para aplicar en la consulta
	 */
	buildFilter(user: any): Promise<Record<string, any>>;
}
