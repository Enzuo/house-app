import { loadHouses, generateImageStructure } from '../../logic/dataLoader'


export async function load({ params }) {
	// return {
	// 	post: {
	// 		title: `Title for ${params.slug} goes here`,
	// 		content: `Content for ${params.slug} goes here`
	// 	}
	// };
	let houses = await loadHouses()
	return {houses}
}
