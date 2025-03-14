/**
 * Finds all duplicate items in an array and return them.
 *
 * @param {Array} array Any array.
 * @return {Array} All values in the input array that were duplicated.
 */
function findDuplicates( array ) {
	const duplicates = [];
	const counts = {};

	for ( let i = 0; i < array.length; i++ ) {
		const item = array[ i ];
		counts[ item ] = counts[ item ] >= 1 ? counts[ item ] + 1 : 1;
		if ( counts[ item ] > 1 ) {
			duplicates.push( item );
		}
	}

	return duplicates;
}

/**
 * Collects and combines multiple objects of similar shape.
 *
 * Used to combine objects like actions, selectors, etc. for a data
 * store while ensuring no keys/action names/selector names are duplicated.
 *
 * Effectively this is an object spread, but throws an error if keys are
 * duplicated.
 *
 * @param {...Object} items A list of arguments, each one should be an object to combine into one.
 * @return {Object} The combined object.
 */
export function collect( ...items ) {
	const collectedObject = items.reduce( ( acc, item ) => {
		return { ...acc, ...item };
	}, {} );

	const functionNames = items.reduce( ( acc, itemSet ) => {
		return [ ...acc, ...Object.keys( itemSet ) ];
	}, [] );
	const duplicates = findDuplicates( functionNames );

	if ( duplicates.length ) {
		throw new Error(
			`collect() cannot accept collections with duplicate keys. Your call to collect() contains the following duplicated functions: ${ duplicates.join(
				', '
			) }. Check your data stores for duplicates.`
		);
	}

	return collectedObject;
}

export const collectActions = collect;
export const collectControls = collect;
export const collectResolvers = collect;
export const collectSelectors = collect;
export const collectState = collect;

/**
 * Collects all reducers and (optionally) provides initial state.
 *
 * If the first argument passed is not a function, it will be used as the
 * combined reducer's `initialState`.
 *
 * @param {...(Object|Function)} args A list of reducers, each containing their own controls. If the first argument is not a function, it will be used as the combined reducer's `initialState`.
 * @return {Function} A Redux-style reducer.
 */
export function collectReducers( ...args ) {
	const reducers = [ ...args ];
	let initialState;

	if ( typeof reducers[ 0 ] !== 'function' ) {
		initialState = reducers.shift();
	}

	return ( state = initialState, action = {} ) => {
		return reducers.reduce( ( newState, reducer ) => {
			return reducer( newState, action );
		}, state );
	};
}

/**
 * Passes through state unmodified; eg. an empty reducer.
 *
 * @param {Object} state A store's state.
 * @return {Object} The same state data as passed in `state`.
 */
function passthroughReducer( state ) {
	return state;
}

/**
 * Combines multiple stores.
 *
 * @param {...Object} stores A list of objects, each a store containing one or more of the following keys: initialState, actions, controls, reducer, resolvers, selectors.
 * @return {Object} The combined store.
 */
export default function combineStores( ...stores ) {
	const combinedInitialState = collectState(
		...stores.map( ( store ) => store.initialState || {} )
	);

	return {
		initialState: combinedInitialState,
		controls: collectControls(
			...stores.map( ( store ) => store.controls || {} )
		),
		actions: collectActions(
			...stores.map( ( store ) => store.actions || {} )
		),
		reducer: collectReducers(
			combinedInitialState,
			...stores.map( ( store ) => store.reducer || passthroughReducer )
		),
		resolvers: collectResolvers(
			...stores.map( ( store ) => store.resolvers || {} )
		),
		selectors: collectSelectors(
			...stores.map( ( store ) => store.selectors || {} )
		),
	};
}
